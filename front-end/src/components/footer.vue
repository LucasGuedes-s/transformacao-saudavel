<template>
    <footer class="footer">
      <div class="container">
        <div class="row">
          <!-- Logo e descrição -->
          <div class="col-md-4">
            <p class="footer-text">
              Emagrecendo de forma saudável e tendo resultados de qualidade
            </p>
          </div>
  
          <!-- Links úteis -->
          <div class="col-md-4">
            <h5 class="footer-heading">Links úteis</h5>
            <ul class="footer-links">
              <li><router-link to="/dashboard">Dashboard</router-link></li>
              <li><router-link to="/meu-perfil">Meu Perfil</router-link></li>
              <li><router-link to="/meu-cardapio">Meu Cardápio</router-link></li>
              <li><router-link to="/comprovante">Enviar Comprovante</router-link></li>
            </ul>
          </div>
  
          <!-- Contato -->
          <div class="col-md-4">
            <h5 class="footer-heading">Contato</h5>
            <ul class="footer-contact">
              <li><i class="fas fa-envelope"></i>emagrecimentoprotocolo35@gmail.com</li>
            </ul>
          </div>
        </div>
  
        <!-- Direitos autorais -->
        <div class="footer-bottom">
          <p class="text-center">&copy; {{ new Date().getFullYear() }} Desenvolvido por Lucas Guedes Developer. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  </template>
  
  <script>
  export default {
    name: "Footer-app",
  };
  </script>
  
  <style scoped>
  .footer {
    background-color: #004aad;
    color: #ffffff;
    padding: 40px 20px;
    text-align: left;
  }
  
  .footer .container {
    max-width: 1200px;
  }
  
  .footer-brand {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
  }
  
  .footer-text {
    font-size: 14px;
    line-height: 1.5;
  }
  
  .footer-heading {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 15px;
  }
  
  .footer-links,
  .footer-contact {
    list-style: none;
    padding: 0;
  }
  
  .footer-links li,
  .footer-contact li {
    margin-bottom: 10px;
  }
  
  .footer-links li a {
    color: #ffffff;
    text-decoration: none;
  }
  
  .footer-links li a:hover {
    text-decoration: underline;
  }
  
  .footer-contact li i {
    margin-right: 10px;
  }
  
  .footer-bottom {
    border-top: 1px solid rgba(255, 255, 255, 0.2);
    padding-top: 20px;
    margin-top: 80px;
    font-size: 14px;
  }
  </style>
  