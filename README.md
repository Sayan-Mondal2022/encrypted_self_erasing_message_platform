# ReadOnce – Encrypted Self-Erasing Message Platform

A secure web application that allows a user to send an encrypted message to a recipient, which will automatically self-destruct after being read once.


## Project Structure
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

Installation steps
```bash
# Cloning from the github
git clone https://github.com/Sayan-Mondal2022/encrypted_self_erasing_message_platform.git

# Will be the main project folder
cd encrypted_self_erasing_message_platform          

# Setting up the backend by installing the dependencies.
cd server
npm install
```
