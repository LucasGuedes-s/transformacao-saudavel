<template>
  <nav class="navbar navbar-expand-lg">
    <div class="container">
      <!-- Logo -->
      <a class="navbar-brand" href="#">
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
        <span class="navbar-toggler-icon"
        ></span>
      </button>

      <!-- Links -->
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <a class="nav-link" href="/sobre-nos">Sobre Nós</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="/sobre-nos">Como Funciona</a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: "login-nav",
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
  width: 50%;
}
.nav-link{
  color: #ffffff;
}
.logo {
  height: 70px; /* Tamanho ajustado */
}

.navbar-nav .btn {
  font-family: "Rubik", serif;
  padding: 5px 35px;
  margin-left: 5px;
  font-size: 16px;
  border-radius: 20px;
  margin-right: 10px;
}

.btn-primary {
  background-color: #257f49;
  border-color: #257f49;
  color: #ffffff;
}

.btn-outline-primary {
  margin-left: 25px;
  border-color: #257f49;
  color: #257f49;
}

.btn-outline-primary:hover {
  background-color: #257f49;
  color: #ffffff;
}
</style>
