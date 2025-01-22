<template>
  <div class="container mt-5">
    <div class="card shadow">
      <div class="card-header bg-primary text-white">
        <h1 class="h4 mb-0">Adicionar Receita</h1>
      </div>
      <div class="card-body">
        <form @submit.prevent="adicionarReceita">
          <!-- Formulário de Adição de Receita -->
          <div class="mb-3">
            <label class="form-label">Título:</label>
            <input type="text" class="form-control" v-model="novaReceita.titulo" required />
          </div>

          <div class="mb-3">
            <label class="form-label">Descrição:</label>
            <textarea class="form-control" v-model="novaReceita.ingredientes" required></textarea>
          </div>

          <div class="mb-3">
            <label class="form-label">Receita:</label>
            <textarea class="form-control" v-model="novaReceita.receita" required></textarea>
          </div>

          <div class="mb-3">
            <label class="form-label">Calorias:</label>
            <input type="number" class="form-control" v-model.number="novaReceita.calorias" required />
          </div>

          <div class="mb-3">
            <label class="form-label">Tipo:</label>
            <select class="form-select" v-model="novaReceita.tipo" required>
              <option value="" disabled>Escolha o tipo</option>
              <option value="Café">Café</option>
              <option value="Almoço">Almoço</option>
              <option value="Jantar">Jantar</option>
            </select>
          </div>

          <div class="mb-3">
            <label class="form-label">Foto:</label>
            <input type="file" class="form-control" @change="handleFileUpload" required />
          </div>

          <button type="submit" class="btn btn-success w-100">Salvar Receita</button>
        </form>
      </div>
    </div>

    <!-- Exibindo as receitas
    <div class="mt-5">
      <h2>Receitas Cadastradas</h2>
      <div v-if="receitas.length === 0">Não há receitas cadastradas.</div>
      <ul class="list-group">
        <li v-for="receita in receitas" :key="receita.id" class="list-group-item">
          <h5>{{ receita.titulo }}</h5>
          <p><strong>Ingredientes:</strong> {{ receita.ingredientes }}</p>
          <p><strong>Receita:</strong> {{ receita.receita }}</p>
          <p><strong>Calorias:</strong> {{ receita.calorias }}</p>
          <p><strong>Tipo:</strong> {{ receita.tipo }}</p>
          <img v-if="receita.foto" :src="receita.foto" alt="Foto da receita" class="img-fluid" />
        </li>
      </ul>
    </div>
 -->
    <!-- Exibindo os comprovantes -->
    <div class="mt-5">
      <h2>Comprovantes em Análise</h2>
      <div v-if="comprovantes.length === 0">Não há comprovantes em análise.</div>
      <ul class="list-group">
        <li v-for="comprovante in comprovantes" :key="comprovante.id" class="list-group-item">
          <p><strong>Email:</strong> {{ comprovante.email }}</p>
          <p><strong>Comprovante(s):</strong></p>
          <ul>
            <img :src="comprovante.comprovante" alt="">
            <!--<li v-for="file in comprovante.comprovante" :key="file">{{ file }}</li> -->
          </ul>
          <button @click="aceitarComprovante(comprovante.email)" class="btn btn-success">Aceitar Comprovante</button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from '../firebase.js'; // Certifique-se de ajustar o caminho conforme necessário

export default {
  data() {
    return {
      novaReceita: {
        titulo: '',
        ingredientes: '',
        receita: '',
        calorias: null,
        tipo: '',
        foto: '',
      },
      imagemArquivo: null,
      imagem: null,
      imageUrl: '',
      receitas: [], // Para armazenar as receitas retornadas
      comprovantes: [] // Para armazenar os comprovantes em análise
    };
  },
  methods: {
    async handleFileUpload(event) {
      this.imagem = event.target.files[0];
    },
    async adicionarReceita() {
      try {
        // Verifica se uma imagem foi selecionada
        if (!this.imagem) {
          alert('Por favor, selecione uma imagem para a receita.');
          return;
        }

        // Gera um identificador único para a imagem
        const uniqueImageName = uuidv4() + '_' + this.imagem.name;

        // Cria uma referência para o armazenamento
        const storageRef = ref(storage, 'Receitas/' + uniqueImageName);

        // Faz o upload da imagem
        const snapshot = await uploadBytes(storageRef, this.imagem);

        // Obtém a URL pública da imagem após o upload
        const imageUrl = await getDownloadURL(snapshot.ref);
        this.imageUrl = imageUrl; // Atribui a URL da imagem à variável de estado

        // Agora, adiciona a receita com a URL da imagem
        const receitaComImagem = {
          ...this.novaReceita,
          foto: this.imageUrl, // Adiciona a URL da imagem no campo "foto"
        };

        // Envia os dados da receita para o backend
        const response = await axios.post('https://transformacao-saudavel.onrender.com/receitas', receitaComImagem);
        alert('Receita adicionada com sucesso!');

        // Resetando o formulário
        this.novaReceita = {
          titulo: '',
          ingredientes: '',
          receita: '',
          calorias: null,
          tipo: '',
          foto: '', // Deixa a URL da imagem em branco após o envio
        };

        // Recarregar as receitas
        this.carregarReceitas();
        console.log(response);
        this.imageUrl = null; // Limpa a URL da imagem após o envio

      } catch (error) {
        console.error('Erro ao adicionar receita:', error);
        alert('Erro ao adicionar receita.');
      }
    },
    async carregarReceitas() {
      try {
        const response = await axios.get('https://transformacao-saudavel.onrender.com/get-receitas');
        this.receitas = response.data;
      } catch (error) {
        console.error('Erro ao carregar receitas:', error);
        alert('Erro ao carregar receitas.');
      }
    },
    async getComprovantes() {
      try {
        const response = await axios.get('https://transformacao-saudavel.onrender.com/comprovantes/analise');
        this.comprovantes = response.data;
      } catch (error) {
        console.error('Erro ao carregar comprovantes:', error);
        alert('Erro ao carregar comprovantes.');
      }
    },
    async aceitarComprovante(email) {
      try {
        // Lógica para aceitar o comprovante e atualizar o status do usuário
        const response = await axios.put(`https://transformacao-saudavel.onrender.com/aceitar-comprovante/${email}`, {
          email: email // Envia o email como parte do corpo da requisição
        });
        console.log(response);
        alert('Comprovante aceito com sucesso!');
        this.getComprovantes(); // Recarregar os comprovantes após aceitação
      } catch (error) {
        console.error('Erro ao aceitar o comprovante:', error);
        alert('Erro ao aceitar o comprovante.');
      }
    }
  },
  mounted() {
    this.carregarReceitas();  // Carregar as receitas ao montar o componente
    this.getComprovantes();   // Carregar os comprovantes ao montar o componente
  }
};
</script>

<style scoped>
.container {
  max-width: 600px;
}
img{
  width: 500px;
}
</style>
