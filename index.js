const sqlite3 = require('promised-sqlite3');
const express = require('express')
const app = express()
app.use(express.json())
const port = 3000
let topScores = [502, 102, 10, 11, 12, 15, 50]

const db = new sqlite3.PromisedDatabase();

async function setup() {
  await db.open("./scores.db");
  await db.run('CREATE TABLE IF NOT EXISTS scores(id INTEGER PRIMARY KEY, player_name TEXT, score INTEGER)');
}

async function insertScore(score, name) {
    return await db.run('INSERT INTO scores (player_name,score) VALUES(?,?)', [name, score]);
}

async function getScores() {
    return await db.all('SELECT id ID, player_name NAME, score SCORE FROM scores', []);
};


app.get('/scores', async (req, res) => {
  try {
    const scores = await getScores();
    res.send(scores);
  } catch(error) {
    console.log(error);
    res.status(500);
    res.send("Failed to get scores");
  }
})

app.post('/scores', async (req, res) => {
    console.log(req.body.scores);
    // if (Array.isArray(req.body.scores)) {
    //   topScores = [...topScores, ...req.body.scores]
    // } else {
    //     topScores.push (req.body.scores)
    // }
    await insertScore(req.body.scores, req.body.player_name);
    res.send('stored')
  })

app.get('/top-scores', (req, res) => {
  console.log(topScores);
  const limit = req.query.limit ? req.query.limit : 5;
  console.log(limit);
  topScores.sort((a,b) => b - a)
  console.log(topScores);
  const slicedTopScores = topScores.slice(0, limit);
  console.log(slicedTopScores);
  res.send(slicedTopScores)
})

app.delete('/scores', (req, res) => {
  console.log(topScores);
  topScores = []
  res.send(topScores)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

setup();
