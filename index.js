const express = require('express')
const app = express()
app.use(express.json()) 
const port = 3000
const topScores = [502]

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

// app.get('/bye', (req, res) => {
//     res.send('Goodbye World!')
//   })
  
app.get('/scores', (req, res) => {
  console.log(topScores);
  res.send(topScores)
})

app.post('/scores', (req, res) => {
    console.log(req.body.scores);
    topScores.push (req.body.scores)
    res.send('Goodbye World!')
  })

app.get('/top-scores', (req, res) => {
  res.send(req.body.scores)
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