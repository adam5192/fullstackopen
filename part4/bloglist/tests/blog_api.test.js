const { describe, test, beforeEach } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper') // expects blogsInDb()

let authToken

describe('adding blogs with token authentication', () => {
  beforeEach(async () => {
    // reset DB
    await Blog.deleteMany({})
    await User.deleteMany({})

    // create a user
    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', name: 'Root User', passwordHash })
    const savedUser = await user.save()

    // login to get token
    const loginRes = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    authToken = loginRes.body.token

    // seed one blog owned by this user (optional)
    await Blog.create({
      title: 'Seeded blog',
      author: 'Seeder',
      url: 'http://seed.example',
      likes: 1,
      user: savedUser._id
    })
  })

  test('succeeds with valid token', async () => {
    const start = await helper.blogsInDb()

    const newBlog = {
      title: 'Token-protected creation',
      author: 'Auth Author',
      url: 'http://token.example',
      likes: 7
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${authToken}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const end = await helper.blogsInDb()
    assert.strictEqual(end.length, start.length + 1)

    const titles = end.map(b => b.title)
    assert(titles.includes('Token-protected creation'))
  })

  test('fails with 401 if token is missing', async () => {
    const start = await helper.blogsInDb()

    const newBlog = {
      title: 'Should not be created',
      author: 'No Token',
      url: 'http://notoken.example',
      likes: 3
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)

    const end = await helper.blogsInDb()
    assert.strictEqual(end.length, start.length)
  })

  test('defaults likes to 0 if missing (with valid token)', async () => {
    const newBlog = {
      title: 'Defaults likes',
      author: 'Zero',
      url: 'http://zero.example'
      // no likes
    }

    const res = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${authToken}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(res.body.likes, 0)
  })

  test('fails with 400 if title or url missing (even with token)', async () => {
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ author: 'Missing both' })
      .expect(400)

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ title: 'Only title' })
      .expect(400)

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ url: 'http://only.url' })
      .expect(400)
  })
})
