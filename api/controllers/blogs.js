const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const logger = require('../utils/logger')
const userExtractor = require('../utils/user_extractor')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', {userName: 1, name: 1})
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response, next) => {
  const blog = await Blog.findById(request.params.id)
    
  try {  
    if (blog) {
      response.json(blog)
    } else {
      response.status(404).end()
    }
  } catch(error) {
    next(error)
  }
})

blogsRouter.post('/', userExtractor, async (request, response, next) => {
  const body = request.body

  const userId = request.userId
  console.log('El user Id del userExtractor es ',userId)

  try {
    const userNote = await User.findById(userId)
    console.log('El usuario encontrado es ', userNote)
    
    if (!userNote) {
      console.log('Entro en no encontrar el userNote - Error')
      return response.status(404).json({
        success: false,
        message: 'user not found'
      })
    }
  } catch(error) {
    logger.error('Error inside catch of blog post when finding if user exist ',error.message)
    return response.status(400).json({
      success: false,
      message: 'user not found'
    })
  }

  const userNote2 = await User.findById(userId)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: userNote2._id
  })

  try {
    console.log(blog)
    const savedBlog = await blog.save()
    userNote2.blogs = userNote2.blogs.concat(savedBlog._id)
    await userNote2.save()
    response.status(201).json(savedBlog)
  } catch (exception) {
    next(exception)
  }
})

blogsRouter.delete('/:id', userExtractor, async (request, response, next) => {

  try {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } catch(exception) {
    next(exception)
  }
})

blogsRouter.put('/:id', userExtractor, async (request, response, next) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    response.json(updatedBlog)
  } catch(exception) {
    next(exception)
  }
})

module.exports = blogsRouter