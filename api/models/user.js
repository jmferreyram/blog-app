const { Schema, model } = require('mongoose')
const logger = require('../utils/logger')

const userSchema = new Schema({
    userName: {
        type: String,
        unique: true
    },
    name: String,
    passwordHash: String,
    blogs: [{
        type: Schema.Types.ObjectId,
        ref: 'Blog'
    }]
})

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
      delete returnedObject.passwordHash
    }
})

userSchema.statics.isThisUserNameUse = async function(userName) {
    if (!userName) throw new Error('Invalid userName')
    console.log('THE USER NAME IS ', userName)
    try {
        const user = await this.findOne({userName: userName})
        console.log('El usuario que encuentra es ',user)
        if (user) {
            return false
        }
        return true
    } catch (error) {
        logger.error('error inside isThisUserNameUse method', error.message)
        return false
    }
}

const User = model('User', userSchema)

module.exports = User