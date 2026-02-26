# EXCELENTE 🚀 - Chat em Tempo Real

O **EXCELENTE** é uma aplicação de chat moderna, inspirada na interface do Google Gemini, focada em velocidade, design minimalista e experiência do usuário tanto em dispositivos móveis quanto em desktops.

![Status do Projeto](https://img.shields.io/badge/Status-Finalizado-brightgreen)
![Firebase](https://img.shields.io/badge/Backend-Firebase-orange)
![Interface](https://img.shields.io/badge/Interface-Gemini_Style-blue)

---

## ✨ Funcionalidades

* **⚡ Tempo Real:** Mensagens enviadas e recebidas instantaneamente via Firebase Realtime Database.
* **🌓 Temas Dinâmicos:** Suporte a modo Escuro e modo Claro com troca rápida.
* **📱 Responsividade Mobile:** Layout adaptativo com menu lateral retrátil e cabeçalho fixo.
* **👑 Sistema de Badge:** Identificação automática de Administrador para o usuário **MAIKE**.
* **🟢 Indicador Online:** Contador de usuários ativos no grupo em tempo real.
* **📝 Gerenciamento:** Botão para limpeza global do histórico de mensagens.
* **⌨️ Atalhos de Teclado:** Envio de mensagens rápido com a tecla `Enter`.

---

## 🚀 Tecnologias Utilizadas

O projeto foi construído utilizando tecnologias web puras para garantir performance:

* **HTML5:** Estrutura semântica.
* **CSS3:** Flexbox, CSS Variables, Sticky Headers e Animações.
* **JavaScript (ES6+):** Lógica do sistema e manipulação de DOM.
* **Firebase:** Realtime Database para armazenamento e sincronização de dados.

---

## 🛠️ Como Instalar e Rodar

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/Maike-Simoncini/excelente-chat.git](https://github.com/Maike-Simoncini/excelente-chat.git)
    ```
2.  **Configure o Firebase:**
    * No arquivo `script.js`, localize o objeto `firebaseConfig`.
    * Substitua as chaves pelas chaves do seu próprio projeto no console do Firebase (opcional, caso queira usar seu próprio banco).

3.  **Abra o projeto:**
    * Basta abrir o arquivo `index.html` em qualquer navegador moderno.
    * *Dica:* Para o Firebase funcionar corretamente, recomenda-se usar uma extensão como "Live Server" no VS Code.

---

## 🎨 Personalização

Para alterar o nome do administrador ou adicionar novas cores de usuários, edite as seguintes funções no `script.js`:

* **Cor dos usuários:** Altere o array dentro da função `gerarCor()`.
* **Nome do ADM:** Altere a verificação de `msg.usuario === 'MAIKE'` para o seu nome escolhido.

---

## ⚠️ Regras do Grupo

Este projeto foi configurado com um aviso de conduta:
> "Seja educado! Este é um grupo público gerenciado pelo ADM."

---

## 📄 Licença

Este projeto está sob a licença MIT. Sinta-se livre para usar, modificar e distribuir.

---

Criado com ❤️ por **Maike** - *EXCELENTE 🚀*
