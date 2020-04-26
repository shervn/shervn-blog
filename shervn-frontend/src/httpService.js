import axios from 'axios';
const API_URL = 'https://172.105.77.78/api';

export default class PostService{

    constructor(){}

    getPosts(type) {
        const url = `${API_URL}/${type}/`;
        return axios.post(url).then(response => response.data);
    }

    getPost(type, pk) {
        const url = `${API_URL}/${type}/${pk}`;
        return axios.post(url).then(response => response.data);
    }

    getPostsByURL(link){
        const url = `${API_URL}${link}`;
        return axios.post(url).then(response => response.data);
    }
}
