const jwt = require('jsonwebtoken')

module.exports = (request, response, next) => {

    let token = null
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer')) {
        token = authorization.substring(7) // es el 7mo caracter despues de bearer 4JHSKJDAHFNDFSDMFNALSJDA
    }

    let decodedToken = ''
  
    decodedToken = jwt.verify(token, process.env.SECRET)
  
    if (!token || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid'})
    }
  
    console.log(decodedToken)
    const { id : userId } = decodedToken

    console.log('El userId es igual a ',userId)
    request.userId = userId

    next()
}