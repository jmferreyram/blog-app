const bcrypt = require('bcrypt')
const { api, dummy, initialUsers, getAllUsers, initialBlogs} = require('./list_helper')
const User = require('../models/user')
const Blog = require('../models/blog')
const mongoose = require('mongoose')
const {server} = require('../index')


describe('creating a new', () => {
    beforeEach(async () => {
        await Blog.deleteMany({})
        await User.deleteMany({})
    
        for (const user of initialUsers){
            const userObject = new User(user)
            await userObject.save()
        }
    
        for (const blog of initialBlogs){
            const blogObject = new Blog(blog)
            await blogObject.save()
        }       
    })

    afterAll(() => {
        mongoose.disconnect()
        server.close()
    })

    test('works as expected creating a fresh username', async () => {
        
        const {userNames: usersAtStart} = await getAllUsers()
        console.log('THE USER NAMES FROM TEST ', usersAtStart)

        const newUser = {
            userName: 'juanmanuel',
            name: 'Juan Manuel',
            password: 'Tw1tch'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        
        const {userNames: usersAtEnd} = await getAllUsers()

        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

        expect(usersAtEnd).toContain(newUser.userName)

    })
})