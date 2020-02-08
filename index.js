require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const mongoose = require('mongoose')
const Person = require('./models/person')

mongoose.set('useFindAndModify', false)

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
    Person.find({}).then(persons => {
        const amount = persons.length
        const time = new Date()
        res.send(
            `<p>Phonebook has info for ${amount} people</p>
        <p>${time}</p>
        `
        )
    })
})

app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons.map(person => person.toJSON()))
    })
})

app.get('/api/persons/:id', (req, res) => {
    Person.findById(req.params.id).then(person => {
        res.json(person.toJSON())
    })
})

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => next(error))
})

app.post('/api/persons', (req, res) => {
    const body = req.body

    if (!body.name || !body.number) {
        return res.status(400).json({
            error: 'information missing'
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
        res.json(savedPerson.toJSON())
    })

    /*
    if (persons.filter(p => p.name === body.name).length > 0) {
        return res.status(400).json({
            error: 'contact exists already'
        })
    }
    */
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