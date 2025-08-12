const express = require('express')
const mongoose = require('mongoose')
const { MONGODB_URI } = require('./utils/config')

const app = express()

mongoose.connect(MONGODB_URI)

app.use(express.json())

const blogsRouter = require('./controllers/blogs')
app.use('/api/blogs', blogsRouter)

module.exports = app