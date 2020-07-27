require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const Person = require('./models/person.js')

app.use(express.static('build'))
app.use(cors())
app.use(express.json())

morgan.token('message', function getMessage (req) {
    return req.message
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :message'))

/*
if (process.argv.length<3) {
    console.log("give password as an argument");
    process.exit(1)
    
}

const password = process.argv[2]

const url = `mongodb+srv://haidar:${password}@cluster0.bnvza.mongodb.net/persons?retryWrites=true&w=majority`

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})



const Person = mongoose.model('Person', personSchema)

const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
})

if (person.name === undefined && person.number === undefined) {
    Person.find({}).then(response => {
        response.forEach(note => {
            console.log(note);
            
        })
        mongoose.connection.close()
    })
} else {
    person.save().then(response => {
        console.log(`added ${person.name} number ${person.number} to phonebook`);
        mongoose.connection.close()
        
    })
}


*/


const amount = Person.length
const body =
`Phonebook has info for ${amount} people

${Date()}`

app.post('/api/persons', (req, res, next) => {
    const body = req.body
    
    console.log(body);
    body.id = Math.floor(Math.random() * 100) + 1
    //const exists = Person.find({name: body.name})
    
    //console.log("Does this exist? ", exists);
    
    const person = new Person({
        name: body.name,
        number: body.number,
        id: body.id
    })
    
    if (person.name == "" || person.number == "") {

        res.status(400).json({
            error: 'content missing'
        })

    }
    /*else if (exists) {
        res.status(400).json({
            error: 'name already exists'
        })
    
    }*/ else {
        req.message = JSON.stringify(person)
        person.save().then(savedPerson => {
            res.json(savedPerson)
    }).catch(error => next(error)
    )}
    
    })
 


app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons)
    })
})

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id)
    .then(person => {
        if (person) {
            res.json(person)
        } else {
            res.status(404).end()
        }
    })
    .catch(error => next(error))
})
  

app.delete('/api/persons/:id', (req, res) => {
    const deleteid = req.params.id
    console.log(deleteid);
    
    persons = Person.findByIdAndRemove(deleteid)
    .then(result => {
        res.status(204).end()
    }).catch(error => next(error))

   
})

app.put('/api/persons/:id', (req, res, next) => {
    const body = req.body
    console.log("sup");
    
    const person = {
        name: body.name,
        number: body.number,
        id: body.id
    }
    console.log(person);
    
    console.log("parameter id is ", req.params.id);
    
    Person.findByIdAndUpdate(req.params.id, person, {new: true})
    .then(updatedPerson => {
        res.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.get('/info', (req, res) => {
    
    res.send(body)
})

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' })
  }

app.use(unknownEndpoint)


const errorHandler = (error, req, res, next) => {
    //console.error(error.name)

    
  
    if (error.name === 'CastError') {
      return res.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return res.status(400).json({error: error.message})
    } else if (error.name === 'MongoError') {
        return res.status(400).json({error: 'This name already exists'})
    }
  
    next(error)
  }

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log("Server running on port", PORT);
    
})