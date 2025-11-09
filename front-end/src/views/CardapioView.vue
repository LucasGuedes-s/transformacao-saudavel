<template>
  <NavBar />
  <div class="container mt-5">
    <h1 class="texto text-center mb-4">Receitas</h1>

    <div v-if="loading" class="text-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Carregando...</span>
      </div>
    </div>
    <div class="d-flex justify-content-between mb-4" v-if="!loading">
      <button href="#Café" class="btn btn-primary flex-grow-1 mx-1"
        style="background-color: #004aad; color: white;">Café da manhã</button>
      <button href="#Almoço" class="btn btn-primary flex-grow-1 mx-1"
        style="background-color: #004aad; color: white;">Almoço</button>
      <button href="#Jantar" class="btn btn-primary flex-grow-1 mx-1"
        style="background-color: #004aad; color: white;">Jantar</button>
    </div>
    <button @click="gerarPDF" class="btn btn-primary mb-4" style="background-color: #004aad; width: 100%;">
      Gerar PDF das Receitas
    </button>
    <div v-if="!loading" class="container mt-5">
      <div v-for="(receitas, tipo) in receitasAgrupadas" :key="tipo" class="mb-4">
        <h2 class="texto" :id="tipo">{{ tipo }}</h2>
        <div class="list-group">
          <div v-for="receita in receitas" :key="receita.id" class="list-group-item d-flex align-items-start">
            <img :src="receita.foto" class="img-thumbnail me-3" style="width: 100px; height: 100px; object-fit: cover;"
              :alt="receita.titulo" />
            <div>
              <h5 class="mb-1">{{ receita.titulo }}</h5>
              <p class="mb-1" v-html="formatIngredientes(receita.ingredientes || '')"></p>
              <small><strong>Calorias:</strong> {{ receita.calorias }} kcal</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <Footer />
</template>

<script>
import axios from 'axios';
import NavBar from '@/components/NavDash.vue';
import Footer from '@/components/footer.vue';
import { useAuthStore } from '@/store/store.js';
import router from '@/router';
import { jsPDF } from "jspdf";
import Swal from 'sweetalert2';

export default {
  setup() {
    const authStore = useAuthStore();
    const usuario = authStore.usuario; // Pega o usuário da store
    return {
      usuario
    };
  },
  data() {
    return {
      receitasAgrupadas: {},
      loading: true,
      receitas: []
    };
  },
  methods: {
    async validar() {
      const email = this.usuario.email
      const response = await axios.get(`https://transformacao-saudavel.onrender.com/user/pagamento?email=${email}`);
      //console.log(response.data)
      if (!response.data.pagamento) {
        router.push('/planos')
      }
    },
    async fetchReceitas() {
      try {
        const email = this.usuario.email; // Aqui você pega o email de onde estiver armazenado
        const response = await axios.get(`https://transformacao-saudavel.onrender.com/user/get-receitas?email=${email}`);
        this.receitasAgrupadas = response.data;
        this.receitas = response.data
        if(Object.keys(this.receitasAgrupadas).length === 0){
          Swal.fire({
            icon: 'info',
            title: 'Nenhuma receita disponível',
            text: 'Ainda não há receitas disponíveis para o seu perfil. Por favor, atualize seus dados na tela inicial.',
          });
          router.push('/dashboard')
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Erro ao carregar receitas',
          text: 'Ocorreu um erro ao buscar as receitas. Por favor, tente novamente mais tarde.',
        });
        router.push('/dashboard')
        console.error('Erro ao buscar receitas:', error);
      } finally {
        this.loading = false;
      }
    },
    /* eslint-disable */
    gerarPDF() {
      //this.validar()
      const nome = this.usuario.nome; // Aqui você pega o email de onde estiver armazenado

      const doc = new jsPDF();
      let y = 10; // Declarada aqui no escopo local
      const pageHeight = doc.internal.pageSize.height;
      doc.setTextColor('#004aad')
      doc.text(`Receitas exclusivas para ${nome}`, 105, y, { align: "center" });
      y += 10;
      doc.setTextColor(0, 0, 0); // Volta para preto

      // Itera sobre as categorias
      Object.keys(this.receitas).forEach((categoria) => {
        // Adiciona o título da categoria
        if (y + 10 > pageHeight - 15) this.criarNovaPagina(doc, y);
        doc.setFontSize(14);
        doc.text(categoria, 10, y);
        y += 8;

        // Itera sobre as receitas da categoria
        this.receitas[categoria].forEach((receita, index) => {
          if (y + 10 > pageHeight - 15) y = this.criarNovaPagina(doc, y);
          doc.setFontSize(12);
          doc.text(`${index + 1}. ${receita.titulo}`, 10, y);
          y += 7;

          doc.setFontSize(10);
          y += 5;

          // Adiciona os ingredientes (com quebra de linha automática)
          const ingredientes = doc.splitTextToSize(receita.ingredientes, 190);
          ingredientes.forEach((linha) => {
            if (y + 10 > pageHeight - 15) y = this.criarNovaPagina(doc, y);
            doc.text(linha, 10, y);
            y += 5;
          });

          doc.text("Modo de Preparo:", 10, y);
          y += 5;

          // Adiciona o modo de preparo (com quebra de linha automática)
          const modoPreparo = doc.splitTextToSize(receita.receita, 190);
          modoPreparo.forEach((linha) => {
            if (y + 10 > pageHeight - 15) y = this.criarNovaPagina(doc, y);
            doc.text(linha, 10, y);
            y += 5;
          });

          if (y + 10 > pageHeight - 15) y = this.criarNovaPagina(doc, y);
          doc.text(`Calorias: ${receita.calorias} kcal`, 10, y);
          y += 10;
        });

        y += 5; // Espaçamento entre categorias
      });

      // Adiciona o rodapé na última página
      this.adicionarFooter(doc);

      doc.save("receitas.pdf");
    },

    criarNovaPagina(doc, y) {
      this.adicionarFooter(doc); // Adiciona o rodapé na página atual
      doc.addPage(); // Cria uma nova página
      doc.setFontSize(10); // Reinicia o tamanho da fonte, se necessário
      return 10; // Reinicia a posição Y para a nova página
    },

    adicionarFooter(doc) {
      const pageHeight = doc.internal.pageSize.height;
      const pageWidth = doc.internal.pageSize.width; // Largura da página

      // Desenha a barra azul no rodapé
      doc.setFillColor("#004aad");
      doc.rect(0, pageHeight - 5, pageWidth, 5, "F"); // A barra ocupa toda a largura e está no rodapé
    },
    formatIngredientes(ingredientes) {
      if (!ingredientes) return ''; // Adiciona verificação para evitar erro
      return ingredientes.replace(/\n/g, '<br>');
    },
  },
  created() {
    this.fetchReceitas();
    this.validar()
  },
  components: {
    NavBar,
    Footer
  }
};
</script>

<style scoped>
.texto {
  color: #004aad
}

.container {
  max-width: 800px;
}

.img-thumbnail {
  flex-shrink: 0;
}

.list-group-item {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
}
</style>
