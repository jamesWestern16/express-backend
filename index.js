// const sqlite3 = require('sqlite3').verbose();
const sqlite3 = require('promised-sqlite3');
const express = require('express')
const app = express()
app.use(express.json()) 
const port = 3000
let topScores = [502, 102, 10, 11, 12, 15, 50]

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

// app.get('/bye', (req, res) => {
//     res.send('Goodbye World!')
//   })

// var db = new sqlite3.Database('./scores.db');
var db = new sqlite3.PromisedDatabase();
db.run('CREATE TABLE IF NOT EXISTS scores(id INTEGER PRIMARY KEY, player_name TEXT, score INTEGER)');

function insertScore(score, name) {
    db.serialize(()=>{
    db.run('INSERT INTO scores(player_name,score) VALUES(?,?)', [name, score], function(err) {
      if (err) {
        return console.log(err.message);
      }
      console.log("New score has been added");
      // res.send("New employee has been added into the database with ID = "+req.params.id+ " and Name = "+req.params.name);
    });
});}

async function getScores() {
  await db.open('./scores2.db')
  let scores = [];
    await db.serialize(()=>{
    db.all('SELECT id ID, player_name NAME, score SCORE FROM scores', [], function(err,rows){     
      if(err){
        res.send("Error encountered while displaying");
        return console.error(err.message);
      }
      console.log(rows);
      scores = rows


      // return rows
      // scores.push(row)
      // console.log(` ID: ${row.ID}, Name: ${row.NAME}, Score: ${row.SCORE}`);
      // console.log("Entry displayed successfully");
    // }, function() {
    //     console.log("Finished");
    //     return scores
    });
  });
  return scores;
};


app.get('/scores', async (req, res) => {
  const scores = await getScores();
  
  
  
  console.log(scores);
  res.send(scores)
})

app.post('/scores', (req, res) => {
    console.log(req.body.scores);
    // if (Array.isArray(req.body.scores)) {
    //   topScores = [...topScores, ...req.body.scores]  
    // } else {
    //     topScores.push (req.body.scores)
    // }
    insertScore(req.body.scores, req.body.player_name);
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
// console.log(typeof express);
// console.log(typeof app);
// function cat(name) {
//     return "your cat's name is" +name
// }

// console.log ("What is the name?")
// const result = cat("Billy")

// console.log(result);