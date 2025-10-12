<template>
  <NavBar />

  <!-- CARD DA RECEITA -->
  <div v-if="receita" class="container form-container receita-container bg-light p-4 rounded shadow-sm mt-4">
    <div class="receita-content d-flex align-items-start">
      <!-- Texto à esquerda -->
      <div class="receita-text flex-fill me-4">
        <h4 class="mb-3">{{ receita.titulo }}</h4>
        <p><strong>Calorias:</strong> {{ receita.calorias }} kcal</p>

        <p><strong>Ingredientes:</strong></p>
        <pre class="ingredientes">{{ receita.ingredientes }}</pre>

        <p><strong>Modo de preparo:</strong></p>
        <p class="receita">{{ receita.receita }}</p>
      </div>

      <!-- Imagem à direita -->
      <div class="receita-imagem text-center">
        <img
          v-if="receita.foto && receita.foto.length"
          :src="receita.foto[0]"
          alt="Imagem da receita"
          class="img-fluid rounded shadow-sm"
        />
      </div>
    </div>
  </div>

  <!-- FORMULÁRIO -->
  <div class="container mt-5 form-container">
    <form @submit.prevent="enviarFormulario" class="bg-light p-4 rounded shadow-sm">
      <h3 class="text">Atualizar dados</h3>

      <!-- Peso -->
      <div class="mb-3">
        <label for="peso" class="form-label">Peso (kg)</label>
        <input type="text" id="peso" v-model="peso" class="form-control" required />
      </div>

      <!-- Altura -->
      <div class="mb-3">
        <label for="altura" class="form-label">Altura (cm)</label>
        <input type="text" id="altura" v-model="altura" class="form-control" required />
      </div>

      <!-- Idade -->
      <div class="mb-3">
        <label for="idade" class="form-label">Idade</label>
        <input type="number" id="idade" v-model="idade" class="form-control" required />
      </div>

      <!-- Objetivo -->
      <div class="mb-3">
        <label for="objetivo" class="form-label">Objetivo</label>
        <select id="objetivo" v-model="objetivo" class="form-select" required>
          <option value="">Selecione um objetivo</option>
          <option value="emagrecimento">Emagrecimento</option>
          <option value="ganhar_massa">Ganhar Massa</option>
          <option value="manutencao">Manutenção</option>
        </select>
      </div>

      <!-- Quantidade de Calorias -->
      <div class="mb-3">
        <label for="caloriasDiarias" class="form-label">Quantidade de Calorias por refeição</label>
        <select id="objetivo" v-model="calorias" class="form-select">
          <option value="">Selecione uma quantidade</option>
          <option value="400">Até 400 kcal/refeição</option>
          <option value="500">500 kcal/refeição</option>
          <option value="600">Até 600 kcal/refeição</option>
          <option value="700">Até 700 kcal/refeição</option>
        </select>
        <div class="form-check mt-2">
          <input
            class="form-check-input"
            type="checkbox"
            id="naoSeiCalorias"
            value="500"
            v-model="calorias"
            @change="limparCaloriasDiarias"
          />
          <label class="form-check-label" for="naoSeiCalorias">Não sei</label>
        </div>
      </div>

      <!-- Seções de alimentação -->
      <div class="mb-3">
        <label class="form-label">O que você NÃO deseja comer</label>

        <fieldset v-for="(grupo, nome) in opcoes" :key="nome" class="mb-4">
          <legend>{{ nome }}</legend>
          <div class="d-flex flex-wrap gap-3">
            <div v-for="(item, i) in grupo.itens" :key="i" class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                :id="`${nome}${i}`"
                :value="item"
                v-model="grupo.model"
              />
              <label class="form-check-label" :for="`${nome}${i}`">{{ item }}</label>
            </div>
          </div>
        </fieldset>
      </div>

      <button type="submit" class="btn btn-primary w-100">Enviar</button>
    </form>
  </div>

  <Footer />
</template>

<script>
import Footer from '@/components/footer.vue';
import NavBar from '@/components/NavDash.vue';
import router from '@/router';
import { useAuthStore } from '@/store/store.js';
import axios from 'axios';
import Swal from 'sweetalert2';
import dayjs from 'dayjs';

