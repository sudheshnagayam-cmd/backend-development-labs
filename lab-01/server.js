
const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Welcome to my Express Server');
});

app.get('/about', (req, res) => {
    res.json({
        name: 'Gayam Sudeshna',
        section: 'Gen AI - 2A'
    });
});

app.get('/time', (req, res) => {
    res.send('Current date and time: ' + new Date());
});

app.use((req, res) => {
    res.status(404).send('404 - Page Not Found');
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
    console.log('Express server running on port ' + PORT);
});


