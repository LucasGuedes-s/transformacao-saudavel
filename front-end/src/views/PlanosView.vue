<template>
  <NavBar />
  <div id="app" class="container py-5">
    <h1 class="text-center mb-4">Escolha Seu Plano</h1>
    <div class="d-flex justify-content-center">
      <div class="row row-cols-1 row-cols-md-3 g-4">
        <!-- Plano Básico -->
        <div class="col">
          <div class="card text-center shadow-sm h-100">
            <div class="card-header bg-danger text-white">Plano Básico</div>
            <div class="card-body">
              <h2 class="card-title">R$ 16,90</h2>
              <p class="card-title">O mais vendido</p>
              <h6 class="card-text">Receitas para emagrecer 🔥</h6>
              <ul class="list-group list-group-flush">
                <li class="list-group-item">Receitas de Café da Manhã</li>
                <li class="list-group-item">Receitas de Almoço</li>
                <li class="list-group-item">Receitas de Jantar</li>
              </ul>
              <button class="btn btn-danger mt-3" @click="iniciarPagamento()">
                Assinar
              </button>
            </div>
          </div>
        </div>
        <!-- Plano Intermediário 
        <div class="col">
          <div class="card text-center shadow-sm h-100 unavailable">
            <div class="card-header text-white" style="background-color: #0065e9">Plano Intermediário</div>
            <div class="card-body">
              <h2 class="card-title">R$ 29,90</h2>
              <p class="card-text">Receitas exclusivas</p>
              <ul class="list-group list-group-flush">
                <li class="list-group-item">Todas as Receitas do Plano Básico</li>
                <li class="list-group-item">Receitas de Lanches Saudáveis</li>
                <li class="list-group-item">Receitas Especiais para Dietas</li>
              </ul>
              <button class="btn mt-3 disabled" disabled>
                Indisponível
              </button>
            </div>
          </div>
        </div>

        <div class="col">
          <div class="card text-center shadow-sm h-100 unavailable">
            <div class="card-header text-white" style="background-color: #004aad">Plano Premium</div>
            <div class="card-body">
              <h2 class="card-title">R$ 79,90</h2>
              <p class="card-text">Receitas completas + suporte com Nutricionista.</p>
              <ul class="list-group list-group-flush">
                <li class="list-group-item">Todas as Receitas do Plano Intermediário</li>
                <li class="list-group-item">Consultoria com Nutricionista</li>
                <li class="list-group-item">Plano Alimentar Personalizado</li>
              </ul>
              <button class="btn mt-3 disabled" disabled>
                Indisponível
              </button>
            </div>
          </div>
        </div>-->

      </div>
    </div>
  </div>
</template>

<script>
import NavBar from '@/components/NavDash.vue';

export default {
  name: 'planos-view',
  components: {
    NavBar,
  },
  methods: {
    async iniciarPagamento() {
      try {        
        window.location.href = '';
      } catch (error) {
        console.error("Erro ao iniciar o pagamento:", error);
        alert("Erro ao gerar o link de pagamento. Tente novamente.");
      }

    },
  }
}
</script>

<style scoped>
/* Ajuste o tamanho mínimo das cartas */
.card {
  min-width: 18rem;
  max-width: 22rem;
}

.card-body {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

h2.card-title {
  font-size: 2rem;
}

.row {
  display: flex;
  justify-content: center;
  /* Alinha os itens ao centro */
}

.col {
  justify-content: center;
}

.card-body {
  padding: 20px;
}
.unavailable {
  background-color: #f0f0f0; /* Fundo cinza claro */
  color: #aaa; /* Texto cinza */
}

.unavailable .card-header {
  background-color: #d6d6d6; /* Fundo do header cinza mais escuro */
  color: #999; /* Texto cinza */
}

.unavailable .list-group-item {
  color: #bbb; /* Texto dos itens da lista */
}

.unavailable button {
  background-color: #ccc; /* Fundo cinza do botão */
  border-color: #bbb; /* Borda do botão */
  color: #666; /* Texto do botão */
  cursor: not-allowed; /* Cursor de não permitido */
}

</style>