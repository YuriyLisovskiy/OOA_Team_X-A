import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8000/api/v1/artworks';

class ArtworkService {
	getArtworks = (page) => {
		let pageParam = '';
		if (page) {
			pageParam = '?page=' + page.toString();
		}

		return axios.get(API_URL + pageParam, { headers: authHeader() });
	}

	getArtwork = (id) => {
		return axios.get(API_URL + '/' + id.toString(), { headers: authHeader() });
	}

	vote = (id) => {
		return axios.put(API_URL + '/' + id.toString() + '/vote', {}, { headers: authHeader() });
	}

	createArtwork = (description, tags, images) => {
		// TODO: send creation request!
		console.log({
			description: description,
			tags: tags,
			images: images
		});
	}
}

export default new ArtworkService();
