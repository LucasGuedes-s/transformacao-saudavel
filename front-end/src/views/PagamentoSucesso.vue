<template>
  <div class="container text-center mt-5">
    <h2>🎉 Pagamento confirmado!</h2>
    <p>Redirecionando para a tela inicial...</p>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(async () => {
  const urlParams = new URLSearchParams(window.location.search)
  const paymentId = urlParams.get('payment_id')
  const status = urlParams.get('status')

  if (status === 'approved' && paymentId) {
    await fetch('https://transformacao-saudavel.onrender.com/api/pagamento-confirmado', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentId })
    })
  }

  // Redireciona o usuário
  setTimeout(() => {
    window.location.href = '/'
  }, 2000)
})
</script>
