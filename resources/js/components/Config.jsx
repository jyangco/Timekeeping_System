import axios from 'axios'
import Cookies from 'universal-cookie'

const cookies = new Cookies()

const http = axios.create({
    baseURL: '',
    withCredentials: true,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
    },
})

const getCsrfToken = async () => {
    try {
        await http.get('/sanctum/csrf-cookie')
    } catch (error) {
        console.error('Failed to set CSRF token', error)
    }
}

getCsrfToken()

http.interceptors.request.use(
    function (config) {
        const token = cookies.get('session_token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    function (error) {
        return Promise.reject(error)
    }
)

export default http