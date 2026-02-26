import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getDatabase, ref, push, onChildAdded, remove, onValue, set, onDisconnect } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";

// 1. Suas chaves do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCQvYAPoDseWSDV50RHXoImk2zzx822amU",
  authDomain: "meuzap-be2dd.firebaseapp.com",
  databaseURL: "https://meuzap-be2dd-default-rtdb.firebaseio.com",
  projectId: "meuzap-be2dd",
  storageBucket: "meuzap-be2dd.firebasestorage.app",
  messagingSenderId: "4751380990",
  appId: "1:4751380990:web:34b4219fb8b19407ecb0af"
};

// 2. Inicialização
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const messagesRef = ref(db, 'mensagens');
const onlineRef = ref(db, 'online'); // Referência para usuários online

// 3. Variáveis Globais
let meuNome = "";
const coresUsuarios = {};
const notifySound = new Audio('snap.mp3');

// 4. Referências do HTML
const modal = document.getElementById('loginModal');
const startBtn = document.getElementById('startChat');
const nameInput = document.getElementById('usernameInput');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const chatBox = document.getElementById('chatBox');
const clearBtn = document.getElementById('clearChatBtn');
const displayMyName = document.getElementById('displayMyName'); // Onde aparece seu nome
const onlineCountSpan = document.getElementById('onlineCount'); // Onde aparece o contador
const emojiBtn = document.getElementById('emojiBtn'); // Botão de emoji

// --- 5. LÓGICA DO SELETOR DE EMOJI ---
try {
    const picker = new EmojiButton({
        position: 'top-start',
        rootElement: document.body
    });

    emojiBtn.onclick = () => {
        picker.togglePicker(emojiBtn);
    };

    picker.on('emoji', selection => {
        messageInput.value += selection;
        messageInput.focus();
    });
} catch (e) {
    console.log("Aguardando carregamento da biblioteca de emojis...");
}

// --- 6. LÓGICA DE LOGIN ---
startBtn.onclick = () => {
    const nomeDigitado = nameInput.value.trim();
    if (nomeDigitado !== "") {
        meuNome = nomeDigitado;
        
        // Atualiza o nome na tela (Barra Lateral)
        if(displayMyName) displayMyName.innerText = meuNome;
        
        modal.style.display = 'none';

        // Lógica de Admin
        if (meuNome.toUpperCase() === "MAIKE") {
            clearBtn.style.display = "block";
        } else {
            clearBtn.style.display = "none";
        }

        // --- SISTEMA DE PRESENÇA (ONLINE) ---
        const myStatusRef = ref(db, 'online/' + meuNome);
        set(myStatusRef, true);
        // Remove da lista quando fechar a aba
        onDisconnect(myStatusRef).remove();
    }
};

// --- 7. ATUALIZAR CONTADOR ONLINE ---
onValue(onlineRef, (snapshot) => {
    const totalOnline = snapshot.size || 0;
    if(onlineCountSpan) onlineCountSpan.innerText = totalOnline;
});

// --- 8. FUNÇÕES DE MENSAGEM ---
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

const gerarCor = () => {
    const cores = ['#34B7F1', '#FF5733', '#C70039', '#900C3F', '#FFC300', '#A29BFE'];
    return cores[Math.floor(Math.random() * cores.length)];
};

clearBtn.onclick = () => {
    if (confirm("ATENÇÃO: Deseja apagar TODO o histórico?")) {
        remove(messagesRef);
        chatBox.innerHTML = "";
    }
};

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
        if (!coresUsuarios[msg.usuario]) coresUsuarios[msg.usuario] = gerarCor();
        div.classList.add('received');
        div.innerHTML = `<small style="display:block; color:${coresUsuarios[msg.usuario]}; font-weight:bold; margin-bottom:4px;">${msg.usuario}</small>
                         <span>${msg.texto}</span>
                         <small style="display:block; font-size:10px; opacity:0.5; text-align:right; margin-top:4px;">${hora}</small>`;
        notifySound.play().catch(() => {});
    }
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
});
