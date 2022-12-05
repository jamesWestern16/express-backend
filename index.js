// Variables

const sqlite3 = require('promised-sqlite3');
const express = require('express')
const app = express()
app.use(express.json())
const port = 3000
const db = new sqlite3.PromisedDatabase();

// Functions

async function setup() {
  await db.open("./scores.db");
  await db.run('CREATE TABLE IF NOT EXISTS scores(id INTEGER PRIMARY KEY, player_name TEXT, score INTEGER)');
}

async function insertScore(score, name) {
    return await db.run('INSERT INTO scores (player_name,score) VALUES(?,?)', [name, score]);
}

async function getScores(options = {}) {
  let sql = `
  SELECT id ID, player_name NAME, score SCORE
  FROM scores
  `
  if (options.order) {
    sql = `${sql} ORDER BY score ${options.order}`
  }
  if (options.limit) {
    sql = `${sql} LIMIT ${options.limit}`
  }
  return await db.all(sql, []);
};

async function deleteScores() {
  // deleteSelection = 1; 
  let sql = `
  DELETE FROM scores
  WHERE id = "1"
  `
};

// Operations

app.get('/scores', async (req, res) => {
  try {
    const builtOptions = {
      limit: req.query.limit ?? 10,
      order: req.query.order ?? "DESC"
    }
    const scores = await getScores(builtOptions);
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
  try {
    const scores = await insertScore(req.body.scores, req.body.player_name);
    res.send('stored')
  } catch(error) {
    console.log(error);
    res.status(500);
    res.send("Failed to save scores")
  }
})

app.delete('/scores', async (req, res) => {
  await deleteScores();
  res.send("Deleted")
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

setup();
