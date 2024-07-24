const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HTML Routes
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/assets/notes.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/assets/index.html'));
});

// API Routes
app.get('/api/notes', (req, res) => {
    fs.readFile('db/db.json', 'utf8', (err, data) => {
        if (err) throw err;
        res.json(JSON.parse(data));
    });
});

app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    newNote.id = uuidv4();
    
    fs.readFile('db/db.json', 'utf8', (err, data) => {
        if (err) throw err;
        const notes = JSON.parse(data);
        notes.push(newNote);
        
        fs.writeFile('db/db.json', JSON.stringify(notes, null, 2), (err) => {
            if (err) throw err;
            res.json(newNote);
        });
    });
});

app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;

    fs.readFile('db/db.json', 'utf8', (err, data) => {
        if (err) throw err;
        let notes = JSON.parse(data);
        notes = notes.filter(note => note.id !== noteId);
        
        fs.writeFile('db/db.json', JSON.stringify(notes, null, 2), (err) => {
            if (err) throw err;
            res.json({ message: 'Note deleted' });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
