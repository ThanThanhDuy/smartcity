class LocalService {
    // token
    getAccessToken() {
        return localStorage.getItem('accessToken')
    }
    setAccessToken(value) {
        localStorage.setItem('accessToken', value)
    }
    removeAccessToken() {
        localStorage.removeItem('accessToken')
    }
}
const localService = new LocalService()
export default localService
