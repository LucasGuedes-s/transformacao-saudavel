var express = require('express');
var router = express.Router();
const { MongoClient } = require('mongodb'); // Certifique-se de que o MongoDB está instalado

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

router.post('/adicionar-comprovante', async (req, res) => {
  const { email, comprovante } = req.body; // Recebe o email e o(s) comprovante(s)

  // Verifica se o email e o comprovante foram fornecidos
  if (!email || !comprovante) {
    return res.status(400).json({ error: 'O campo email e comprovante são obrigatórios.' });
  }

  try {
    // Se o usuário não for encontrado, cria um novo documento
    const novoComprovante = await prisma.comprovantes.create({
      data: {
        status: "Análise",
        email,
        comprovante: Array.isArray(comprovante) ? comprovante : [comprovante], // Garantir que seja um array
      },
    });
    return res.status(201).json({ message: 'Comprovante adicionado com sucesso!', data: novoComprovante });
  
  } catch (error) {
    console.error('Erro ao adicionar comprovante:', error);
    return res.status(500).json({ error: 'Erro interno ao processar o comprovante.' });
  }
});

router.get('/comprovantes/analise', async (req, res) => {
  try {
    // Filtra os comprovantes que estão com status 'análise'
    const comprovantesAnalise = await prisma.comprovantes.findMany({
      where: {
        status: 'Análise', // Filtra pelo status
      },
    });

    // Retorna os comprovantes encontrados
    if (comprovantesAnalise.length > 0) {
      return res.status(200).json(comprovantesAnalise);
    } else {
      return res.status(404).json({ message: 'Nenhum comprovante em análise encontrado.' });
    }
  } catch (error) {
    console.error('Erro ao buscar comprovantes:', error);
    return res.status(500).json({ error: 'Erro interno ao buscar os comprovantes.' });
  }
});

router.put('/aceitar-comprovante/:email', async (req, res) => {
  const { email } = req.params;

  try {
    console.log(email);
    
    // Tenta atualizar o status do comprovante
    const comprovante = await prisma.Comprovantes.updateMany({
      where: { email: email, status: 'Análise' }, // Verifica se o comprovante está em "análise"
      data: { status: 'aceito' } // Atualiza o status do comprovante para "aceito"
    });

    if (comprovante.count === 0) {
      return res.status(404).json({ error: 'Comprovante não encontrado ou não está em análise.' });
    }

    // Atualiza o status de pagamento do usuário
    await prisma.user.update({
      where: { email },
      data: { pagamento: true }
    });

    res.status(200).json({ message: 'Comprovante aceito e status de pagamento atualizado.' });
  } catch (error) {
    console.error('Erro ao aceitar o comprovante:', error);
    res.status(500).json({ error: 'Erro interno no servidor.' });
  }
});

router.get('/user/pagamento', async (req, res) => {
  try {
    const email = req.query.email;
    const usuario = await prisma.user.findUnique({
      where: { email: email },
      select: {
        pagamento: true,
      },
    });
    return res.status(200).json({ message: 'Sucesso!', pagamento: usuario.pagamento });

  } catch (error) {
    return 'Usuário não encontrado.';
  }
})
// Rota para atualizar os dados do usuário
router.put('/update-user', async (req, res) => {
  const { email, peso, altura, idade, calorias, almoco, cafe, jantar, lanches } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'O campo email é obrigatório.' });
  }

  try {
    // Cria o array de preferências concatenando os valores fornecidos
    const preferencias = [
      ...(cafe && cafe.length ? cafe : []),
      ...(almoco && almoco.length ? almoco : []),
      ...(jantar && jantar.length ? jantar : []),
    ];

    // Atualiza os dados do usuário no banco de dados
    const updatedUser = await prisma.user.update({
      where: { email },
      data: {
        peso: `${peso}` || undefined,
        altura: `${altura}` || undefined,
        idade: idade || undefined,
        calorias: parseFloat(calorias) || undefined,
        preferencias: preferencias.length ? preferencias : undefined,
      },
    });
    console.log(email)
    cadastrarReceitas(email)

    return res.status(200).json({ message: 'Dados atualizados com sucesso!', user: updatedUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao atualizar os dados do usuário.' });
  }
});

