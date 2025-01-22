<template>
  <NavBar />
  <div class="container mt-5">
    <form @submit.prevent="enviarFormulario" class="bg-light p-4 rounded shadow-sm">
      <!-- E-mail -->
      <div class="mb-3">
        <label for="email" class="form-label">E-mail</label>
        <input type="email" id="email" v-model="email" class="form-control" required />
      </div>

      <!-- Comprovante de Pagamento -->
      <div class="mb-3">
        <label for="comprovante" class="form-label">Comprovante de Pagamento</label>
        <input type="file" id="comprovante" class="form-control" @change="handleFileUpload" required />
        <small class="form-text text-muted">Envie um arquivo em formato PDF, JPEG ou PNG.</small>
      </div>

      <button type="submit" class="btn btn-primary w-100">Enviar</button>
    </form>
  </div>
  <Footer />
</template>

<script>
import NavBar from '@/components/NavDash.vue';
import Footer from '@/components/footer.vue';
import { v4 as uuidv4 } from 'uuid';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from '../firebase.js'; // Certifique-se de ajustar o caminho conforme necessário
import axios from 'axios';
import Swal from 'sweetalert2';

export default {
  data() {
    return {
      email: "",
      comprovante: null,
      resultado: false,
      imageUrl: null,
    };
  },
  methods: {
    handleFileUpload(event) {
      this.comprovante = event.target.files[0];
    },
    async enviarFormulario() {
      try {
        // Verifica se uma imagem foi selecionada
        if (!this.comprovante) {
          alert('Por favor, selecione uma imagem para o comprovante');
          return;
        }

        // Gera um identificador único para a imagem
        const uniqueImageName = uuidv4() + '_' + this.comprovante.name;

        // Cria uma referência para o armazenamento
        const storageRef = ref(storage, 'Comprovantes/' + uniqueImageName);

        // Faz o upload da imagem
        const snapshot = await uploadBytes(storageRef, this.comprovante);

        // Obtém a URL pública da imagem após o upload
        const imageUrl = await getDownloadURL(snapshot.ref);
        this.imageUrl = imageUrl; // Atribui a URL da imagem à variável de estado
        Swal.fire({
          title: 'Carregando...',
          text: 'Por favor, aguarde enquanto processamos sua solicitação.',
          allowOutsideClick: false, // Impede o fechamento ao clicar fora
          showConfirmButton: false, // Oculta o botão de confirmação
          didOpen: () => {
            Swal.showLoading(); // Mostra o ícone de carregamento
          },
        });
        const response = await axios.post('https://transformacao-saudavel.onrender.com/adicionar-comprovante', {
          email: this.email, // ou apenas `email` se as variáveis forem do mesmo nome
          comprovante: this.imageUrl, // ou apenas `comprovante`
        });

        Swal.close();

        // Mostra um alerta de sucesso
        Swal.fire({
          icon: 'success',
          title: 'Concluído! Em breve, liberamos as suas receitas',
          text: 'Comprovante enviado com sucesso.',
        });
        this.email = ''
        this.comprovante = null
        console.log('Resposta do servidor:', response.data);

      }
      catch (error) {
        console.log(error)
      }
    },
  },
  components: {
    NavBar,
    Footer
  },
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

.form-control {
  max-width: 600px;
}
</style>