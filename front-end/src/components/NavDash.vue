<template>
  <nav class="navbar navbar-expand-lg">
    <div class="container">
      <!-- Logo -->
      <a class="navbar-brand" href="/dashboard">
        <img src="@/assets/logo.png" alt="Logo" class="logo" />
      </a>

      <!-- Botão para dispositivos móveis -->
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Links -->
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <router-link to="/dashboard">
              <a class="nav-link">Dashboard</a>
            </router-link>

          </li>

          <li class="nav-item">
            <router-link to="/meu-perfil">
            <a class="nav-link" href="#">Meu perfil</a>
          </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/meu-cardapio">
              <span class="nav-link" href="#">Meu cardápio</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/comprovante">
              <span class="nav-link" href="#">Enviar comprovante</span>
            </router-link>
          </li>

          <!-- Notificações -->
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              id="notificationsDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i class="fas fa-bell"></i>
              <span v-if="unreadCount" class="badge bg-danger">{{ unreadCount }}</span>
            </a>
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="notificationsDropdown">
              <li v-if="notifications.length === 0" class="dropdown-item">Sem notificações</li>
              <li v-for="(notification, index) in notifications" :key="index" class="dropdown-item">
                {{ notification }}
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: "login-nav",
  data() {
    return {
      notifications: ["Seja muito bem vindo (a)", "Para ter acesso as receitas, é necessário a adesão a um plano!"],
    };
  },
  computed: {
    unreadCount() {
      return this.notifications.length;
    },
  },
};
</script>

<style scoped>
.navbar-toggler {
  border-color: white; /* Muda a cor da borda do botão */
}

.navbar-toggler-icon {
  background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='white' viewBox='0 0 30 30'%3E%3Cpath stroke='rgba(255, 255, 255, 1)' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3E%3C/svg%3E");
}

.navbar {
  background-color: #004aad;
  padding: 20px 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.navbar-brand {
  display: flex;
  align-items: center;
}

.nav-link {
  color: #ffffff;
}

.nav-item a {
  text-decoration: none;
}

.logo {
  height: 70px; /* Tamanho ajustado */
}

.badge {
  font-size: 10px;
  vertical-align: top;
  margin-left: 5px;
}
</style>
