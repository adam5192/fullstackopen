require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const Person = require('./models/person')

app.use(express.json())
app.use(express.static('dist'))

morgan.token('body', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : ''
});
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(person => {
        response.json(person)
    })
})

app.get('/info', async (_req, res, next) => {
  try {
    const count = await Person.countDocuments({});
    res.send(
      `<p>Phonebook has info for ${count} people</p>
       <p>${new Date()}</p>`
    );
  } catch (err) {
    next(err);
  }
});

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (!person) return res.status(404).end();
      res.json(person); 
    })
    .catch(next); 
});


app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body
    if (!body.name) {
        return response.status(400).json({
            error: 'name missing'
        })
    }
    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body;

  if (name === undefined && number === undefined) {
    return res.status(400).json({ error: 'no fields to update' });
  }

  Person.findById(req.params.id)
    .then(person => {
      if (!person) return res.status(404).end();

      if (name !== undefined) person.name = name;
      if (number !== undefined) person.number = number;

      return person.save(); // runs schema validators
    })
    .then(updatedPerson => {
      if (updatedPerson) res.json(updatedPerson);
    })
    .catch(next);
});


const errorHandler = (error, req, res, next) => {
  console.error(error.name, error.message);

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' });
  }
  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message });
  }

  return res.status(500).json({ error: 'server error' });
};

app.use(errorHandler)

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})