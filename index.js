const { Command } = require('commander');
const express = require('express');

const program = new Command();
program
  .option('-h, --host <host>', 'Server host address', process.env.HOST || '127.0.0.1')
  .option('-p, --port <port>', 'Server port', process.env.PORT || 3000)
  .option('-c, --cache <cache>', 'Path to cache directory', process.env.CACHE || './cache');

program.parse(process.argv);

const options = program.opts();
const app = express();
app.use(express.json());

const notesDir = path.resolve(options.cache);
if (!fs.existsSync(notesDir)) {
    fs.mkdirSync(notesDir, { recursive: true });
}

app.get('/notes/:name', (req, res) => {
    const notePath = path.join(notesDir, req.params.name);
    if (!fs.existsSync(notePath)) {
        return res.status(404).send('Not found');
    }
    const noteContent = fs.readFileSync(notePath, 'utf8');
    res.send(noteContent);
});

app.put('/notes/:name', (req, res) => {
    const notePath = path.join(notesDir, req.params.name);
    if (!fs.existsSync(notePath)) {
        return res.status(404).send('Not found');
    }
    fs.writeFileSync(notePath, req.body.text, 'utf8');
    res.send('Note updated');
});

app.delete('/notes/:name', (req, res) => {
    const notePath = path.join(notesDir, req.params.name);
    if (!fs.existsSync(notePath)) {
        return res.status(404).send('Not found');
    }
    fs.unlinkSync(notePath);
    res.send('Note deleted');
});

app.get('/notes', (req, res) => {
    const notes = fs.readdirSync(notesDir).map((name) => ({
        name,
        text: fs.readFileSync(path.join(notesDir, name), 'utf8')
    }));
    res.json(notes);
});

app.post('/write', (req, res) => {
    const { note_name, note } = req.body;
    const notePath = path.join(notesDir, note_name);
    if (fs.existsSync(notePath)) {
        return res.status(400).send('Bad Request');
    }
    fs.writeFileSync(notePath, note, 'utf8');
    res.status(201).send('Created');
});

app.get('/UploadForm.html', (req, res) => {
    res.send(`
    <form action="/write" method="post" enctype="multipart/form-data">
      <input type="text" name="note_name" placeholder="Note name" required>
      <textarea name="note" placeholder="Note text" required></textarea>
      <button type="submit">Upload Note</button>
    </form>
  `);
});

app.listen(options.port, options.host, () => {
  console.log(`Server is running at http://${options.host}:${options.port}`);
});

//HOST = 127.0.0.1 PORT = 3000 CACHE =./ cache npm start стартует сервер 
