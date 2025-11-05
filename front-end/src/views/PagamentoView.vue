<template>
  <div class="checkout-container">
    <button @click="iniciarPagamento" class="btn btn-primary">
      💳 Pagar com Mercado Pago
    </button>
  </div>
</template>

<script setup>
/* eslint-disable no-undef */
import { onMounted } from 'vue'

let mp

onMounted(() => {
  // Inicializa o SDK do Mercado Pago (vem do script importado no index.html)
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

    mp.checkout({
      preference: {
        id: data.id,
      },
      autoOpen: true,
    });
  } catch (error) {
    console.error(error);
    alert("Erro ao iniciar o pagamento");
  }
}
</script>

<style scoped>
.checkout-container {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}
button {
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 10px;
}
</style>
