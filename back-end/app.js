var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config({ path: '.env' }); // Certifique-se de carregar as variáveis de ambiente
const cors = require('cors');

// Importando a configuração do Mercado Pago
const mercadopago = require('mercadopago'); // Usando a versão correta do SDK

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// Configuração do Mercado Pago com a chave do token de acesso no .env
mercadopago.configurations = {
  access_token: process.env.MERCADO_PAGO_ACCESS_TOKEN
};
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

// Rota para gerar a preferência de pagamento
app.post('/criar-pagamento', (req, res) => {
  // Configuração do produto e dados do pagamento
  const preference = {
    items: [
      {
        title: 'Plano Básico', // Nome do plano ou produto
        unit_price: 9.90, // Preço do produto
        quantity: 1, // Quantidade
      },
    ],
    back_urls: {
      success: 'http://localhost:8080/', // URL de sucesso
      failure: 'http://localhost:8080/', // URL de falha
      pending: 'http://localhost:8080/', // URL para status pendente
    },
    auto_return: 'approved', // Retorno automático ao finalizar o pagamento
  };
  // Criar a preferência de pagamento no Mercado Pago
  mercadopago.preferences.create(preference)
    .then(function(response) {
      console.log(response)
      const id = response.body.id; // ID da preferência
      res.json({ id: id }); // Retorna o ID para ser usado no front-end
    })
    .catch(function(error) {
      console.error(error);
      res.status(500).send("Erro ao criar o pagamento");
    });
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
