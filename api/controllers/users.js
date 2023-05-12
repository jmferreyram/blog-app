const usersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

usersRouter.post('/', async (request, response) => {
    const {body} = request
    const {userName, name, password} = body

    const userRepeat = await User.isThisUserNameUse(userName)

    if (!userRepeat) {
        return response.status(400).json({
            success: false,
            message: 'This userName is already in use, try another'
        })
    }

    const saltRound = 10
    const passwordHash = await bcrypt.hash(password, saltRound)

    const user = new User({
        userName,
        name,
        passwordHash
    })


    const savedUser = await user.save()

    response.status(201).json(savedUser)
})

usersRouter.get('/', async (request, response) => {
    const users = await User
        .find({})
        .populate('blogs', {title: 1, author: 1, likes: 1})
    response.json(users)
})

usersRouter.get('/:id', async (request, response, next) => {
    const user = await User.findById(request.params.id)

    try {
        if (user) {
            response.json(user)
        } else {
            response.status(404).end()
        }
    } catch(error) {
        next(error)
    }
})

usersRouter.delete('/:id', async (request, response, next) => {
    
    try {
        await User.findByIdAndDelete(request.params.id)
        response.status(204).end()
    } catch(error) {
        next(error)
    }
})

module.exports = usersRouter