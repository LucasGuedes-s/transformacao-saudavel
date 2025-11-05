<template>
  <div class="checkout-container">
    <button @click="iniciarPagamento" class="btn btn-primary">
      💳 Pagar com Mercado Pago
    </button>

    <div v-if="pagamentoPendente">
      <p>⏳ Aguardando confirmação do pagamento...</p>
    </div>
  </div>
</template>

<script setup>
/* eslint-disable */
import { ref, onMounted } from 'vue'

let mp
const pagamentoPendente = ref(false)
let pagamentoId = null

onMounted(() => {
  mp = new MercadoPago("APP_USR-69f1a03a-b972-4258-bfff-d7bbaecda97f", {
    locale: "pt-BR",
  });
});

async function iniciarPagamento() {
  try {
    const response = await fetch("https://transformacao-saudavel.onrender.com/criar-pagamento", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();

    if (!data.id) {
      alert("Erro ao gerar pagamento");
      return;
    }

    pagamentoId = data.id;
    pagamentoPendente.value = true;

    mp.checkout({
      preference: { id: data.id },
      autoOpen: true,
    });

    // Começa a verificar o status
    verificarStatusPagamento();
  } catch (error) {
    console.error(error);
    alert("Erro ao iniciar o pagamento");
  }
}

async function verificarStatusPagamento() {
  const intervalo = setInterval(async () => {
    const res = await fetch(`https://transformacao-saudavel.onrender.com/status-pagamento/${pagamentoId}`);
    const data = await res.json();

    if (data.status === "approved") {
      clearInterval(intervalo);
      window.location.href = "/meu-cardapio"; // ✅ redireciona automaticamente
    }
  }, 5000); // verifica a cada 5 segundos
}
</script>

<style scoped>
.checkout-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 2rem;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 10px;
}
</style>
