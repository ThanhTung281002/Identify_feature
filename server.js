const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Kết nối MongoDB
mongoose.connect('mongodb+srv://USERNAME:PASSWORD@cluster0.mongodb.net/mydatabase?retryWrites=true&w=majority')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Schema và Model
const FormSchema = new mongoose.Schema({
    name: String,
    email: String
}, { timestamps: true });

const Form = mongoose.model('Form', FormSchema);

// POST endpoint
app.post('/submit', async (req, res) => {
    try {
        const formData = new Form(req.body); // tạo document từ form
        await formData.save();               // lưu vào MongoDB
        res.json({ status: 'success', message: 'Data saved to MongoDB!' });
    } catch (err) {
        res.json({ status: 'error', message: err.message });
    }
});

// GET tất cả form data (để test)
app.get('/forms', async (req, res) => {
    const data = await Form.find();
    res.json(data);
});

// Start server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});