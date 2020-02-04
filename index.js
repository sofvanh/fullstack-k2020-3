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

app.get('/info', (req, res) => {
    const amount = persons.length
    const time = new Date()
    res.send(
        `<p>Phonebook has info for ${amount} people</p>
        <p>${time}</p>
        `
    )
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(p => p.id === id)

    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})