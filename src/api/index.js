import axios from 'axios'
// axios.defaults.withCredentials=true
const Axios = axios.create({
    baseURL: 'http://localhost:3000/'
})
//axios.defaults.withCredentials=true
// Axios.defaults.withCredentials = true
Axios.interceptors.request.use(
    config => {
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