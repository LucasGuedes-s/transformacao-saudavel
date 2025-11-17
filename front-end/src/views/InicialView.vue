<template>
  <div class="landing-page">
    <!-- NAVBAR -->
    <NavBar class="landing-navbar" />

    <!-- HERO -->
    <header class="hero-section text-center text-white py-5">
      <div class="container">
        <h1 class="fw-bold display-5">Transforme seu corpo. Transforme sua vida. 💙</h1>
        <p class="lead mt-3">
          Tenha acesso imediato a <strong>receitas saudáveis</strong>, <strong>eBooks exclusivos</strong> e um método simples para emagrecer com saúde — tudo isso por apenas <strong>R$ 16,90</strong>.
        </p>
        <span class="price-badge d-inline-block mt-4" @click="subscribe">
          Quero Começar por Apenas <strong>R$ 16,90</strong>
        </span>
      </div>
    </header>

    <!-- SESSÃO DE PROVA SOCIAL -->
    <section class="social-proof-section text-center py-5">
      <div class="container">
        <h2 class="fw-bold mb-4">+ de 5.000 vidas transformadas</h2>
        <p class="mb-5">Resultados reais de pessoas que seguiram o método e mudaram sua rotina para sempre:</p>

        <div class="row g-4">
          <div class="col-md-4" v-for="(depo, index) in depoimentos" :key="index">
            <div class="depo-card p-4">
              <img :src="depo.foto" class="depo-foto mb-3" />
              <h5 class="fw-bold">{{ depo.nome }}</h5>
              <p class="fst-italic">"{{ depo.texto }}"</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- BENEFÍCIOS -->
    <section class="features-section py-5 text-center">
      <div class="container">
        <h2 class="fw-bold mb-5">O que você vai receber</h2>

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

    <!-- BONUS SECTION -->
    <section class="bonus-section py-5 text-center text-white">
      <div class="container">
        <h2 class="fw-bold mb-4">🎁 Bônus Especial</h2>
        <p class="lead">
          Ao adquirir hoje, você também recebe <strong>um guia de hábitos saudáveis</strong> para manter sua evolução no longo prazo!
        </p>
      </div>
    </section>

    <!-- CTA FINAL -->
    <section class="cta-section text-center text-white py-5">
      <div class="container">
        <h2 class="fw-bold">O próximo passo é seu! ✨</h2>
        <p class="lead mt-2">
          Por apenas R$ 16,90 você garante acesso completo a todos os conteúdos, bônus e atualizações.
        </p>
        <button class="cta-button mt-3" @click="subscribe">Quero Começar Agora</button>
        <p class="garantia mt-4">🔒 Compra 100% segura • ✔️ Acesso instantâneo • ❤️ Garantia de satisfação</p>
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
import foto1 from "@/assets/teste.jpeg";
import foto2 from "@/assets/teste2.jpeg";
import foto3 from "@/assets/teste3.jpeg";

const features = ref([
  {
    title: "Receitas Saudáveis",
    text: "Receitas simples, rápidas e perfeitas para emagrecer sem passar fome.",
    icon: "https://img.icons8.com/fluency/96/salad.png",
  },
  {
    title: "Ebooks Exclusivos",
    text: "Materiais completos feitos para orientar sua jornada de forma prática.",
    icon: "https://img.icons8.com/fluency/96/books.png",
  },
  {
    title: "Acompanhamento Motivacional",
    text: "Dicas, técnicas e estímulos para manter você no caminho certo todos os dias.",
    icon: "https://cdn-icons-png.flaticon.com/512/1006/1006627.png",
  },
]);

const depoimentos = ref([
  {
    nome: "Carla Mendes",
    texto: "Perdi 7kg em 5 semanas seguindo as receitas! Nunca me senti tão bem.",
    foto: foto3,
  },
  {
    nome: "Fernanda Lima",
    texto: "Os eBooks são muito claros e fáceis de seguir. Vale cada centavo!",
    foto: foto2,
  },
  {
    nome: "Juliana Rocha",
    texto: "Finalmente encontrei algo simples e acessível que realmente funciona!",
    foto: foto1,
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

.price-badge {
  background: white;
  color: #004aad;
  font-weight: 700;
  padding: 12px 30px;
  border-radius: 30px;
  font-size: 1.2rem;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  transition: 0.3s;
}

.price-badge:hover {
  transform: scale(1.05);
}

/* SOCIAL PROOF */
.social-proof-section {
  background-color: #eef3ff;
}

.depo-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  height: 100%;
}

.depo-foto {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
}

/* FEATURES */
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

/* BONUS */
.bonus-section {
  background: linear-gradient(135deg, #32a8ff, #004aad);
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
  background: #eaeaea;
  transform: scale(1.05);
}

.garantia {
  font-size: 0.9rem;
  opacity: 0.9;
}

/* FOOTER */
footer {
  background-color: #003380;
  font-size: 0.9rem;
}
</style>
