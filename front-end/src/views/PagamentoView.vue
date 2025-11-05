<template>
  <div class="checkout-container">
    <button @click="abrirCheckout" class="btn btn-primary">
      💳 Pagar com Mercado Pago
    </button>
  </div>
</template>

<script setup>
 /* eslint-disable */ 
import { onMounted } from "vue";

let mp;

onMounted(() => {
  mp = new MercadoPago("APP_USR-69f1a03a-b972-4258-bfff-d7bbaecda97f", {
    locale: "pt-BR",
  });
});

async function abrirCheckout() {
  try {
    const email = 'lucasguedes2908@gmail.com'; // Substitua pelo email do usuário
    const res = await fetch(`https://transformacao-saudavel.onrender.com/criar-pagamento/${email}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();

    if (!data.id) {
      alert("Erro ao criar pagamento");
      return;
    }

    // Abre o Checkout Pro em modo modal (sem redirecionar)
    mp.checkout({
      preference: { id: data.id },
      autoOpen: true, // Abre automaticamente o modal
      theme: {
        elementsColor: '#0d6efd',
        headerColor: '#0d6efd',
      },
    });
  } catch (error) {
    console.error(error);
    alert("Erro ao iniciar pagamento");
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
