import BaseService from './base';

const API_URL = 'http://localhost:8000/api/v1/artworks';

class ArtworkService extends BaseService {

	getArtworks = (page, columns, handler) => {
		let pageParam = '';
		let columnsParam = '';
		let connector = '?';
		if (page) {
			pageParam = '?page=' + page.toString();
		}

		if (page && columns) {
			connector='&';
		}

		if (columns) {
			columnsParam = 'columns=' + columns.toString();
		}

		this.get({url: API_URL + pageParam + connector + columnsParam}, handler);
	}

	getArtwork = (id, handler) => {
		this.get({url: API_URL + '/' + id.toString()}, handler);
	}

	vote = (id, handler) => {
		this.put({url: API_URL + '/' + id.toString() + '/vote'}, handler);
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
