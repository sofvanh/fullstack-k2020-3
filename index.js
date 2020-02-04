const express = require('express')
const app = express()

let persons = [
    {
        name: "Ada Lovelace",
        number: "39-44-5323523",
        id: 1
    },
    {
        name: "Alan Turing",
        number: "0400-121999",
        id: 2
    }
]

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})