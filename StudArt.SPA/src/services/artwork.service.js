import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8000/api/v1/artworks';

class ArtworkService {
	getArtworks = (page, columns) => {
		let pageParam = '';
		let columnsParam = '';
		let connector = '?';
		if (page) {
			pageParam = '?page=' + page.toString();
		}
		if(page&&columns)
		{
			connector='&';
		}
		if(columns)
		{
			columnsParam = 'columns=' + columns.toString();
		}
		return axios.get(API_URL + pageParam +connector+ columnsParam, { headers: authHeader() });
	}

	getArtwork = (id) => {
		return axios.get(API_URL + '/' + id.toString(), { headers: authHeader() });
	}

	vote = (id) => {
		return axios.put(API_URL + '/' + id.toString() + '/vote', {}, { headers: authHeader() });
	}
}

export default new ArtworkService();
