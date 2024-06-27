const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Configuration
const UPLOAD_FOLDER = path.join(__dirname, 'your_folder_path'); // Replace 'your_folder_path' with your actual folder path

// Endpoint to retrieve all text files in the folder
app.get('/files', (req, res) => {
    fs.readdir(UPLOAD_FOLDER, (err, files) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        const textFiles = files.filter(file => {
            return fs.statSync(path.join(UPLOAD_FOLDER, file)).isFile() && file.endsWith('.txt');
        });

        res.json({ files: textFiles });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
