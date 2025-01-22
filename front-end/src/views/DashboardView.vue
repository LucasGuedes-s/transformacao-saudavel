<template>
  <NavBar />
  <div class="container mt-5">
    <div class="receita bg-light p-4 rounded shadow-sm">
      <h3 class="text">Receita do Dia: {{ receita.titulo }}</h3>
      <p>{{ receita.descricao }}</p>
      <ul>
        <li v-for="(ingrediente, index) in receita.ingredientes" :key="index">
          {{ ingrediente }}
        </li>
      </ul>
      <p><strong>Calorias:</strong> {{ receita.calorias }} kcal</p>
      <button @click="baixarPdf" class="btn btn-primary mt-3">Baixar completa em PDF</button>
    </div>
  </div>
  <div class="container mt-5">
    <form @submit.prevent="enviarFormulario" class="bg-light p-4 rounded shadow-sm">
      <h3 class="text">Atualizar dados</h3>

      <!-- Peso -->
      <div class="mb-3">
        <label for="peso" class="form-label">Peso (kg)</label>
        <input type="number" step="0.5" id="peso" v-model="peso" class="form-control" required />
      </div>

      <!-- Altura -->
      <div class="mb-3">
        <label for="altura" class="form-label">Altura (cm)</label>
        <input type="number" step="0.5" id="altura" v-model="altura" class="form-control" required />
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
        <label for="caloriasDiarias" class="form-label">Quantidade de Calorias para cada refeição</label>
        <select id="objetivo" v-model="calorias" class="form-select">
          <option value="">Selecione uma quantidade de calorias</option>
          <option value="400">Até 400 kcal/refeição</option>
          <option value="500">500 kcal/refeição</option>
          <option value="600">Até 600 kcal/refeição</option>
          <option value="700">Até 700 kcal/refeição</option>

        </select>
        <div class="form-check mt-2">
          <input class="form-check-input" type="checkbox" id="naoSeiCalorias" value="500" v-model="calorias"
            @change="limparCaloriasDiarias" />
          <label class="form-check-label" for="naoSeiCalorias">Não sei</label>
        </div>
      </div>


      <!-- O que deseja comer -->
      <div class="mb-3">
        <label class="form-label">O que você NÃO deseja comer</label>
        <!-- Café da Manhã -->
        <fieldset class="mb-4">
          <legend>Café da Manhã</legend>
          <div class="d-flex flex-wrap gap-3">
            <div class="form-check">
              <input class="form-check-input" type="checkbox" id="pao" value="Pão Integral - 70 kcal" v-model="cafe" />
              <label class="form-check-label" for="pao">Pão Integral (70 kcal)</label>
            </div>

            <div class="form-check">
              <input class="form-check-input" type="checkbox" id="fruta" value="Frutas Mistas - 120 kcal"
                v-model="cafe" />
              <label class="form-check-label" for="fruta">Frutas (120 kcal)</label>
            </div>

            <div class="form-check">
              <input class="form-check-input" type="checkbox" id="fruta" value="Ovo (1 unidade) - 70 kcal"
                v-model="cafe" />
              <label class="form-check-label" for="fruta">Ovo (1 unidade) - 70 kcal</label>
            </div>

            <div class="form-check">
              <input class="form-check-input" type="checkbox" id="iogurte" value="Iogurte Natural - 100 kcal"
                v-model="cafe" />
              <label class="form-check-label" for="iogurte">Iogurte Natural (100 kcal)</label>
            </div>

            <div class="form-check">
              <input class="form-check-input" type="checkbox" id="omelete" value="Omelete - 150 kcal" v-model="cafe" />
              <label class="form-check-label" for="omelete">Omelete (150 kcal)</label>
            </div>

            <div class="form-check">
              <input class="form-check-input" type="checkbox" id="cereal" value="Cereal Integral - 110 kcal"
                v-model="cafe" />
              <label class="form-check-label" for="cereal">Cereal Integral (110 kcal)</label>
            </div>

            <div class="form-check">
              <input class="form-check-input" type="checkbox" id="suco" value="Suco de Laranja - 90 kcal"
                v-model="cafe" />
              <label class="form-check-label" for="suco">Suco de Laranja (90 kcal)</label>
            </div>

            <div class="form-check">
              <input class="form-check-input" type="checkbox" id="cha" value="Chá Verde - 5 kcal" v-model="cafe" />
              <label class="form-check-label" for="cha">Chá Verde (5 kcal)</label>
            </div>
          </div>
        </fieldset>

        <!-- Almoço -->
        <fieldset class="mb-4">
          <legend>Almoço</legend>
          <div class="d-flex flex-wrap gap-3">
            <div class="form-check">
              <input class="form-check-input" type="checkbox" id="arroz" value="Arroz Integral - 150 kcal"
                v-model="almoco" />
              <label class="form-check-label" for="arroz">Arroz Integral (150 kcal)</label>
            </div>

            <div class="form-check">
              <input class="form-check-input" type="checkbox" id="frango" value="Frango Grelhado - 160 kcal"
                v-model="almoco" />
              <label class="form-check-label" for="frango">Frango Grelhado (160 kcal)</label>
            </div>

            <div class="form-check">
              <input class="form-check-input" type="checkbox" id="salada" value="Salada Variada - 50 kcal"
                v-model="almoco" />
              <label class="form-check-label" for="salada">Salada Variada (50 kcal)</label>
            </div>

            <div class="form-check">
              <input class="form-check-input" type="checkbox" id="batata" value="Batata Doce - 90 kcal"
                v-model="almoco" />
              <label class="form-check-label" for="batata">Batata Doce (90 kcal)</label>
            </div>

          </div>
        </fieldset>

        <!-- Jantar -->
        <fieldset class="mb-4">
          <legend>Jantar</legend>
          <div class="d-flex flex-wrap gap-3">
            <div class="form-check">
              <input class="form-check-input" type="checkbox" id="sopa" value="Sopa de Legumes - 120 kcal"
                v-model="jantar" />
              <label class="form-check-label" for="sopa">Sopa de Legumes (120 kcal)</label>
            </div>

            <div class="form-check">
              <input class="form-check-input" type="checkbox" id="omeleteJantar" value="Omelete - 150 kcal"
                v-model="jantar" />
              <label class="form-check-label" for="omeleteJantar">Omelete (150 kcal)</label>
            </div>

            <div class="form-check">
              <input class="form-check-input" type="checkbox" id="legumes" value="Legumes Assados - 80 kcal"
                v-model="jantar" />
              <label class="form-check-label" for="legumes">Legumes Assados (80 kcal)</label>
            </div>

            <div class="form-check">
              <input class="form-check-input" type="checkbox" id="chaJantar" value="Chá - 5 kcal" v-model="jantar" />
              <label class="form-check-label" for="chaJantar">Chá (5 kcal)</label>
            </div>

            <div class="form-check">
              <input class="form-check-input" type="checkbox" id="salmao" value="Salmão Grelhado - 200 kcal"
                v-model="jantar" />
              <label class="form-check-label" for="salmao">Salmão Grelhado (200 kcal)</label>
            </div>

          </div>
        </fieldset>

        <!-- Lanches -->
        <fieldset class="mb-4">
          <legend>Lanches</legend>
          <div class="d-flex flex-wrap gap-3">
            <div class="form-check">
              <input class="form-check-input" type="checkbox" id="barraCereal" value="Barra de Cereal - 80 kcal"
                v-model="lanche" />
              <label class="form-check-label" for="barraCereal">Barra de Cereal (80 kcal)</label>
            </div>

            <div class="form-check">
              <input class="form-check-input" type="checkbox" id="sucoLanche" value="Suco Natural - 90 kcal"
                v-model="lanche" />
              <label class="form-check-label" for="sucoLanche">Suco Natural (90 kcal)</label>
            </div>

            <div class="form-check">
              <input class="form-check-input" type="checkbox" id="bolachaIntegral" value="Bolacha Integral - 130 kcal"
                v-model="lanche" />
              <label class="form-check-label" for="bolachaIntegral">Bolacha Integral (130 kcal)</label>
            </div>

            <div class="form-check">
              <input class="form-check-input" type="checkbox" id="frutaLanche" value="Banana - 105 kcal"
                v-model="lanche" />
              <label class="form-check-label" for="frutaLanche">Banana (105 kcal)</label>
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

