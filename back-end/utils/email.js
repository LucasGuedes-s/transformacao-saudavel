import nodemailer from "nodemailer";
import "dotenv/config";

export async function enviarEmailCadastro(destinatario, nomeUsuario) {
  try {
    // Configuração do transporte SMTP
    const transporter = nodemailer.createTransport({
    service: 'gmail', // ou 'hotmail', 'outlook', etc. (ou use SMTP manual)
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

    const mailOptions = {
        from: `"Equipe Transformação Saudável" <${process.env.EMAIL_USER}>`,
        to: destinatario,
        subject: "💙 Bem-vindo(a) à Transformação Saudável!",
        html: `
        <div style="font-family: Arial, sans-serif; background-color: #f5f9ff; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 10px; box-shadow: 0 2px 6px rgba(0,0,0,0.1); overflow: hidden;">
            
            <!-- Cabeçalho -->
            <div style="background-color: #4da6ff; color: #fff; text-align: center; padding: 25px 10px;">
                <h1 style="margin: 0; font-size: 24px;">Transformação Saudável 💙</h1>
            </div>

            <!-- Corpo -->
            <div style="padding: 30px; color: #333; line-height: 1.6;">
                <p style="font-size: 18px;">Olá <b>${nomeUsuario}</b>,</p>

                <p>Seja muito bem-vindo(a) à <b>Transformação Saudável!</b> 💙 Estamos muito felizes em ter você aqui e prontos para te ajudar a conquistar seus objetivos de saúde e bem-estar.</p>

                <p>Nossa plataforma foi criada para oferecer um plano alimentar totalmente personalizado, gerando receitas e dietas sob medida para você, com base no seu perfil, gostos e necessidades. Esqueça soluções genéricas – aqui, cada detalhe é pensado para que sua experiência seja única e eficiente!</p>

                <h3 style="color: #4da6ff;">🔹 O que você pode esperar da nossa plataforma?</h3>
                <ul style="padding-left: 20px;">
                <li>✅ Receitas deliciosas e equilibradas para o seu dia a dia</li>
                <li>✅ Planos alimentares personalizados para atingir seus objetivos</li>
                <li>✅ Facilidade e praticidade para transformar sua alimentação</li>
                <li>✅ Suporte e acompanhamento para manter você motivado(a)</li>
                </ul>

                <p>Estamos aqui para tornar sua jornada mais leve, saborosa e saudável! 🍏✨</p>

                <div style="text-align: center; margin: 30px 0;">
                <a href="https://transformacao-saudavel.vercel.app" target="_blank"
                    style="background-color: #4da6ff; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                    👉 Acessar minha conta
                </a>
                </div>

                <p>Se tiver dúvidas, nossa equipe está sempre disponível para te ajudar!</p>
                <p>Fique à vontade e aproveite ao máximo essa experiência. 🚀</p>

                <p style="margin-top: 25px;">Atenciosamente,<br>
                <b>Equipe Transformação Saudável 💙</b></p>
            </div>

            <!-- Rodapé -->
            <div style="background-color: #f0f8ff; text-align: center; padding: 15px; font-size: 13px; color: #777;">
                © ${new Date().getFullYear()} Transformação Saudável. Todos os direitos reservados.
            </div>

            </div>
        </div>
        `,
        };

    // Envia o e-mail
    await transporter.sendMail(mailOptions);
    console.log(`✅ E-mail de boas-vindas enviado para ${destinatario}`);
  } catch (error) {
    console.error("❌ Erro ao enviar e-mail:", error);
  }
}


export async function enviarEmailPagamento(destinatario) {
  try {
    // Configuração do transporte SMTP
    const transporter = nodemailer.createTransport({
    service: 'gmail', // ou 'hotmail', 'outlook', etc. (ou use SMTP manual)
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

   const mailOptions = {
      from: `"Equipe Transformação Saudável" <${process.env.EMAIL_USER}>`,
      to: destinatario,
      subject: "💚 Seu pagamento foi confirmado! Suas receitas já estão disponíveis 🍽️",
      html: `
      <div style="font-family: Arial, sans-serif; background-color: #f5f9ff; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 10px; box-shadow: 0 2px 6px rgba(0,0,0,0.1); overflow: hidden;">
          
          <!-- Cabeçalho -->
          <div style="background-color: #4da6ff; color: #fff; text-align: center; padding: 25px 10px;">
            <h1 style="margin: 0; font-size: 24px;">Pagamento Confirmado 💚</h1>
          </div>

          <!-- Corpo -->
          <div style="padding: 30px; color: #333; line-height: 1.6;">
            <p style="font-size: 18px;">Olá tudo bem?</p>

            <p>🎉 Temos uma ótima notícia! Seu <b>pagamento foi confirmado com sucesso</b> e agora suas receitas personalizadas estão disponíveis na plataforma <b>Transformação Saudável</b>.</p>

            <p>Você já pode acessar seu plano alimentar completo, preparado com base no seu perfil e preferências, para te ajudar a alcançar seus objetivos com mais sabor e equilíbrio. 🥗✨</p>

            <h3 style="color: #4da6ff;">🍽️ Dentro da plataforma, você encontrará:</h3>
            <ul style="padding-left: 20px;">
              <li>✅ Receitas deliciosas e fáceis de preparar</li>
              <li>✅ Planos alimentares ajustados ao seu objetivo</li>
              <li>✅ Dicas de alimentação saudável e bem-estar</li>
              <li>✅ Acompanhamento contínuo da sua jornada</li>
            </ul>

            <p style="margin-top: 20px;">Aproveite ao máximo esse momento e comece hoje mesmo a sua transformação!</p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="https://transformacao-saudavel.vercel.app" target="_blank"
                style="background-color: #4da6ff; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                🍏 Acessar minhas receitas
              </a>
            </div>

            <p>Qualquer dúvida, nossa equipe está pronta para te ajudar a aproveitar cada etapa da sua jornada.</p>

            <p style="margin-top: 25px;">Com carinho,<br>
            <b>Equipe Transformação Saudável 💙</b></p>
          </div>

          <!-- Rodapé -->
          <div style="background-color: #f0f8ff; text-align: center; padding: 15px; font-size: 13px; color: #777;">
            © ${new Date().getFullYear()} Transformação Saudável. Todos os direitos reservados.
          </div>

        </div>
      </div>
      `,
    };

    // Envia o e-mail
    await transporter.sendMail(mailOptions);
    console.log(`✅ E-mail de boas-vindas enviado para ${destinatario}`);
  } catch (error) {
    console.error("❌ Erro ao enviar e-mail:", error);
  }
}
