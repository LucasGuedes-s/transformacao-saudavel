<template>
    <div>
      <NavBar />
      <div class="container text-center mt-5">
        <h1 class="text-primary">Transforme sua Vida com a Nossa Tecnologia Inteligente!</h1>
        <p class="lead">
          Na <strong>Transformação Saudável</strong>, acreditamos que cada jornada de emagrecimento é única!  
          Por isso, desenvolvemos um sistema inovador que cria 
          <span class="text-success fw-bold">receitas e dietas personalizadas</span> para cada pessoa,  
          levando em consideração suas necessidades, preferências e objetivos.
        </p>
      </div>
    </div>
  </template>
  
  <script>
  import NavBar from '@/components/NavBar.vue';
  
  export default {
    components: {
      NavBar
    },
  };
  </script>
  
  <style scoped>
  
  @media screen and (max-width: 600px) {
    .vh-100 {
      height: 50vh !important;
    }
    .card .p-5 .shadow-lg {
      width: 25rem;
    }
  }
  </style>
  