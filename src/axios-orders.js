import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://burger-app-inych.firebaseio.com/'
});

export default instance;