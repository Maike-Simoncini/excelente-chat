import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getDatabase, ref, push, onChildAdded, remove, onValue, set, onDisconnect } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCQvYAPoDseWSDV50RHXoImk2zzx822amU",
  authDomain: "meuzap-be2dd.firebaseapp.com",
  databaseURL: "https://meuzap-be2dd-default-rtdb.firebaseio.com",
  projectId: "meuzap-be2dd",
  storageBucket: "meuzap-be2dd.firebasestorage.app",
  messagingSenderId: "4751380990",
  appId: "1:4751380990:web:34b4219fb8b19407ecb0af"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const messagesRef = ref(db, 'mensagens');
const onlineRef = ref(db, 'online');

let meuNome = "";
const coresUsuarios = {};
const notifySound = new Audio('snap.mp3');

// Elementos
const modal = document.getElementById('loginModal');
const startBtn = document.getElementById('startChat');
const nameInput = document.getElementById('usernameInput');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const chatBox = document.getElementById('chatBox');
const clearBtn = document.getElementById('clearChatBtn');
const onlineCountSpan = document.getElementById('onlineCount');
const displayMyName = document.getElementById('displayMyName');
const emojiBtn = document.getElementById('emojiBtn');

// --- CONFIGURAÇÃO DO EMOJI PICKER ---
const picker = new EmojiButton({ position: 'top-start' });

emojiBtn.addEventListener('click', () => {
  picker.togglePicker(emojiBtn);
});

picker.on('emoji', selection => {
  messageInput.value += selection;
});

// --- LOGICA DE LOGIN ---
startBtn.onclick = () => {
    const nomeDigitado = nameInput.value.trim();
    if (nomeDigitado !== "") {
        meuNome = nomeDigitado;
        displayMyName.innerText = meuNome;
        modal.style.display = 'none';

        if (meuNome.toUpperCase() === "MAIKE") {
            clearBtn.style.display = "block";
        }

        const userStatusRef = ref(db, 'online/' + meuNome);
        set(userStatusRef, true);
        onDisconnect(userStatusRef).remove();
    }
};

// --- MONITORAR ONLINE ---
onValue(onlineRef, (snapshot) => {
    onlineCountSpan.innerText = snapshot.size || 0;
});

// --- FUNÇÃO ENVIAR ---
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

clearBtn.onclick = () => {
    if (confirm("Apagar histórico para todos?")) {
        remove(messagesRef);
        chatBox.innerHTML = "";
    }
};

// --- RECEBER MENSAGENS ---
const gerarCor = () => {
    const cores = ['#34B7F1', '#FF5733', '#C70039', '#900C3F', '#FFC300', '#A29BFE'];
    return cores[Math.floor(Math.random() * cores.length)];
};

onChildAdded(messagesRef, (data) => {
    const msg = data.val();
    const div = document.createElement('div');
    const dataMsg = new Date(msg.timestamp);
    const hora = dataMsg.getHours().toString().padStart(2, '0') + ':' + dataMsg.getMinutes().toString().padStart(2, '0');
    
    div.classList.add('message');

    if (msg.usuario === meuNome) {
        div.classList.add('sent');
        div.innerHTML = `<span>${msg.texto}</span><small style="display:block; font-size:10px; opacity:0.5; text-align:right;">${hora}</small>`;
    } else {
        if (!coresUsuarios[msg.usuario]) coresUsuarios[msg.usuario] = gerarCor();
        div.classList.add('received');
        div.innerHTML = `<small style="color:${coresUsuarios[msg.usuario]}; font-weight:bold;">${msg.usuario}</small><br><span>${msg.texto}</span><small style="display:block; font-size:10px; opacity:0.5; text-align:right;">${hora}</small>`;
        notifySound.play().catch(() => {});
    }
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
});
