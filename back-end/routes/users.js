var express = require('express');
var router = express.Router();
const config= require('../config/app.config')
const bcrypt = require('../utils/bcrypt.util');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { enviarEmailCadastro } = require('../utils/email.js')

/* Rota de login */
router.post('/login', async (req, res) => {
  const { email, password } = req.body.usuario;
  const user = await prisma.User.findUnique({ where: { email } });

  if (!user) return res.status(404).json({ error: "Usuário não encontrado." });

  const validado = bcrypt.compare(password, user.senha);
  if (!validado) return res.status(401).json({ error: "Usuário ou senha" });

  const token = jwt.sign(user, config.jwtSecret, {
      expiresIn: 86400 // 24 horas
  });
  res.setHeader('Authorization', `Bearer ${token}`);
  res.status(200).json({ 
      user: user
  });
  res.end()
});
router.post('/login-google', async (req, res) => {
  const { uid, email, displayName, photoURL } = req.body;

  try {
    // Verificar se o usuário já existe no banco
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Criar novo usuário se não existir
      user = await prisma.user.create({
        data: {
          firebaseUid: uid,
          email,
          nome: displayName,
          senha: '',
          pagamento: false,
          foto: [photoURL],
          receitasFavoritas: [],

        },
      });
    } else {
      // Atualizar informações do usuário existente
      user = await prisma.user.update({
        where: { email },
        data: {
          firebaseUid: uid,
          foto: [photoURL],
        },
      });
    }

    // Gerar token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Retornar resposta ao cliente
    res.status(200).json({
      message: 'Login realizado com sucesso!',
      token,
      user,
    });
  } catch (error) {
    console.error("Erro no login com Google:", error);
    res.status(500).json({ message: 'Erro ao processar login.' });
  }
});

router.post('/cadastro', async (req, res) => {
  try {
    const { email, senha, nome, foto } = req.body.usuario;
    const nova_senha = bcrypt.hash(senha, 10)

    // Validação básica dos dados (opcional)
    if (!email || !senha || !nome) {
      return res.status(400).json({ error: 'Os campos email, senha e nome são obrigatórios.' });
    }

    // Criar o usuário no banco de dados
    const newUser = await prisma.User.create({
      data: {
        email,
        senha: nova_senha,
        nome,
        foto: foto || [], // Array vazio como padrão
        receitasFavoritas: [],

      },
    });
    await enviarEmailCadastro(email, nome)
    // Responder com o usuário criado
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao criar o usuário.' });
  }
});

router.post("/:id/historico", async (req, res) => {
  const { id } = req.params;
  const { peso, comentario } = req.body;
  console.log("Adicionando histórico para usuário:", id, "Peso:", peso, "Comentário:", comentario);
  try {
    if (!peso || isNaN(peso)) {
      return res.status(400).json({ error: "Peso inválido" });
    }

    const usuario = await prisma.user.update({
      where: { id },
      data: {
        historicoPeso: {
          push: {
            peso: parseFloat(peso),
            data: new Date(),
          },
        },
        comentarios: comentario
          ? {
              push: {
                texto: comentario,
                data: new Date(),
              },
            }
          : undefined,
        peso: peso.toString(), // atualiza o peso atual também
      },
    });

    res.status(200).json({
      message: "Histórico e comentário adicionados com sucesso!",
      usuario,
    });
  } catch (error) {
    console.error("Erro ao adicionar histórico:", error);
    res.status(500).json({ error: "Erro ao adicionar histórico" });
  }
});

/**
 * GET /usuarios/:id/historico
 * Retorna o histórico de peso e comentários do usuário
 */
router.get("/:id/historico", async (req, res) => {
  const { id } = req.params;

  try {
    const usuario = await prisma.user.findUnique({
      where: { id },
      select: {
        nome: true,
        historicoPeso: true,
        comentarios: true,
      },
    });

    if (!usuario) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    res.status(200).json(usuario);
  } catch (error) {
    console.error("Erro ao buscar histórico:", error);
    res.status(500).json({ error: "Erro ao buscar histórico" });
  }
});

module.exports = router;
