# ReadOnce – Encrypted Self-Erasing Message Platform

ReadOnce is a secure web application that enables users to send confidential, encrypted messages that can only be read once before automatically self-destructing. It uses **AES-256-GCM encryption** to ensure data confidentiality and integrity, protecting messages from unauthorized access. Designed for privacy-first communication, it eliminates the risk of sensitive information being stored or reused.

---

## Project Demonstration

### 1. Real-time Chat
We can see the **real-time chat interface** where two users are communicating.  
- The left panel shows the **list of users** (e.g., Luffy, Sanji, Shanks, Zoro).  
- The chat area displays sent and received messages.  
- Once a message is sent, it is **erased from the sender’s side** and replaced with a placeholder:  
  > "You have sent can't be read"  
  This ensures the sender cannot view the message again after sending.
<img width="1766" height="855" alt="image" src="https://github.com/user-attachments/assets/2dc434ee-0a1e-4a38-9b7b-144b70a1fe1f" />


### 2. Read-Once Secret Messages
This highlights the **read-once functionality**.  
- Messages are sent as **secret gifts**, displayed as:  
  > 🎁 Secret Message (Click to View)  
  Once the receiver clicks to view the message, it is **revealed once and then permanently deleted**.  
- On the sender’s side, the message appears as:  
  > 🎁 Gift Sent  
  This feature guarantees that messages are **temporary and vanish after being read**, making conversations more private and secure.
<img width="1785" height="869" alt="image" src="https://github.com/user-attachments/assets/a21b8a4d-1528-481a-b548-dac89c134beb" />


### 🔑 Key Highlights
- Real-time chat with multiple users.  
- Self-destructing (read-once) messages.  
- User-friendly interface with clean design.  
- Ensures privacy — once read, messages cannot be retrieved again.

---

## 🚀 Features

- 🔑 User Registration – Users can register with unique usernames.
- 💬 Real-Time Chat – Instant two-way communication.
- 🗑️ Self-Erasing Messages – Once the recipient reads a message, it is deleted automatically from the database.
- 📂 MongoDB Storage – Messages are temporarily stored until they are read.
- 🖥️ Simple & Clean UI – Minimal frontend with focus on chat experience.
- 🔄 Auto-Update – Messages appear in real-time without page reloads.

---

## 🔍 How It Works

1. 🔐 Register/Login
    - A user registers with a username.
    - The server stores the user in MongoDB.

2. 💬 Send a Message
    - User A sends a message to User B.
    - The message is stored in MongoDB until User B reads it.

3. 👀 Read & Auto-Delete
    - When User B opens the message, it is displayed once.
    - The server then deletes it permanently from MongoDB.

4. 🔄 Real-Time Updates
    - Ensure both sender and receiver see updates instantly.

---

## 🛠️ Tech Stack

- Frontend:
    - HTML5 – Structure of the application
    - CSS3 – Styling and responsive design
    - JavaScript (Vanilla JS) – Client-side interactivity
- Backend:
    - Node.js – JavaScript runtime environment
    - Express.js – Web framework for building APIs and handling routes
- Database:
    - MongoDB – NoSQL database for storing users and messages

---

## 🚀 How to Run the Project

1. Clone the repository
```bash
git clone https://github.com/Sayan-Mondal2022/encrypted_self_erasing_message_platform.git
```

2. Navigate into the project folder
```bash
cd encrypted_self_erasing_message_platform
```

3. Set up the backend
```bash
cd backend
npm install
```

4. Run the backend server
```bash
node server.js
or
npm start
```

5. Open the frontend
  - Simply open the `chat.html` file in your browser to access the platform.

---

## 🗂️ Project Structure

```bash
encrypted_self_erasing_message_platform
├── backend
│   ├── config
│   │   └── db.js              # Connecting the with the local database
│   ├── models                 
│   │   ├── messages.js        # Makes the Message schema
│   │   └── users.js           # Makes the User Schema
│   ├── routes
│   │   ├── messageRoutes.js   # Handles everything related to the messages (Like Sending, Receiving, Deleting)
│   │   └── userRoutes.js      # Handles all the logic related to the User like Login/Register
│   ├── utils
│   │   └── crypto.js          # Handles the Message Encryption and Decryption
│   ├── package-lock.json
│   ├── package.json
│   └── server.js
├── frontend
│   ├── app.js                 # Handles the frontend logic
│   ├── chat.css               # Styling sheet
│   └── chat.html              # Structure of the Webpage
├── .gitignore
└── README.md
```

---

## 🙏 Acknowledgement

I would like to express my gratitude to all the open-source libraries, frameworks, and tools that made this project possible. Special thanks to:
- **Node.js and Express.js** for providing a fast and reliable backend framework.
- **MongoDB** for the flexible and scalable database solution.
- **HTML, CSS, and JavaScript** for building the frontend structure and styling.
- The open-source developer community for continuous support, documentation, and inspiration.

This project was developed as a learning experience and would not have been possible without the contributions of these amazing technologies and communities.

---
