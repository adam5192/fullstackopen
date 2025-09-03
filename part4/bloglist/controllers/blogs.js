const router = require('express').Router()
const User = require('../models/user')
const Blog = require('../models/blog')
const jwt = require('jsonwebtoken')
const { userExtractor } = require('../utils/middleware')

router.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1} )
  response.json(blogs)
})

router.post('/', userExtractor, async (request, response) => {
  const user = request.user
  const body = request.body

  if (!body.likes) body.likes = 0

  if(!body.title || !body.url) {
    return response.status(400).json({ error: 'title or url missing'} )
  }

  
  const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user: user._id
  })

  const savedBlog = await blog.save()
  const populatedBlog = await savedBlog.populate('user', { username: 1, name: 1 })
  response.status(201).json(populatedBlog)
})

router.delete('/:id', userExtractor, async (request, response) => {
  const user = request.user

  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).json({ error: 'blog not found' })
  }

  if (blog.user.toString() !== user._id.toString()) {
    return response.status(401).json({ error: 'not authorized to delete this blog' })
  }

  await Blog.findByIdAndDelete(request.params.id)
  return response.status(204).end()
})

router.put('/:id', async (request, response, next) => {
 const { title, author, url, likes } = request.body

  const blog = await Blog.findById(request.params.id)
  if(!blog) {
    return response.status(404).end()
  }

  if (title !== undefined) blog.title = title
  if (author !== undefined) blog.author = author
  if (url !== undefined) blog.url = url
  if (likes !== undefined) blog.likes = likes

  const updatedBlog = await blog.save()
  response.json(blog)
})

module.exports = router