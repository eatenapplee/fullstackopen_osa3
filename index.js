require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person.js')

app.use(express.static('build'))
app.use(cors())
app.use(express.json())

morgan.token('message', function getMessage (req) {
  return req.message
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :message'))

const amount = Person.length
const body =
`Phonebook has info for ${amount} people

${Date()}`

app.post('/api/persons', (req, res, next) => {
  const body = req.body

  console.log(body)
  body.id = Math.floor(Math.random() * 100) + 1

  const person = new Person({
    name: body.name,
    number: body.number,
    id: body.id
  })

  if (person.name === '' || person.number === '') {

    res.status(400).json({
      error: 'content missing'
    })

  }
  else {
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


app.delete('/api/persons/:id', (req, res, next) => {
  const deleteid = req.params.id
  console.log(deleteid)

  Person.findByIdAndRemove(deleteid)
    .then(result => {
      res.status(204).end()
    }).catch(error => next(error))


})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body
  console.log('sup')

  const person = {
    name: body.name,
    number: body.number,
    id: body.id
  }
  console.log(person)

  console.log('parameter id is ', req.params.id)

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
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
    return res.status(400).json({ error: error.message })
  } else if (error.name === 'MongoError') {
    return res.status(400).json({ error: 'This name already exists' })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log('Server running on port', PORT)

})