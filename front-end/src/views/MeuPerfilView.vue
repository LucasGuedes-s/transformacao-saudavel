<template>
    <NavBar />
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-10 col-lg-8">
          <div class="card shadow-lg">
            <!-- Header com estilo de gradiente -->
            <div class="card-header text-center text-white bg-gradient-primary py-4">
              <h2 class="mb-0">Perfil de {{ usuario.nome }}</h2>
            </div>
            <div class="card-body p-4">
              <!-- Foto do perfil com animação -->
              <div class="text-center mb-4">
                <img
                  :src="usuario.foto[0]"
                  alt="Foto do perfil"
                  class="rounded-circle img-thumbnail shadow"
                  style="width: 150px; height: 150px;"
                />
              </div>
              <!-- Barra de progresso fictícia -->
              <div class="mb-4">
                <h6 class="text-muted">Completo: 80%</h6>
                <div class="progress">
                  <div
                    class="progress-bar bg-success"
                    role="progressbar"
                    style="width: 80%;"
                    aria-valuenow="80"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
              </div>
              <!-- Informações do usuário -->
              <ul class="list-group">
                <li class="list-group-item">
                  <i class="bi bi-person-fill text-primary"></i>
                  <strong> Nome:</strong> {{ usuario.nome }}
                </li>
                <li class="list-group-item">
                  <i class="bi bi-envelope-fill text-primary"></i>
                  <strong> Email:</strong> {{ usuario.email }}
                </li>
                <li class="list-group-item">
                  <i class="bi bi-telephone-fill text-primary"></i>
                  <strong> Peso:</strong> {{ usuario.peso }} kg
                </li>
                <li class="list-group-item">
                  <i class="bi bi-geo-alt-fill text-primary"></i>
                  <strong> Altura:</strong> {{ usuario.altura }} cm
                </li>
              </ul>
            </div>
            <!-- Rodapé com botões -->
            <div class="card-footer text-center bg-light">
              <button class="btn btn-outline-danger" @click="logout">
                <i class="bi bi-box-arrow-right"></i> Sair
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </template>
  
  <script>
  import { useAuthStore } from "@/store/store.js";
  import NavBar from '@/components/NavDash.vue';
  import Footer from '@/components/footer.vue';
import router from "@/router";

  export default {
    name: "PerfilView",
    setup() {
      const authStore = useAuthStore();
      const usuario = authStore.usuario; // Pega o usuário da store
      console.log(usuario)
      return {
        usuario,
      };
    },
    methods: {
      editarPerfil() {
        // Lógica para redirecionar ou abrir um modal para editar perfil
        console.log("Editar perfil clicado");
      },
      logout() {
        // Lógica de logout
      // Limpa os dados do localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');

      // Redireciona para a página de login
      router.push('/');  // Direciona para a página de login
     },
    },
    components: {
        NavBar,
        Footer
    }
  };
  </script>
  
  <style scoped>
  .bg-gradient-primary {
    background: linear-gradient(90deg, #1e3a8a, #3b82f6);
  }
  .card {
    border-radius: 10px;
  }
  .card-header {
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
  }
  .shadow-lg {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }
  .progress-bar {
    transition: width 0.6s ease;
  }
  .btn {
    border-radius: 25px;
  }
  </style>
  