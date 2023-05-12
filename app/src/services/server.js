import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = (newToken) => {
    token = `Bearer ${newToken}`
}

const getAll = () => {
    return (
        axios.get(baseUrl)
        .then(promise => promise.data)
    );
}

const create = (newObject) => {

    const config = {
        headers:{
            Authorization: token
        }
    }
    console.log(config)
    return (
        axios.post(baseUrl, newObject, config)
        .then(promise => promise.data)
    )
}

const eliminateBlog = (id) => {
    const config = {
        headers:{
            Authorization: token
        }
    }
    return (
        axios.delete(`${baseUrl}/${id}`, config)
    )
}

const update = (id, newObject) => {
    const config = {
        headers:{
            Authorization: token
        }
    }
    return (
        axios.put(`${baseUrl}/${id}`,newObject, config)
        .then(promise => promise.data)
    )
}

const blogService = {
    getAll: getAll,
    create: create,
    eliminateBlog: eliminateBlog,
    update: update,
    setToken
}

export default blogService