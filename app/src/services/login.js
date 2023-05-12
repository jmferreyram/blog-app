import axios from 'axios'

const baseUrl = '/api/login'

const login = async credentials => {
    const { data } = await axios.post(baseUrl, credentials)
    return data
}

const loginService = {
    login
}

export default loginService