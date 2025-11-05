var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
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

// 🔐 Inicializa o cliente do Mercado Pago
const client = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN,
});

// 🧾 Rota de criação do pagamento
app.post("/criar-pagamento", async (req, res) => {
  try {
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
          success: "https://transformacao-saudavel.vercel.app/pagamento-sucesso",
          failure: "https://transformacao-saudavel.vercel.app/cadastro",
          pending: "https://transformacao-saudavel.vercel.app/login",
        },
        auto_return: "approved",
      },
    });

    res.json({ id: result.id });
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao criar pagamento");
  }
});
// Rota de webhook para notificações de pagamento
app.post('/webhook', async (req, res) => {
  try {
    const payment = req.body;
    
    if (payment.type === 'payment' && payment.data && payment.data.id) {
      const paymentId = payment.data.id;
      console.log("🔔 Pagamento recebido:", paymentId);

      res.status(200).send('Webhook processado com sucesso');
    } else {
      res.status(200).send('Notificação ignorada');
    }
  } catch (error) {
    console.error("Erro no webhook:", error);
    res.status(500).send("Erro no webhook");
  }
});
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
