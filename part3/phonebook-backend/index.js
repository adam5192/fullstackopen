const express = require('express')
const app = express()
const morgan = require('morgan')

const cors = require('cors')

app.use(cors())

app.use(express.json())
app.use(express.static('dist'))

morgan.token('body', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : ''
});
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

let phonebook = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(phonebook)
})

app.get('/info', (request, response) => {
    const now = new Date();
    const dateString = now.toString()
    response.write('<p>Phonebook has info for 2 people</p>')
    response.write(`${dateString}`)
    response.end()
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = phonebook.find(p => p.id === id)

    if (person) {
        response.json(person)
    } else response.status(404).end()
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    phonebook = phonebook.filter(p => p.id !== id)

    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    if (!body.name) {
        return response.status(400).json({
            error: 'name missing'
        })
    }
    const existingPerson = phonebook.find(p => p.name === body.name)
    if (existingPerson) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }
    if (!body.number) {
        return response.status(400).json({
            error: 'number missing'
        })
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number,
    }

    phonebook = phonebook.concat(person)
    console.log(person)
    response.json(person)
})

const generateId = () => {
    const maxId = phonebook.length > 0
        ? Math.max(...phonebook.map(p => Number(p.id)))
        : 0
    return String(maxId+1)
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})