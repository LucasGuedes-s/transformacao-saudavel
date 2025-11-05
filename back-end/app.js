var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


require('dotenv').config({ path: '.env' }); // Certifique-se de carregar as variáveis de ambiente
const cors = require('cors');

// Importando a configuração do Mercado Pago
const { MercadoPagoConfig, Preference } = require("mercadopago");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();


// Adicionando o middleware de CORS
app.use(cors({
  origin: '*', // Permitir apenas o front-end local
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Cabeçalhos permitidos
  credentials: true, // Permitir cookies/sessões
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});

app.post("/criar-pagamento/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const preference = new Preference(client);

    const result = await preference.create({
      body: {
        items: [
          {
            title: "Plano Básico",
            quantity: 1,
            unit_price: 0.9,
            currency_id: "BRL",
          },
        ],
        back_urls: {
          success: "https://transformacao-saudavel.vercel.app/meu-perfil",
          failure: "https://transformacao-saudavel.vercel.app/cadastro",
          pending: "https://transformacao-saudavel.vercel.app/meu-perfil",
        },
        auto_return: "approved",
      },
    });

    // 🔍 Adicione isso para ver o retorno completo
    //console.log("RESULTADO MP:", result);

    // Corrige o acesso ao ID, dependendo da estrutura retornada
    const preferenceId =
      result.id || result.preference_id || result.body?.id || result.body?.preference_id;

    if (!preferenceId) {
      console.error("❌ ID não encontrado no retorno do Mercado Pago:", result);
      return res.status(500).send("Erro ao criar preferência de pagamento");
    }

    // Salva no banco
    await prisma.pagamento.create({
      data: {
        preferenceId: preferenceId,
        valor: 0.9,
        status: "pendente",
        email: email,
      },
    });

  res.json({ id: preferenceId });

  } catch (error) {
    console.error("Erro ao criar pagamento:", error);
    res.status(500).send("Erro ao criar pagamento");
  }
});
import express from "express";
import mercadopago from "mercadopago";
import { prisma } from "./prismaClient.js"; // importe seu cliente do Prisma

const app = express();

app.use(express.json());

app.post("/webhook", async (req, res) => {
  try {
    const payment = req.body;

    if (payment.type === "payment") {
      const paymentId = payment.data.id;

      // Consulta o status atualizado no Mercado Pago
      const mpPayment = await mercadopago.payment.findById(paymentId);

      const status = mpPayment.body.status;

      // Atualiza no banco via Prisma
      await prisma.pagamento.updateMany({
        where: { mp_payment_id: paymentId },
        data: { status },
      });

      console.log(`💰 Pagamento ${paymentId} atualizado para: ${status}`);
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("❌ Erro no webhook:", error);
    res.sendStatus(500);
  }
});


app.get('/status-pagamento/:preferenceId', async (req, res) => {
  try {
    const pagamento = await prisma.pagamento.findUnique({
      where: { preferenceId: req.params.preferenceId },
    })

    if (!pagamento) {
      return res.status(404).json({ error: 'Pagamento não encontrado' })
    }

    res.json(pagamento)
  } catch (error) {
    console.error('Erro ao buscar status:', error)
    res.status(500).json({ error: 'Erro no servidor' })
  }
})

app.post('/api/pagamento-confirmado', async (req, res) => {
  try {
    const { paymentId, email } = req.body;

    const user = prisma.user.update({
      where: { email },
      data: { pagamento: true },
    });

    console.log(`💰 Pagamento confirmado (ID: ${paymentId})`);
    res.status(200).send('Status atualizado');
  } catch (error) {
    console.error('Erro ao confirmar pagamento:', error);
    res.status(500).send('Erro ao confirmar pagamento');
  }
});

// Rota de sucesso (pode ser personalizada)
app.get('/success', (req, res) => {
  res.send('Pagamento realizado com sucesso!');
});

// Rota de falha (pode ser personalizada)
app.get('/failure', (req, res) => {
  res.send('Pagamento não autorizado ou falhou!');
});

// Rota de pendência (pode ser personalizada)
app.get('/pending', (req, res) => {
  res.send('Pagamento pendente!');
});

// Definição das rotas
app.use('/', indexRouter);
app.use('/user', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
