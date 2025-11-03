<template>
  <div class="landing-page">
    <!-- NAVBAR -->
    <NavBar class="landing-navbar" />

    <!-- HERO -->
    <header class="hero-section text-center text-white py-5">
      <div class="container">
        <h1 class="fw-bold">Transforme sua vida com saúde 💙</h1>
        <p class="lead mt-3">
          Descubra o caminho para o emagrecimento saudável com receitas e eBooks exclusivos por apenas <strong>R$ 9,90</strong>.
        </p>
            <span class="price-badge d-inline-block mt-4" @click="subscribe">
            Apenas <strong>R$ 9,90</strong>
            </span>
      </div>
    </header>

    <!-- BENEFÍCIOS -->
    <section class="features-section py-5 text-center">
      <div class="container">
        <h2 class="fw-bold mb-5">O que você vai encontrar</h2>

        <div class="row g-4">
          <div class="col-md-4" v-for="(feature, index) in features" :key="index">
            <div class="feature-card p-4">
              <img :src="feature.icon" :alt="feature.title" width="96" height="96" />
              <h4 class="mt-3">{{ feature.title }}</h4>
              <p>{{ feature.text }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA FINAL -->
    <section class="cta-section text-center text-white py-5">
      <div class="container">
        <h2 class="fw-bold">Comece sua transformação agora mesmo!</h2>
        <p class="lead mt-2">
          Apenas R$ 9,90 para ter acesso completo a todo o conteúdo da plataforma.
        </p>
        <button class="cta-button mt-3" @click="subscribe">Quero começar agora</button>
      </div>
    </section>

    <!-- RODAPÉ -->
    <footer class="text-center text-white py-3">
      <p class="mb-0">© 2025 Transformação Saudável — Todos os direitos reservados</p>
    </footer>
  </div>
</template>

<script setup>
import { ref } from "vue";
import router from "@/router";
import NavBar from "@/components/NavBar.vue";

const features = ref([
  {
    title: "Receitas Saudáveis",
    text: "Aprenda pratos saborosos e nutritivos que ajudam a manter o foco e o equilíbrio na sua jornada.",
    icon: "https://img.icons8.com/fluency/96/salad.png",
  },
  {
    title: "Ebooks Exclusivos",
    text: "Tenha acesso a materiais que te guiam no processo de emagrecimento com dicas de especialistas.",
    icon: "https://img.icons8.com/fluency/96/books.png",
  },
  {
    title: "Apoio e Motivação",
    text: "Mantenha-se motivado com conteúdos inspiradores e acompanhamento de hábitos saudáveis.",
    icon: "https://cdn-icons-png.flaticon.com/512/1006/1006627.png",
  },
]);

const subscribe = () => {
  router.push("/cadastro");
};
</script>

<style scoped>
.landing-page {
  font-family: "Poppins", sans-serif;
  background-color: #f7f9f8;
}

/* NAVBAR */
.landing-navbar {
  background-color: white;
  border-bottom: 2px solid #004aad;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 0;
  z-index: 999;
}

/* HERO */
.hero-section {
  background: linear-gradient(135deg, #004aad, #2563eb);
  padding-top: 100px;
}

.hero-section h1 {
  font-size: 2.5rem;
}

.price-badge {
  background: white;
  color: #004aad;
  font-weight: 700;
  padding: 10px 25px;
  border-radius: 30px;
  font-size: 1.1rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

/* FEATURES */
.features-section {
  background-color: #fff;
}

.features-section h2 {
  color: #004aad;
}

.feature-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  transition: 0.3s;
  height: 100%;
  border-top: 4px solid #004aad;
}

.feature-card:hover {
  transform: translateY(-5px);
}

/* CTA */
.cta-section {
  background: linear-gradient(135deg, #2563eb, #004aad);
}

.cta-button {
  background: white;
  color: #004aad;
  border: none;
  border-radius: 30px;
  padding: 15px 40px;
  font-size: 1.1rem;
  font-weight: 600;
  transition: 0.3s;
}

.cta-button:hover {
  background: #f1f1f1;
  transform: scale(1.05);
}

/* FOOTER */
footer {
  background-color: #003380;
  font-size: 0.9rem;
}
</style>
