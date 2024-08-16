import axios from 'axios';
const API_URL = 'https://shervn.com/api';

export default class PostService{

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

    getDetails(){
        return fetch("https://shervn.com/media/blog_details.txt").then(response => response.text()).then(t => t.split("\n"))
    }
}
