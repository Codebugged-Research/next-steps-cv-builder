import axios from 'axios';
const api = axios.create({
    baseURL: 'https://cv.nextstepsusmle.com/api',
    withCredentials: true
})

export default api;