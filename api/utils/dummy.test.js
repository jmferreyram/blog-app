
const { api, dummy, initialBlogs, getAllBlogs , initialUsers, getAllUsers} = require('./list_helper')
const Blog = require('../models/blog')
const User = require('../models/user')
const mongoose = require('mongoose')
const {server} = require('../index')

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

test('dummy returns 1', () => {
    const blogs = []

    const result = dummy(blogs)
    expect(result).toBe(1)
})


describe('Total Likes', () => {
    test('of empty list is zero', () => {
        
        const blogs = []
        expect(blogs).toEqual([])
    })
})

describe('Conexion Backend', () => {
    test('return json', async() => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })
    
    test('recuperar blogs total ok', async () => {
        const { titles } = await getAllBlogs()

        expect(titles).toHaveLength(initialBlogs.length)
    })

    test('Recover titles, author, urls', async () => {
        const { titles, urls, authors } = await getAllBlogs()

        expect(titles).toContain(initialBlogs[0].title)
        expect(titles).toContain(initialBlogs[initialBlogs.length-1].title)
        expect(authors).toContain(initialBlogs[0].author)
        expect(authors).toContain(initialBlogs[initialBlogs.length-1].author)
        expect(urls).toContain(initialBlogs[0].url)
        expect(urls).toContain(initialBlogs[initialBlogs.length-1].url)
    })

    test('Recover likes correctly', async () => {
        const { likes } = await getAllBlogs()
        const likes_initial = initialBlogs.map(blog => blog.likes)

        const sum_likes_initial = likes_initial.reduce((a,b) => a+b)
        const sum_likes_web = likes.reduce((a,b) => a+b)

        expect(sum_likes_web).toEqual(sum_likes_initial)
    })

    test('Post new blog', async () => {
        const {userIds} = await getAllUsers()

        const newBlog = {
            title: "nuevo_title",
            author: 'nuevo_author',
            url: 'nuevo_url',
            likes: 8,
            userId: userIds[0]
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
        
        const {titles} = await getAllBlogs()

        expect(titles).toContain(newBlog.title)
        expect(titles).toHaveLength(initialBlogs.length + 1)
    })

    test('Eliminate a blog', async () => {
        const { response } = await getAllBlogs()
    
        const id_eliminate = response.body[0].id
    
        await api
            .delete(`/api/blogs/${id_eliminate}`)
            .expect(204)
    
        const { titles } = await getAllBlogs()
        expect(titles).toHaveLength(response.body.length - 1)
    })

    test('Modify an author', async () => {
        const { response } = await getAllBlogs()
        
        const blogModified = response.body[0]
        const idModified = blogModified.id

        const newBlog = {...blogModified, title: 'Modified Title'}
        
        await api
            .put(`/api/blogs/${idModified}`)
            .send(newBlog)
        
        const {titles} = await getAllBlogs()

        expect(titles).not.toContain(initialBlogs[0].title)
        expect(titles).toContain(newBlog.title)
    })

    test('Send id incorrect', async() => {
        const { response } = await getAllBlogs()
        
        const blogModified = response.body[0]
        const idModified = blogModified.id

        const newBlog = {...blogModified, title: 'Modified Title'}

        await api
        .put(`/api/blogs/12312321312`)
        .send(newBlog)
        .expect(400)
    })

})
