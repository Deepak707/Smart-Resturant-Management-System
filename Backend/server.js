const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Endpoint to get orders from menuItems.json
app.get('/api/orders', (req, res) => {
    const filePath = path.join(__dirname, 'menuItems.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).json({ error: "Error reading orders file" });
        } else {
            const orders = JSON.parse(data).orders;
            res.json(orders);
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
