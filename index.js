const express = require('express');
const fs = require('fs');
const path = require('path');
const { port } = require("./utils/config");
const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Configuration
const UPLOAD_FOLDER = path.join(__dirname, 'date-time-folder');

// Ensure the upload folder exists
if (!fs.existsSync(UPLOAD_FOLDER)) {
    fs.mkdirSync(UPLOAD_FOLDER, { recursive: true });
}

// Function to format current date and time for filename
const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
};

// Endpoint to create a text file with current timestamp as content
app.post('/create-file', (req, res) => {
    const timestamp = getCurrentDateTime();
    const filename = `${getCurrentDateTime()}.txt`;
    const filePath = path.join(UPLOAD_FOLDER, filename);

    fs.writeFile(filePath, timestamp, (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        res.status(201).json({ message: `File '${filename}' created successfully with timestamp '${timestamp}'` });
    });
});

// Endpoint to retrieve all text files in the upload folder
app.get('/files', (req, res) => {
    fs.readdir(UPLOAD_FOLDER, (err, files) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        // Filter to only include .txt files
        const textFiles = files.filter(file => path.extname(file) === '.txt');

        res.status(200).json({ files: textFiles });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
