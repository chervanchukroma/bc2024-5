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

app.listen(options.port, options.host, () => {
  console.log(`Server is running at http://${options.host}:${options.port}`);
});

//HOST = 127.0.0.1 PORT = 3000 CACHE =./ cache npm start стартует сервер 
