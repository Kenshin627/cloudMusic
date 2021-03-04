import Axios from '@/api/index.js'

//login
export function login(data) {
    return Axios({
        url: `/login?email=${data.email}&password=${data.password}`,
        method: 'get'
    })
}
