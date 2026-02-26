import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getDatabase, ref, push, onChildAdded } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";

// Suas chaves do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCQvYAPoDseWSDV50RHXoImk2zzx822amU",
  authDomain: "meuzap-be2dd.firebaseapp.com",
  databaseURL: "https://meuzap-be2dd-default-rtdb.firebaseio.com",
  projectId: "meuzap-be2dd",
  storageBucket: "meuzap-be2dd.firebasestorage.app",
  messagingSenderId: "4751380990",
  appId: "1:4751380990:web:34b4219fb8b19407ecb0af"
};

// Inicializando
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const messagesRef = ref(db, 'mensagens');

let meuNome = "";

// Referências do DOM
const modal = document.getElementById('loginModal');
const startBtn = document.getElementById('startChat');
const nameInput = document.getElementById('usernameInput');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const chatBox = document.getElementById('chatBox');

// Login Simples
startBtn.onclick = () => {
    if (nameInput.value.trim() !== "") {
        meuNome = nameInput.value;
        modal.style.display = 'none';
    }
};

// Função de Enviar
function sendMessage() {
    const text = messageInput.value.trim();
    if (text !== "" && meuNome !== "") {
        push(messagesRef, {
            texto: text,
            usuario: meuNome,
            timestamp: Date.now()
        });
        messageInput.value = "";
    }
}

sendBtn.onclick = sendMessage;
messageInput.onkeypress = (e) => { if (e.key === 'Enter') sendMessage(); };

// Ouvir Mensagens em Tempo Real
onChildAdded(messagesRef, (data) => {
    const msg = data.val();
    const div = document.createElement('div');
    const dataMsg = new Date(msg.timestamp);
    const hora = dataMsg.getHours().toString().padStart(2, '0') + ':' + 
                 dataMsg.getMinutes().toString().padStart(2, '0');
    
    div.classList.add('message');
    
    if (msg.usuario === meuNome) {
        div.classList.add('sent');
        div.innerHTML = `<span>${msg.texto}</span>
                         <small style="display:block; font-size:10px; opacity:0.5; text-align:right; margin-top:4px;">${hora}</small>`;
    } else {
        div.classList.add('received');
        div.innerHTML = `<small style="display:block; color:#008069; font-weight:bold; margin-bottom:4px;">${msg.usuario}</small>
                         <span>${msg.texto}</span>
                         <small style="display:block; font-size:10px; opacity:0.5; text-align:right; margin-top:4px;">${hora}</small>`;
    }
    
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
});