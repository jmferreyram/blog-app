const app = require('../app')
const supertest = require('supertest')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')

const dummy = (blogs) => {
    if (blogs) {
        return 1
    } else {
        return 0
    }
}

const initialBlogs = [
    {
        title: "New title5",
        author: "New author4",
        url: "URL4",
        likes: 5,
        userName: 'user_name_1'
    },
    {
        title: "New title1",
        author: "New author1",
        url: "URL1",
        likes: 1,
        userName: 'user_name_2'
    },
    {
        title: "New title3",
        author: "New author3",
        url: "URL3",
        likes: 3,
        userName: 'user_name_3'
    }
]

const initialUsers = [
    {
        userName: "user_name_1",
        name: "name 1",
        password: "password1"
    },
    {
        userName: "user_name_2",
        name: "name2",
        password: "password2"    },
    {
        userName: "user_name_3",
        name: "name3",
        password: "password3"    }
]

const getAllBlogs = async () => {
    const response = await api.get('/api/blogs')
    return {
        titles: response.body.map(blog => blog.title),
        authors: response.body.map(blog => blog.author),
        urls: response.body.map(blog => blog.url),
        likes: response.body.map(blog => blog.likes),
        response: response
    }
}

const getAllUsers = async () => {
    // const usersDB = await User.find({})
    // return usersDB.map(user => user.toJSON())
    const response = await api.get('/api/users')
    return {
        userNames: response.body.map(user => user.userName),
        names: response.body.map(user => user.name),
        userIds: response.body.map(user => user.id),
        response: response
    }
}

module.exports = {
    dummy,
    api,
    initialBlogs,
    getAllBlogs,
    initialUsers,
    getAllUsers
}