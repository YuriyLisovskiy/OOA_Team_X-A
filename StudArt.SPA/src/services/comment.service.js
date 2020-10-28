import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8000/api/v1/artworks/comments';

class CommentService {
	getComments = (artworkId) => {
		return axios.get(API_URL + '?artwork_id=' + artworkId.toString(), { headers: authHeader() });
	}

	getComment = (id) => {
		return axios.get(API_URL + '/' + id.toString(), { headers: authHeader() });
	}

	vote = (id) => {
		return axios.put(API_URL + '/' + id.toString() + '/vote', {}, { headers: authHeader() });
	}
}

export default new CommentService();
