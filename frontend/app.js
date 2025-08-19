let currentUser = null;
let selectedUser = null;
let allUsers = [];
const API_BASE = "http://localhost:5000";

// Track which messages we have already rendered to avoid duplicates during polling
const renderedMessageIds = new Set();

// DOM Elements
const emojiBtn = document.getElementById("emoji-btn");
const emojiPicker = document.getElementById("emoji-picker");
const emojis = ["😁","😀","😂","😍","😎","😢","👍","🔥","🎉","🥰","❤️","🤔","🎁","✨","👋"];

// Initialize the app
function init() {
  renderEmojis();
}

// AUTH FUNCTIONS
function showRegister() {
  document.getElementById("login-form").classList.add("hidden");
  document.getElementById("register-form").classList.remove("hidden");
}

function showLogin() {
  document.getElementById("register-form").classList.add("hidden");
  document.getElementById("login-form").classList.remove("hidden");
}

async function login() {
  const username = document.getElementById("login-username").value.trim();
  const password = document.getElementById("login-password").value.trim();

  if (!username || !password) {
    alert("Please enter both username and password!");
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) throw new Error("Invalid login");
    const data = await res.json();

    currentUser = data.user;
    document.getElementById("auth-section").classList.add("hidden");
    document.getElementById("chat-container").classList.remove("hidden");
    document.getElementById("chat-container").classList.add("chat-container");
    document.getElementById("current-user-dp").innerText =
      currentUser.name[0].toUpperCase();

    loadUsers();
    pollMessages();
  } catch (err) {
    alert("Login failed: " + err.message);
  }
}

async function register() {
  const name = document.getElementById("register-name").value.trim();
  const username = document.getElementById("register-username").value.trim();
  const password = document.getElementById("register-password").value.trim();

  if (!name || !username || !password) {
    alert("Please fill all registration fields!");
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, username, password }),
    });

    if (!res.ok) throw new Error("Registration failed");
    showLogin();
    alert("Registered successfully! Please login.");
  } catch (err) {
    alert(err.message);
  }
}

function logout() {
  currentUser = null;
  selectedUser = null;
  renderedMessageIds.clear();
  document.getElementById("chat-username").innerText = "Select a user";
  document.getElementById("user-dp").innerText = "";
  document.getElementById("messages").innerHTML = "";
  document.getElementById("auth-section").classList.remove("hidden");
  document.getElementById("chat-container").classList.add("hidden");
  document.getElementById("login-username").value = "";
  document.getElementById("login-password").value = "";
}

// Handle click on user menu
document.getElementById("user-menu").addEventListener("click", function (e) {
  e.stopPropagation();
  document.getElementById("logout-dropdown").classList.toggle("hidden");
});
document.addEventListener("click", function () {
  document.getElementById("logout-dropdown").classList.add("hidden");
});

// USER FUNCTIONS 
async function loadUsers() {
  try {
    const res = await fetch(`${API_BASE}/users`);
    const data = await res.json();

    allUsers = data.users
      .filter((u) => u._id !== currentUser.id)
      .sort((a, b) => a.name.localeCompare(b.name));
    renderUserList(allUsers);
  } catch {
    alert("Failed to load users");
  }
}

function renderUserList(users) {
  const list = document.getElementById("user-list");
  list.innerHTML = "";

  users.forEach((u) => {
    const li = document.createElement("li");
    li.innerHTML = `<div class="user-dp">${u.name[0].toUpperCase()}</div> ${u.name}`;
    li.onclick = () => selectUser(u);
    list.appendChild(li);
  });

  document.getElementById("user-count").innerText = users.length;
}

function searchUsers() {
  const searchTerm = document.getElementById("search-user").value.toLowerCase();
  const filteredUsers = allUsers.filter((u) =>
    u.username.toLowerCase().includes(searchTerm)
  );
  renderUserList(filteredUsers);
}

async function selectUser(user) {
  selectedUser = user;
  document.getElementById("chat-username").innerText = user.name;
  document.getElementById("user-dp").innerText = user.username[0].toUpperCase();

  // Reset UI + de-dup state when switching threads
  document.getElementById("messages").innerHTML = "";
  renderedMessageIds.clear();

  await loadChatHistory(user);
}

