const chatList = document.getElementById("chatList");
const messages = document.getElementById("messages");
const chatHeader = document.getElementById("chatHeader");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");

// Editable contact list
let contacts = [
  { id: 1, name: "Contact 1", unread: true, messages: [] },
  { id: 2, name: "Contact 2", unread: false, messages: [] },
  { id: 3, name: "Contact 3", unread: true, messages: [] }
];

let currentChat = null;

// Load contact list
function loadContacts() {
  chatList.innerHTML = "";
  contacts.forEach(contact => {
    const div = document.createElement("div");
    div.className = `chat-item ${contact.unread ? "unread" : ""}`;
    div.textContent = contact.name;
    div.dataset.id = contact.id;

    // Click to open chat
    div.addEventListener("click", () => openChat(contact.id));

    // Long press to mark as read/unread
    let pressTimer;
    div.addEventListener("mousedown", () => {
      pressTimer = setTimeout(() => toggleRead(contact.id), 800);
    });
    div.addEventListener("mouseup", () => clearTimeout(pressTimer));

    chatList.appendChild(div);
  });
}

function openChat(id) {
  currentChat = contacts.find(c => c.id === id);
  currentChat.unread = false;
  chatHeader.textContent = currentChat.name;
  renderMessages();
  loadContacts();
}

function renderMessages() {
  messages.innerHTML = "";
  currentChat.messages.forEach(msg => {
    const div = document.createElement("div");
    div.className = `message ${msg.sent ? "sent" : "received"}`;
    div.textContent = msg.text;
    messages.appendChild(div);
  });
}

sendBtn.addEventListener("click", () => {
  const text = messageInput.value.trim();
  if (!text || !currentChat) return;
  currentChat.messages.push({ text, sent: true });
  messageInput.value = "";
  renderMessages();
});

function toggleRead(id) {
  const contact = contacts.find(c => c.id === id);
  contact.unread = !contact.unread;
  loadContacts();
}

// Initial load
loadContacts();
