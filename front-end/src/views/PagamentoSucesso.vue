<template>
  <div class="container text-center mt-5 pagamento-container">
    <div class="status-card shadow-lg p-5 rounded-4">
      <div class="spinner-border text-success mb-4" style="width: 4rem; height: 4rem;" role="status">
        <span class="visually-hidden">Carregando...</span>
      </div>

      <h2 class="fw-bold text-success">Pagamento em Processamento 🎉</h2>
      <p class="text-muted mt-3 fs-5">
        Seu pagamento está sendo verificado. O processamento pode levar até 
        <strong>10 minutos</strong>. Assim que for confirmado, 
        você receberá uma notificação informando que suas receitas estão disponíveis.
      </p>

      <div class="progress mt-4" style="height: 10px;">
        <div 
          class="progress-bar progress-bar-striped progress-bar-animated bg-success" 
          role="progressbar" 
          style="width: 75%"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Nenhuma lógica necessária por enquanto
</script>

<style scoped>
.pagamento-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 70vh;
}

.status-card {
  background-color: #ffffff;
  max-width: 600px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.status-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}
</style>