export default {
  data() {
    return {
        receita: {
          titulo: "Salada de Frango Grelhado",
          descricao: "Uma salada leve e nutritiva, perfeita para o almoço.",
          ingredientes: [
            "150g de frango grelhado",
            "1 xícara de alface americana",
            "1/2 tomate picado",
            "1/4 de cebola roxa fatiada",
            "Azeite e limão a gosto"
          ],
          calorias: 250,
        },
      receitasAgrupadas: {},
      loading: true,
      peso: "",
      altura: "",
      idade: "",
      calorias: "",
      almoco: [],
      cafe: [],
      jantar: [],
      lanches: [],
    };
  },
  methods: {
    enviarFormulario() {
      const dados = {
        email: this.usuario.email,         // Certifique-se de que este campo exista no seu componente Vue
        peso: this.peso || "",
        altura: this.altura || "",
        idade: this.idade || "",
        calorias: this.calorias || "",
        almoco: this.almoco || [],
        cafe: this.cafe || [],
        jantar: this.jantar || [],
        lanches: this.lanches || [],
      };
      console.log(dados)
      axios.put('http://localhost:3000/update-user', dados)
        .then(response => {
          console.log(response.data.message);
          Swal.fire({
            icon: "success",
            title: "Dados cadastrados com sucesso!",
          });
          router.push('/planos')
        })
        .catch(error => {
          console.error('Erro ao enviar os dados:', error.response.data.error);
          Swal.fire({
            icon: "error",
            title: "Erro ao cadastrar os dados!",
          });
        });
    },
  },
  setup() {
    const authStore = useAuthStore();
    const usuario = authStore.usuario; // Pega o usuário da store
    return {
      usuario
    };
  },
  components: {
    NavBar,
    Footer
  }
};
</script>

<style scoped>
.text-primary {
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

.d-flex {
  display: flex;
}

.flex-wrap {
  flex-wrap: wrap;
}

.gap-3 {
  gap: 15px;
}
.text{
  color: #004aad;
}
</style>
