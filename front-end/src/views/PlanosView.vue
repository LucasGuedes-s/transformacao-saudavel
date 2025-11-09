<template>
  <NavBar />
  <div id="app" class="container py-5">
    <h1 class="text-center mb-5 fw-bold text-danger">Escolha Seu Plano</h1>

    <div class="d-flex justify-content-center">
      <div class="row row-cols-1 row-cols-md-3 g-4 justify-content-center">
        <!-- Plano Básico -->
        <div class="col">
          <div class="card plano-card shadow-lg border-0 h-100">
            <div class="card-header bg-danger text-white fw-bold fs-5 py-3">
              Plano Básico
            </div>
            <div class="card-body d-flex flex-column align-items-center justify-content-between">
              <div>
                <h2 class="card-title fw-bold">R$ 16,90</h2>
                <p class="text-muted mb-3">O mais vendido 🔥</p>

                <ul class="list-group list-group-flush text-start w-100 mb-3">
                  <li class="list-group-item">☕ Receitas de Café da Manhã</li>
                  <li class="list-group-item">🍛 Receitas de Almoço</li>
                  <li class="list-group-item">🌙 Receitas de Jantar</li>
                </ul>
              </div>

              <button class="btn btn-danger btn-lg w-75 mt-3" @click="iniciarPagamento">
                💳 Assinar Agora
              </button>
            </div>
          </div>
        </div>

        <!-- Outros planos (indisponíveis) -->
        <div class="col" v-for="(plano, i) in planosIndisponiveis" :key="i">
          <div class="card plano-card shadow-sm border-0 h-100 unavailable">
            <div class="card-header text-white fw-bold py-3" :style="{ backgroundColor: plano.cor }">
              {{ plano.nome }}
            </div>
            <div class="card-body d-flex flex-column align-items-center justify-content-between">
              <div>
                <h2 class="card-title fw-bold">{{ plano.preco }}</h2>
                <p class="text-muted mb-3">{{ plano.descricao }}</p>
                <ul class="list-group list-group-flush text-start w-100 mb-3">
                  <li v-for="(item, j) in plano.itens" :key="j" class="list-group-item">{{ item }}</li>
                </ul>
              </div>
              <button class="btn btn-secondary btn-lg w-75 mt-3 disabled" disabled>
                🚫 Indisponível
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/* eslint-disable */ 
import { onMounted } from "vue";
import NavBar from "@/components/NavDash.vue";
import { useAuthStore } from "@/store/store.js";

let mp;

onMounted(() => {
  // Inicializa o SDK do Mercado Pago
  mp = new MercadoPago("APP_USR-69f1a03a-b972-4258-bfff-d7bbaecda97f", {
    locale: "pt-BR",
  });
});

const planosIndisponiveis = [
  {
    nome: "Plano Intermediário",
    preco: "R$ 29,90",
    cor: "#0065e9",
    descricao: "Receitas exclusivas",
    itens: [
      "Todas as Receitas do Plano Básico",
      "🍎 Receitas de Lanches Saudáveis",
      "🥗 Receitas Especiais para Dietas",
    ],
  },
  {
    nome: "Plano Premium",
    preco: "R$ 79,90",
    cor: "#004aad",
    descricao: "Receitas completas + suporte com Nutricionista",
    itens: [
      "Todas as Receitas do Plano Intermediário",
      "👩‍⚕️ Consultoria com Nutricionista",
      "📋 Plano Alimentar Personalizado",
    ],
  },
];

async function iniciarPagamento() {
  try {
    const email = useAuthStore().usuario.email; // Pega o email do usuário logado
    const res = await fetch(`https://transformacao-saudavel.onrender.com/criar-pagamento/${email}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (!data.id) {
      alert("Erro ao criar pagamento. Tente novamente.");
      return;
    }

    // Abre o checkout do Mercado Pago
    mp.checkout({
      preference: { id: data.id },
      autoOpen: true,
      theme: {
        elementsColor: "#dc3545", // vermelho do Bootstrap danger
        headerColor: "#dc3545",
      },
    });
  } catch (error) {
    console.error("Erro ao iniciar o pagamento:", error);
    alert("Erro ao iniciar pagamento. Tente novamente.");
  }
}
</script>

<style scoped>
/* Layout geral */
.container {
  max-width: 1100px;
}

/* Card dos planos */
.plano-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-radius: 1rem;
}

.plano-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

/* Itens da lista */
.list-group-item {
  border: none;
  background-color: transparent;
  font-size: 0.95rem;
}

/* Planos indisponíveis */
.unavailable {
  background-color: #f8f9fa;
  color: #bbb;
  opacity: 0.8;
  pointer-events: none;
}

.unavailable .list-group-item {
  color: #ccc;
}

.unavailable .btn {
  background-color: #ccc;
  border: none;
  color: #666;
}
</style>
