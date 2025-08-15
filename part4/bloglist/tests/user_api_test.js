const { test, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const api = supertest(app)

const User = require('../models/user')

beforeEach(async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', passwordHash })
  await user.save()
})

test('creation succeeds with a fresh username', async () => {
  const usersAtStart = await User.find({})

  const newUser = {
    username: 'newuser',
    name: 'New User',
    password: 'mypassword'
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const usersAtEnd = await User.find({})
  assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)
})

test('creation fails if username is taken', async () => {
  const newUser = {
    username: 'root',
    name: 'Superuser',
    password: 'secret'
  }

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)

  assert.match(result.body.error, /username must be unique/)
})

test('creation fails if username or password missing', async () => {
  const noPassword = { username: 'nopass', name: 'No Pass' }
  const noUsername = { password: 'nopass', name: 'No User' }

  await api.post('/api/users').send(noPassword).expect(400)
  await api.post('/api/users').send(noUsername).expect(400)
})

test('creation fails if username or password too short', async () => {
  const shortUsername = { username: 'ab', password: '1234', name: 'Too Short' }
  const shortPassword = { username: 'validname', password: '12', name: 'Too Short' }

  await api.post('/api/users').send(shortUsername).expect(400)
  await api.post('/api/users').send(shortPassword).expect(400)
})

after(async () => {
  await mongoose.connection.close()
})
