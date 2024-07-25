const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('/api/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './db/db.json'));
});

app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    newNote.id = Date.now();
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('An error occurred while reading the file.');
            return;
        }
        const notes = JSON.parse(data);
        notes.push(newNote);
        fs.writeFile('./db/db.json', JSON.stringify(notes), (err) => {
            if (err) {
                console.error(err);
                res.status(500).send('An error occurred while writing the file.');
                return;
            }
            res.json(newNote);
        });
    });
});     

app.delete('/api/notes/:id', (req, res) => {
    const noteId = parseInt(req.params.id, 10);  // Ensure noteId is an integer
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send('An error occurred while reading the file.');
        return;
      }
      const notes = JSON.parse(data);
      const newNotes = notes.filter(note => note.id !== noteId);
      fs.writeFile('./db/db.json', JSON.stringify(newNotes), (err) => {
        if (err) {
          console.error(err);
          res.status(500).send('An error occurred while writing the file.');
          return;
        }
        res.send();
      });
    });
  });      

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});                     

app.listen(3001, () => console.log('Server listening on port 3001'));   

