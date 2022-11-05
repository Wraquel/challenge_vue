import axios from 'axios'

const token = "132456798_SAMPLE_TOKEN";
const api = axios.create(
    {
    baseURL:'https://challenge.pluralo.com',
     headers: { Authorization: `Bearer ${token}` },

})

export default api;