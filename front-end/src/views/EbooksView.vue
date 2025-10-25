<template>
  <div class="ebooks-view">
    <NavBar />

    <div class="container py-5">
      <h2 class="text-center mb-4 titulo">📚 E-books de Receitas Saudáveis</h2>
      <p class="text-center text-muted mb-5 subtitulo">
        Explore nossos e-books e descubra receitas deliciosas e nutritivas para o seu dia a dia.
      </p>

      <div class="row g-4">
        <!-- Ebook 1 -->
        <div class="col-md-4" v-for="(ebook, index) in ebooks" :key="index">
          <div class="card h-100 shadow-sm">
            <img :src="ebook.imagem" class="card-img-top" alt="Capa do eBook" />
            <div class="card-body d-flex flex-column justify-content-between">
              <div>
                <h5 class="card-title text-primary">{{ ebook.titulo }}</h5>
                <p class="card-text text-muted">{{ ebook.descricao }}</p>
              </div>
              <a
                :href="ebook.link"
                target="_blank"
                class="btn btn-primary mt-3 w-100"
              >
                📖 Ver eBook
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script>
import NavBar from "@/components/NavDash.vue";
import Footer from "@/components/footer.vue";

export default {
  name: "EbooksView",
  components: { NavBar, Footer },
  data() {
    return {
      ebooks: [
        {
          titulo: "Receitas Low Carb",
          descricao: "Receitas práticas e saudáveis para manter o equilíbrio.",
          imagem: "https://www.nutritionadvance.com/wp-content/uploads/2019/04/Low-Carb-Foods-on-table.jpg",
          link: "/pdfs/low.pdf" // Caminho do PDF
        },
        {
          titulo: "Receitas Termogênicas",
          descricao: "Ideias nutritivas para começar o dia com disposição.",
          imagem: "https://portaledicase.com/wp-content/uploads/2023/10/suco-laranja-cenoura-gengibre.jpg",
          link: "/pdfs/TERMOGENICAS.pdf"
        },
        {
          titulo: "Sobremesas Saudáveis",
          descricao: "Dicas e receitas para sobremesas deliciosas e nutritivas.",
          imagem: "https://www.guiadasemana.com.br/contentFiles/image/2018/06/FEA/principal/49620_w840h0_1530213806shutterstock-197514803.jpg",
          link: "/pdfs/SOBREMESAS.pdf"
        }
      ]
    };
  }
};
</script>

<style scoped>
.ebooks-view {
  background-color: #f8f9fa;
  min-height: 100vh;
}

.titulo {
  color: #004aad;
  font-weight: bold;
}

.subtitulo {
  font-size: 1.1rem;
}

.card {
  border: none;
  border-radius: 12px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
}

.card-img-top {
  border-radius: 12px 12px 0 0;
  height: 200px;
  object-fit: cover;
}

.btn-primary {
  background-color: #004aad;
  border: none;
}

.btn-primary:hover {
  background-color: #003b85;
}
</style>
