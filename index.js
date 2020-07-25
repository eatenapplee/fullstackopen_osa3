const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(cors())
app.use(express.json())

morgan.token('message', function getMessage (req) {
    return req.message
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :message'))





var persons = [
    {
        name: "Arto Hellas",
        number: "040-123456",
        id: 1
    },
    {
        name: "Ada Lovelace",
        number: "040-123256",
        id: 2
    },
    {
        name: "Dan Abramov",
        number: "040-674557",
        id: 3
    },
    {
        name: "Tupac Shakur",
        number: "040-777777",
        id: 4
    }
]



const amount = persons.length
const body =
`Phonebook has info for ${amount} people

${Date()}`

app.post('/api/persons', (req, res) => {
    const person = req.body
    console.log(person);
    person.id = Math.floor(Math.random() * 100) + 1
    const exists = persons.find(p => p.name === person.name)
    
    
    if (person.name == "" || person.number == "") {

        res.status(400).json({
            error: 'content missing'
        })

    }
    else if (exists) {
        res.status(400).json({
            error: 'name already exists'
        })
    } else {
        req.message = JSON.stringify(person)

        res.status(200).json(req.message)
        
        persons = persons.concat(person)
    }
    
    
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id
    const person = persons.find(person => person.id == id)
    
    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id
    persons = persons.filter(person => person.id != id)

    res.status(204).end()
})

app.get('/info', (req, res) => {
    
    res.send(body)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log("Server running on port ", PORT);
    
})