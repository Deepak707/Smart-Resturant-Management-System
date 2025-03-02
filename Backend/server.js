const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const jsonServer = require('json-server');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// JSON Server Setup
const router = jsonServer.router(path.join(__dirname, 'menuItems.json'));
const middlewares = jsonServer.defaults();

app.use('/api', middlewares, router);

// Endpoint to get orders from menuItems.json
app.get('/api/orders', (req, res) => {
    const filePath = path.join(__dirname, 'menuItems.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).json({ error: "Error reading orders file" });
        } else {
            try {
                const orders = JSON.parse(data).orders;
                res.json(orders);
            } catch (parseError) {
                res.status(500).json({ error: "Error parsing orders data" });
            }
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`JSON Server is integrated at http://localhost:${PORT}/api`);
});

// Ensure JSON Server's database is properly initialized
router.db.assign(require('./menuItems.json')).write();
