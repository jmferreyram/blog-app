const jwt = require('jsonwebtoken')
const loginRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

loginRouter.post('/', async (request, response) => {
    const { body } = request
    const { userName, password } = body
    
    const user = await User.findOne({ userName })
    const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(password, user.passwordHash)
    console.log('El PASSWORD CHECK ES ',passwordCorrect)
    console.log((user && passwordCorrect))
    
    if (!(user && passwordCorrect)) {
        return(
            response.status(401).json({
            error: 'invalid user or password'
        })
        )
    }

    const userForToken = {
        id: user.id,
        userName: user.userName,
    }

    const token =jwt.sign(
        userForToken,
        process.env.SECRET,
        {
            expiresIn: 60 * 60 * 24 * 7
        })

    response.status(200).send({
        name: user.name,
        userName: user.userName,
        token
    })
})

module.exports = loginRouter