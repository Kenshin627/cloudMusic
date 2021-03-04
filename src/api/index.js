import axios from 'axios'

const Axios = axios.create({
    baseURL: 'http://localhost:3000/'
})
Axios.interceptors.request.use(
    config => {
        console.log(config)
        if(config.url !== '/login'){
            config.headers.Authorization = `Bearer ${localStorage.getItem('token') || ''}`
        }
        return config
    },
    err => {
        return Promise.reject(err)
    }
)

Axios.interceptors.response.use( 
    res => {
        return res;
    },  
    err => {
       console.log(err)
    }
)

export default Axios