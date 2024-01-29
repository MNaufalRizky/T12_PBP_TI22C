const express = require('express');
const { body, validationResults } = require('express-validator');
const Joi = require('joi');
const joi = require('joi');

const app = express();
const port = 3000;

app.use(express.json());

//Middleware untuk validasi input route menggunakan express-validator
const validateInput = [
    body('Username').isLength({ min: 5 }).withMessage('Panjang username minimal 5 karakter'),
    body('Email').isEmail().withMessage('Format email tidak valid'),
    body('Password').isLength({ min: 8 }).withMessage('Panjang password minimal 8 karakter')
        .matches(/(?=.*\d)(?=.*[a-z](?=.*[A-Z]))/).withMessage('Password harus mengandung huruf kecil, huruf besar, dan angka'),
];

//Middleware untuk validasi input route menggunakan joi
const validateInputJoi = (req, res, next) => {
    const schema = Joi.object({
        username: Joi.string().min(5).required(),
        email: Joi.string().email().required(),
        password: Joi.string().password().required(), 

    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message});
    }

    next();
};

//Contoh route dengan validasi menggunakan express-validator
app.post('/user', validateInput, (req, res) => {
    const errors = validationResults(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array()[0].ms });
    }

    // pemrosesan data user
    res.json({ message: 'Data user valid '});
});

//Contoh route dengan validasi menggunakan joi
app.post('/user-joi', validateInputJoi , (req, res) => {
    // Pemrosesan data user
    res.json({ message: 'Data user valid' });
});

app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});