export default {
  data() {
    return {
      receita: null,
      loading: true,
      peso: "",
      altura: "",
      idade: "",
      objetivo: "",
      calorias: "",
      almoco: [],
      cafe: [],
      jantar: [],
      lanches: [],

      // Opções agrupadas
      opcoesCafe: [
        "Pão Integral - 70 kcal",
        "Frutas Mistas - 120 kcal",
        "Ovo (1 unidade) - 70 kcal",
        "Iogurte Natural - 100 kcal",
        "Omelete - 150 kcal",
        "Cereal Integral - 110 kcal",
        "Suco de Laranja - 90 kcal",
        "Chá Verde - 5 kcal"
      ],
      opcoesAlmoco: [
        "Arroz Integral - 150 kcal",
        "Frango Grelhado - 160 kcal",
        "Salada Variada - 50 kcal",
        "Batata Doce - 90 kcal"
      ],
      opcoesJantar: [
        "Sopa de Legumes - 120 kcal",
        "Omelete - 150 kcal",
        "Legumes Assados - 80 kcal",
        "Chá - 5 kcal",
        "Salmão Grelhado - 200 kcal"
      ],
      opcoesLanches: [
        "Barra de Cereal - 80 kcal",
        "Suco Natural - 90 kcal",
        "Bolacha Integral - 130 kcal",
        "Banana - 105 kcal"
      ]
    };
  },
  async mounted() {
    await this.buscarReceitaDoDia();
  },
  methods: {
    enviarFormulario() {
      const dados = {
        email: this.usuario.email,
        peso: this.peso,
        altura: this.altura,
        idade: this.idade,
        objetivo: this.objetivo,
        calorias: this.calorias,
        almoco: this.almoco,
        cafe: this.cafe,
        jantar: this.jantar,
        lanches: this.lanches,
      };
      console.log(dados);

      axios
        .put('https://transformacao-saudavel.onrender.com/update-user', dados)
        .then(() => {
          Swal.fire({
            icon: "success",
            title: "Dados cadastrados com sucesso!",
          });
          router.push('/planos');
        })
        .catch(error => {
          console.error('Erro ao enviar os dados:', error);
          Swal.fire({
            icon: "error",
            title: "Erro ao cadastrar os dados!",
          });
        });
    },

    async buscarReceitaDoDia() {
      try {
        const receitaSalva = JSON.parse(localStorage.getItem('receitaDoDia'));
        if (receitaSalva && receitaSalva.data === dayjs().format('YYYY-MM-DD')) {
          this.receita = receitaSalva.receita;
          this.loading = false;
          return;
        }

        const res = await axios.get('https://transformacao-saudavel.onrender.com/get-receitas');
        const receitas = res.data;
        const aleatoria = receitas[Math.floor(Math.random() * receitas.length)];

        this.receita = aleatoria;
        localStorage.setItem('receitaDoDia', JSON.stringify({
          data: dayjs().format('YYYY-MM-DD'),
          receita: aleatoria
        }));
        this.loading = false;
      } catch (error) {
        console.error('Erro ao buscar receitas:', error);
        this.loading = false;
      }
    },
  },
  setup() {
    const authStore = useAuthStore();
    const usuario = authStore.usuario;
    return { usuario };
  },
  components: { NavBar, Footer }
};
</script>
<style scoped>

/* Layout lado a lado */
.receita-content {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

.receita-text {
  flex: 1;
  font-size: 0.95rem;
}

.receita-imagem img {
  max-width: 220px;
  border-radius: 12px;
  object-fit: cover;
}

/* Estilos padrões */
fieldset {
  border: 1px solid #ddd;
  padding: 15px;
  border-radius: 8px;
}

legend {
  width: auto;
  padding: 0 10px;
  font-size: 1.1rem;
  color: #004aad;
}

.text {
  color: #004aad;
}

.btn-primary {
  background-color: #004aad;
  border-color: #004aad;
}

.btn-primary:hover {
  background-color: #003b85;
  border-color: #003b85;
}

/* 🔹 RESPONSIVIDADE PARA CELULAR */
@media (max-width: 768px) {
  .receita-container {
    padding: 20px;
  }

  .receita-content {
    flex-direction: column; /* imagem vai para baixo */
    align-items: center;
    text-align: center;
  }

  .receita-text {
    margin-bottom: 15px;
    text-align: left;
    width: 100%;
  }

  .receita-imagem img {
    max-width: 100%;
    height: auto;
    border-radius: 10px;
  }

  .form-container {
    width: 95%;
    margin: 0 auto;
  }

  fieldset {
    padding: 10px;
  }

  legend {
    font-size: 1rem;
  }
}
</style>