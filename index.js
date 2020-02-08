require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const mongoose = require('mongoose')
const Person = require('./models/person')

morgan.token('json', function getJson(req) {
    return req.json
})

app.use(express.json())
app.use(express.static('build'))
app.use(assignJson)
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :json'))
app.use(cors())

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
    Person.find({}).then(persons => {
        res.json(persons.map(person => person.toJSON()))
    })
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

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(p => p.id !== id)

    res.status(204).end()
})

app.post('/api/persons', (req, res) => {
    const body = req.body

    if (!body.name || !body.number) {
        return res.status(400).json({
            error: 'information missing'
        })
    }

    if (persons.filter(p => p.name === body.name).length > 0) {
        return res.status(400).json({
            error: 'contact exists already'
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: Math.round(Math.random() * 10000)
    }

    persons = persons.concat(person)
    res.json(person)
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})

function assignJson(req, res, next) {
    if (req.method === "POST") {
        req.json = JSON.stringify(req.body)
    } else {
        req.json = ' '
    }
    next()
}