// Exemplo no backend (Node.js/Express)
router.post('/receitas', async (req, res) => {
  try {

    const novaReceita = await prisma.receita.create({
      data: {
        titulo: req.body.titulo,
        ingredientes: req.body.ingredientes,
        receita: req.body.receita,
        calorias: req.body.calorias, // Certifique-se de que calorias aceita valores nulos no schema
        tipo: req.body.tipo,
        foto: [req.body.foto], // Certifique-se de que o campo foto no schema suporta arrays
      },
    });
    res.status(201).json(novaReceita);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Erro ao criar receita' });
  }
});

// Rota para obter receitas agrupadas por tipo
router.get('/get-receitas', async (req, res) => {
  try {
    const receitas = await prisma.receita.findMany();
    return res.status(200).json(receitas);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao obter receitas.' });
  }
});

router.get('/user/get-receitas', async (req, res) => {

  const email = req.query.email; // Assume que o email do usuário está sendo passado na query.
  if (!email) {
    return res.status(400).json({ error: 'O campo email é obrigatório.' });
  }

  try {
    // Buscar o usuário com o email fornecido
    const usuario = await prisma.user.findUnique({
      where: { email: email },
      select: {
        id: true,
        receitasFavoritas: true, // Vamos pegar os IDs das receitas favoritas
      },
    });
    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    // Buscar as receitas favoritas do usuário usando os IDs
    const receitasFavoritas = await prisma.receita.findMany({
      where: {
        id: {
          in: usuario.receitasFavoritas, // Aqui estamos pegando apenas as receitas que estão nos favoritos
        },
      },
    });

    // Agrupar as receitas por tipo
    const agrupadas = receitasFavoritas.reduce((acc, receita) => {
      if (!acc[receita.tipo]) {
        acc[receita.tipo] = [];
      }
      acc[receita.tipo].push(receita);
      return acc;
    }, {});

    return res.status(200).json(agrupadas);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro ao obter receitas.' });
  }
});


//FUNÇÃO
async function cadastrarReceitas(req, res) {
  const email = req;

  if (!email) {
    return { error: 'O campo email é obrigatório.' };
  }

  try {
    // Busca o usuário no banco de dados pelo email
    const usuario = await prisma.user.findUnique({
      where: { email },
      select: {
        calorias: true, // Campo de calorias máximas do usuário
        preferencias: true, // Campo de preferências de não consumir alimentos
      },
    });

    if (!usuario) {
      return { error: 'Usuário não encontrado.' };
    }

    const { calorias, preferencias } = usuario;

    // Valida se o usuário possui calorias máximas e preferências configuradas
    if (!calorias || !preferencias || preferencias.length === 0) {
      return {
        error: 'As configurações do usuário estão incompletas. Configure calorias máximas e preferências.',
      };
    }

    // Separar os títulos das preferências (itens que o usuário não quer comer)
    const preferenciasTitulos = preferencias.map((pref) => pref.split(' - ')[0]);

    // Buscar todas as receitas que atendem ao limite de calorias
    const todasAsReceitas = await prisma.receita.findMany({
      where: {
        calorias: { lte: calorias },
      },
    });

    // Filtrar receitas removendo as que o usuário não quer consumir
    const receitasFiltradas = todasAsReceitas.filter(
      (receita) => !preferenciasTitulos.some((titulo) => receita.titulo.includes(titulo))
    );

    // Embaralhar as receitas restantes para exibir uma seleção aleatória
    const receitasAleatorias = receitasFiltradas.sort(() => Math.random() - 0.5);

    // Limitar a quantidade de receitas (caso precise)
    const receitasSelecionadas = receitasAleatorias.slice(0, 30);

    // Atualizar usuário com os IDs das receitas selecionadas
    const receitasFavoritasAtualizadas = receitasSelecionadas.map((r) => r.id);
    console.log(receitasFavoritasAtualizadas)
    await prisma.user.update({
      where: { email },
      data: { receitasFavoritas: receitasFavoritasAtualizadas },
    });

    return { message: 'Receitas atualizadas com sucesso!' };
  } catch (error) {
    console.error('Erro ao processar a requisição:', error);
    return { error: 'Erro interno no servidor.' };
  }
}

module.exports = router;
