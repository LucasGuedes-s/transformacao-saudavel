<template>
  <NavBar />
  <div class="d-flex justify-content-center align-items-center vh-100">
    <div class="card p-5 shadow-lg" style="width: 30rem;">
      <h3 class="text-center mb-4">Entre com sua Conta</h3>

      <form @submit.prevent="login">
        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input
            type="email"
            id="email"
            v-model="email"
            class="form-control"
            placeholder="Digite seu email"
            required
          />
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">Senha</label>
          <input
            type="password"
            id="password"
            v-model="password"
            class="form-control"
            placeholder="Digite sua senha"
            required
          />
        </div>
        <div class="d-grid">
        <!-- Botão de login com Google
        <button @click="loginWithGoogle" class="btn btn-danger btn-block mb-3">
          <i class="fab fa-google"></i> Continuar com Google
        </button> -->
          <button type="submit" class="btn" style="background-color: #004aad; color: white;">Entrar</button>
        </div>

      </form>
      <div class="mt-3 text-center">
        <small>Não tem uma conta? <a href="/cadastro">Cadastre-se</a></small>
      </div>
    </div>
  </div>
</template>


<script>
import Swal from 'sweetalert2';
import router from '@/router';
import axios from 'axios'
import NavBar from '@/components/NavBar.vue';
import { useAuthStore } from '@/store/store.js';
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/firebase"; // Configuração do Firebase

export default {
  setup(){
    const user = useAuthStore()
    user.setToken('');
    user.setUsuario('');
  },
  data() {
    return {
      email: '',
      password: '',
    };
  },
  components:{
    NavBar
  },
  methods: {
    async login() {
      // Validação simples
      if (!this.email || !this.password) {
        Swal.fire({
          icon: 'erro',
          title: 'Preencha todos os campos',
          timer: 4000,
        })
        return;
      }
      await axios.post("https://transformacao-saudavel.onrender.com/user/login", {
        usuario: {
          email: this.email,
          password: this.password,
        }
      }).then(response => {
        console.log(response)
        const authStore = useAuthStore();

        console.log(response.data.user)
        console.log(response.headers);

        authStore.setToken(response.headers.authorization );
        authStore.setUsuario(response.data.user);

        router.push('/dashboard')
      }).catch( error =>{
        console.error(error);
          Swal.fire({
            icon: 'erro',
            title: 'Usuário ou senha incorretos',
            timer: 4000,
          })
        })
    },
    async loginWithGoogle() {
      const provider = new GoogleAuthProvider();

      try {
        // Realizar login com Google
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // Enviar os dados ao backend
        const response = await axios.post("https://transformacao-saudavel.onrender.com/user/login-google", {
          uid: user.uid, // ID único do Firebase
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        });
        
        // Salvar o token e informações do usuário
        const authStore = useAuthStore();

        authStore.setToken(response.data.token);
        authStore.setUsuario(response.data.user);

        // Mensagem de sucesso
        Swal.fire({
          icon: 'success',
          title: 'Login com Google realizado!',
          text: `Bem-vindo, ${response.data.user.displayName}!`,
        });

        // Redirecionar para o dashboard
        router.push('/dashboard');
      } catch (error) {
        console.log(error)
        console.error("Erro no login com Google:", error);

        Swal.fire({
          icon: 'error',
          title: 'Erro ao autenticar com Google',
          text: error.response?.data?.message || error.message,
        });
      }
    },
  },
};
</script>
<style scoped>

@media screen and (max-width: 600px) {
  .vh-100 {
    height: 50vh !important;
  }
  .card .p-5 .shadow-lg{
    width: 25rem;
}
}
</style>