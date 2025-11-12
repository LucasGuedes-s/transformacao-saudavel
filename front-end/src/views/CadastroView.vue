<template>
  <NavBar />
  <div class="container">
    <h2 class="text-center mb-4">Realizar cadastro</h2>
    <!-- Botão para login com Google -->
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="name">Nome</label>
        <input type="text" class="form-control" id="name" v-model="nome" required />
      </div>

      <div class="form-group">
        <label for="email">E-mail</label>
        <input type="email" class="form-control" id="email" v-model="email" required />
      </div>

      <div class="form-group">
        <label for="password">Senha</label>
        <input type="password" class="form-control" id="password" v-model="senha" required />
      </div>

      <div class="form-group">
        <label for="confirmPassword">Confirmar Senha</label>
        <input type="password" class="form-control" id="confirmPassword" v-model="confirm_senha" required />
      </div>

      <!-- Campo de upload de imagem 
      <div class="form-group">
        <label for="profileImage">Foto de Perfil (opcional)</label>
        <input type="file" class="form-control" id="profileImage" @change="handleImageUpload" />
      </div> -->
      <!-- 
      <button @click="loginWithGoogle" class="btn btn-primary btn-block mb-3">
        <i class="fab fa-google"></i> Continuar com Google
      </button>-->
      <button type="submit" :disabled="isProcessing" class="btn btn-primary btn-block">
        {{ isProcessing ? 'Processando...' : 'Cadastrar' }}
      </button>
    </form>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar.vue';
import { auth } from "@/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import Swal from "sweetalert2";
import axios from 'axios';
import router from '@/router';
import { useAuthStore } from '@/store/store.js';
export default {
  name: 'cadastro-view',
  data() {
    return {
      form: {
        nome: '',
        email: '',
        senha: '',
        confirm_senha: '',
        profileImage: null,
      },
      imagePreview: '',
      isProcessing: false, // Controla o estado do botão
    };
  },
  components: {
    NavBar
  },
  methods: {
    async loginWithGoogle() {
      const provider = new GoogleAuthProvider();

      try {
        // Realizar login com o popup do Google
        const result = await signInWithPopup(auth, provider);

        // Obter informações do usuário autenticado
        const user = result.user;

        Swal.fire({
          icon: "success",
          title: "Cadastro realizado com sucesso!",
          text: `Bem-vindo!`,
        });

        // Aqui você pode redirecionar ou realizar outra ação
        console.log("Usuário logado:", user);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Erro ao autenticar com Google",
          text: error.message,
        });
      }
    },
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.form.profileImage = file;

        // Gerar uma URL temporária para exibir a imagem
        const reader = new FileReader();
        reader.onload = () => {
          this.imagePreview = reader.result;
        };
        reader.readAsDataURL(file);
      }
    },
    async submitForm() {
      // Impede múltiplos cliques
      if (this.isProcessing) return;

      this.isProcessing = true; 

      const foto = 'https://firebasestorage.googleapis.com/v0/b/clinica-maria-luiza.appspot.com/o/uploads%2Ffuncionarios2.svg?alt=media&token=cc7511c0-9e76-4cd6-9e33-891bbb3cfd1c';

      Swal.fire({
        title: 'Realizando cadastro...',
        text: 'Por favor, aguarde.',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      if (this.senha !== this.confirm_senha) {
        Swal.fire({
          icon: 'error',
          title: 'As senhas não coincidem',
          timer: 4000,
        });
        this.isProcessing = false; // libera o botão
        return;
      }

      try {
        const response = await axios.post(
          "https://transformacao-saudavel.onrender.com/user/cadastro",
          {
            usuario: {
              email: this.email,
              senha: this.senha,
              nome: this.nome,
              foto: [foto],
            },
          }
        );
        console.log(response.status);
        Swal.fire({
          icon: 'success',
          title: 'Cadastrado com sucesso!',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        });

        const authStore = useAuthStore();
        authStore.setToken(response.headers.authorization );
        authStore.setUsuario(response.data.user.newUser);

        router.push('/planos');
      } catch (error) {
        console.error(error);
        Swal.fire({
          icon: 'error',
          title: 'Erro ao se cadastrar',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      } finally {
        this.isProcessing = false; // libera o botão sempre, mesmo em erro
      }
    }

  }
};
</script>

<style scoped>
.container {
  max-width: 500px;
  margin: 50px auto;
  padding: 20px;
  border-radius: 8px;
  background-color: #f8f9fa;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h2 {
  color: #004aad;
}

.form-image {
  max-width: 150px;
  height: auto;
  border-radius: 50%;
  margin-bottom: 20px;
  border: 2px solid #004aad;
}

.form-control {
  border-radius: 8px;
  margin-bottom: 15px;
  padding: 10px;
}

.btn-primary {
  background-color: #004aad;
  border-color: #004aad;
  border-radius: 8px;
  padding: 10px;
  font-size: 16px;
  width: 100%;
}

.btn-primary:hover {
  background-color: #0056b3;
  border-color: #004085;
}
</style>