require('dotenv').config();
const express = require('express');
const sequelize = require('./db');
const models = require('./models/models');
const cors = require('cors');
const router = require('./routes/index');
const errorHandler = require('./middleware/ErrorHandlingMiddleware');
const path = require('path');

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV === "production") {
    app.use(express.static('client/build'));
    app.get('/', (req, res) => res.sendFile(path.resolve('client', 'build', 'index.html')));
    app.get('/dashboard/companies', (req, res) => res.sendFile(path.resolve('client', 'build', 'index.html')));
    app.get('/dashboard/employees', (req, res) => res.sendFile(path.resolve('client', 'build', 'index.html')));
    app.get('/dashboard/orders', (req, res) => res.sendFile(path.resolve('client', 'build', 'index.html')));
    app.get('/dashboard/company_details/:id', (req, res) => res.sendFile(path.resolve('client', 'build', 'index.html')));
} else {
    app.use(express.static(path.resolve(__dirname, 'static')));
}

app.use('/api', router);
app.use(errorHandler);

const start = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
        
    } catch (error) {
        console.log(error)
    }
}

start();