async function loadChatHistory(user) {
  try {
    const res = await fetch(
      `${API_BASE}/messages/history?user1=${currentUser.id}&user2=${user._id}`
    );
    const data = await res.json();

    const msgContainer = document.getElementById("messages");
    msgContainer.innerHTML = "";

    data.messages.forEach((msg) => {
      // Avoid duplicates if polling lands at the same time
      renderedMessageIds.add(String(msg._id));

      const msgDiv = document.createElement("div");

      if (msg.senderId === currentUser.id) {
        // SENDER VIEW: gift shows only "Secret Message", never the real text & no deletion
        msgDiv.classList.add("message", "sent");
        const gift = document.createElement("div");
        gift.classList.add("gift");
        gift.innerText = "🎁 Gift Sent";
        gift.onclick = () => {
          gift.innerText = "You have sent can't be read";
          gift.classList.add("unwrapped");
        };
        msgDiv.appendChild(gift);
      } else {
        // RECEIVER VIEW: gift reveals real text and auto-deletes after 30s
        msgDiv.classList.add("message", "received");
        const gift = document.createElement("div");
        gift.classList.add("gift");
        gift.innerText = "🎁 Secret Message (Click to View)";
        gift.onclick = async () => {
          gift.innerText = msg.text;
          gift.classList.add("unwrapped");

          setTimeout(async () => {
            try {
              await fetch(`${API_BASE}/messages/delete/${msg._id}`, {
                method: "POST",
              });
              gift.innerText = "Message deleted";
              gift.classList.add("expired");
            } catch (err) {
              console.error("Error deleting after timeout:", err);
            }
          }, 30000);
        };
        msgDiv.appendChild(gift);
      }

      msgContainer.appendChild(msgDiv);
    });

    msgContainer.scrollTop = msgContainer.scrollHeight;
  } catch (err) {
    console.error("Error loading chat history:", err);
  }
}

// MESSAGE FUNCTIONS 
function handleKeyPress(e) {
  if (e.key === "Enter") {
    sendMessage();
  }
}

async function sendMessage() {
  if (!selectedUser) {
    alert("Select a user first!");
    return;
  }

  const input = document.getElementById("message-input");
  const text = input.value.trim();
  if (!text) return;

  try {
    const res = await fetch(`${API_BASE}/messages/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        senderId: currentUser.id,
        receiverId: selectedUser._id,
        text: text,
      }),
    });

    if (!res.ok) throw new Error("Failed to send message");
    const saved = await res.json(); // { id }

    // SENDER VIEW: gift (no real text reveal, no delete)
    const msgContainer = document.getElementById("messages");
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("message", "sent");

    const gift = document.createElement("div");
    gift.classList.add("gift");
    gift.innerText = "🎁 Gift Sent";
    gift.onclick = () => {
      gift.innerText = "You have sent can't be read";
      gift.classList.add("unwrapped");
    };

    // Track id so polling doesn't re-render it as incoming by mistake
    renderedMessageIds.add(String(saved.id));

    msgDiv.appendChild(gift);
    msgContainer.appendChild(msgDiv);
    input.value = "";
    msgContainer.scrollTop = msgContainer.scrollHeight;
  } catch (err) {
    alert("Failed to send message: " + err.message);
  }
}

async function pollMessages() {
  if (!currentUser) return;

  try {
    if (selectedUser) {
      const res = await fetch(
        `${API_BASE}/messages/receive?receiverId=${currentUser.id}&senderId=${selectedUser._id}`
      );
      const data = await res.json();

      if (data.messages && data.messages.length > 0) {
        const msgContainer = document.getElementById("messages");

        data.messages.forEach((msg) => {
          const id = String(msg._id);
          if (renderedMessageIds.has(id)) return; // skip duplicates
          renderedMessageIds.add(id);

          const msgDiv = document.createElement("div");
          msgDiv.classList.add("message", "received");

          const gift = document.createElement("div");
          gift.classList.add("gift");
          gift.innerText = "🎁 Secret Message (Click to View)";

          gift.onclick = async () => {
            gift.innerText = msg.text;
            gift.classList.add("unwrapped");

            // Auto-delete after 30s ONLY for receiver
            setTimeout(async () => {
              try {
                await fetch(`${API_BASE}/messages/delete/${msg._id}`, {
                  method: "POST",
                });
                gift.innerText = "Message deleted";
                gift.classList.add("expired");
              } catch (err) {
                console.error("Error deleting message:", err);
              }
            }, 30000);
          };

          msgDiv.appendChild(gift);
          msgContainer.appendChild(msgDiv);
          msgContainer.scrollTop = msgContainer.scrollHeight;
        });
      }
    }
  } catch (err) {
    console.error("Polling error:", err);
  }

  setTimeout(pollMessages, 3000); // keep polling every 3s
}

// EMOJI PICKER
function renderEmojis() {
  emojiPicker.innerHTML = "";
  emojis.forEach((e) => {
    const span = document.createElement("span");
    span.innerText = e;
    span.onclick = () => {
      document.getElementById("message-input").value += e;
      emojiPicker.classList.add("hidden");
    };
    emojiPicker.appendChild(span);
  });
}

emojiBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  if (emojiPicker.classList.contains("hidden")) {
    emojiPicker.classList.remove("hidden");
    emojiPicker.classList.add("emoji-picker");
  } else {
    emojiPicker.classList.add("hidden");
    emojiPicker.classList.remove("emoji-picker");
  }
});

document.addEventListener("click", (e) => {
  if (!emojiPicker.contains(e.target) && e.target !== emojiBtn) {
    emojiPicker.classList.add("hidden");
  }
});

document.addEventListener("DOMContentLoaded", init);