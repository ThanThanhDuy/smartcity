import axios from 'axios'
import Qs from 'qs'
import localService from '../services/local'

const axiosClient = axios.create({
    baseURL: 'https://smartcity1-001-site1.htempurl.com/api/v1',
    headers: {
        'Content-Type': 'application/json'
    },
    paramsSerializer: {
        serialize: params => Qs.stringify(params, { arrayFormat: 'brackets' })
    }
})

axiosClient.interceptors.request.use(async config => {
    const accessToken = localService.getAccessToken()
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
})

axiosClient.interceptors.response.use(
    response => {
        if (response && response.data) {
            return response.data
        }
        return response
    },
    error => {
        throw error.response.data
    }
)
export default axiosClient
