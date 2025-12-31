const express = require('express');
const app = express();
const port = 3000;

// Middleware
app.use(express.json()); // parse JSON body
app.use(express.urlencoded({ extended: true })); // parse URL-encoded body
app.use(express.static('public')); // serve static files

// POST endpoint
app.post('/submit', (req, res) => {
    console.log('Form Data Received:', req.body);
    res.json({ status: 'success', message: 'Form data received successfully!' });
});

// Start server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
