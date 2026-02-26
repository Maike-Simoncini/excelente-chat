import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getDatabase, ref, push, onChildAdded, remove, onValue, set, onDisconnect } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";

// 1. Configuração do Firebase (Suas Chaves)
const firebaseConfig = {
  apiKey: "AIzaSyCQvYAPoDseWSDV50RHXoImk2zzx822amU",
  authDomain: "meuzap-be2dd.firebaseapp.com",
  databaseURL: "https://meuzap-be2dd-default-rtdb.firebaseio.com",
  projectId: "meuzap-be2dd",
  storageBucket: "meuzap-be2dd.firebasestorage.app",
  messagingSenderId: "4751380990",
  appId: "1:4751380990:web:34b4219fb8b19407ecb0af"
};

// 2. Inicialização do Banco de Dados
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const messagesRef = ref(db, 'mensagens');
const onlineRef = ref(db, 'online');

// 3. Variáveis de Estado
let meuNome = "";
const coresUsuarios = {};
const notifySound = new Audio('snap.mp3');

// 4. Referências dos Elementos HTML
const modal = document.getElementById('loginModal');
const startBtn = document.getElementById('startChat');
const nameInput = document.getElementById('usernameInput');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const chatBox = document.getElementById('chatBox');
const displayMyName = document.getElementById('displayMyName');
const onlineCountSpan = document.getElementById('onlineCount');
const sidebar = document.getElementById('sidebar');
const menuToggle = document.getElementById('menuToggle');
const closeMenu = document.getElementById('closeMenu');

// --- 5. LÓGICA DO MENU LATERAL (MODELO GEMINI) ---

// Abrir barra lateral (Mobile)
if (menuToggle) {
    menuToggle.onclick = (e) => {
        e.stopPropagation();
        sidebar.classList.add('active');
    };
}

// Fechar barra lateral (Botão ☰ dentro da sidebar ou Mobile)
if (closeMenu) {
    closeMenu.onclick = () => {
        sidebar.classList.remove('active');
    };
}

// Fechar ao clicar fora (no chat) se estiver no celular
chatBox.onclick = () => {
    if (window.innerWidth < 768) {
        sidebar.classList.remove('active');
    }
};

// --- 6. SISTEMA DE LOGIN E PRESENÇA ---

startBtn.onclick = () => {
    const nome = nameInput.value.trim();
    if (nome !== "") {
        meuNome = nome;
        if (displayMyName) displayMyName.innerText = meuNome;
        modal.style.display = 'none';

        // Registra que o usuário entrou
        const myStatusRef = ref(db, 'online/' + meuNome);
        set(myStatusRef, true);
        
        // Remove automaticamente quando fechar a página
        onDisconnect(myStatusRef).remove();
    }
};

// Atualiza o contador de pessoas online em tempo real
onValue(onlineRef, (snapshot) => {
    const total = snapshot.size || 0;
    if (onlineCountSpan) onlineCountSpan.innerText = total;
});

// --- 7. ENVIO DE MENSAGENS ---

function enviarMensagem() {
    const texto = messageInput.value.trim();
    if (texto !== "" && meuNome !== "") {
        push(messagesRef, {
            texto: texto,
            usuario: meuNome,
            timestamp: Date.now()
        });
        messageInput.value = "";
    }
}

sendBtn.onclick = enviarMensagem;
messageInput.onkeypress = (e) => { if (e.key === 'Enter') enviarMensagem(); };

// --- 8. RECEBIMENTO E EXIBIÇÃO (MODO DARK) ---

const gerarCor = () => ['#8ab4f8', '#ff8bcb', '#c4c7c5', '#34B7F1', '#FFC300'][Math.floor(Math.random() * 5)];

onChildAdded(messagesRef, (data) => {
    const msg = data.val();
    const div = document.createElement('div');
    const hora = new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    div.classList.add('message');
    
    if (msg.usuario === meuNome) {
        div.classList.add('sent');
        div.innerHTML = `<span>${msg.texto}</span>
                         <small style="display:block; font-size:10px; opacity:0.4; text-align:right; margin-top:4px;">${hora}</small>`;
    } else {
        if (!coresUsuarios[msg.usuario]) coresUsuarios[msg.usuario] = gerarCor();
        div.classList.add('received');
        div.innerHTML = `<small style="color:${coresUsuarios[msg.usuario]}; font-weight:bold; font-size:12px;">${msg.usuario}</small><br>
                         <span>${msg.texto}</span>
                         <small style="display:block; font-size:10px; opacity:0.4; text-align:right; margin-top:4px;">${hora}</small>`;
        
        // Toca som de notificação
        notifySound.play().catch(() => {});
    }
    
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight; // Rola para a última mensagem
});
