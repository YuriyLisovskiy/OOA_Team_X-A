import BaseService from './base';

class ArtworkService extends BaseService {

	constructor() {
		super();
		this._URL_ARTWORKS = this._BASE_URL + '/artworks';
		this._URL_CREATE_ARTWORK = this._URL_ARTWORKS + '/create';
	}

	getArtworks = (page, columns, filterBySubscriptions, tags, authors, handler) => {
		let params = [];
		if (page) {
			params.push('page=' + page.toString());
		}

		if (columns) {
			params.push('columns=' + columns.toString());
		}

		if (filterBySubscriptions === true) {
			params.push('filter_by_subscriptions=true');
		}

		if (tags) {
			for (let i = 0; i < tags.length; i++) {
				params.push('tag=' + tags[i].toString());
			}
		}

		if (authors) {
			for (let i = 0; i < authors.length; i++) {
				params.push('author=' + authors[i].toString());
			}
		}

		let query = params.join('&');
		if (query.length > 0) {
			query = '?' + query;
		}

		this.get({url: this._URL_ARTWORKS + query}, handler);
	}

	getArtwork = (id, handler) => {
		this.get({url: this._URL_ARTWORKS + '/' + id.toString()}, handler);
	}

	createArtwork = (description, tags, images, handler) => {
		let formData = new FormData();
		formData.append('description', description);
		for (let i = 0; i < tags.length; i++) {
			formData.append('tags', tags[i].toString());
		}

		for (let i = 0; i < images.length; i++) {
			formData.append('images', images[i]);
		}

		this.post({
			url: this._URL_CREATE_ARTWORK,
			data: formData,
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		}, handler);
	}

	deleteArtwork = (id, handler) => {
		this.delete_({
			url: this._URL_ARTWORKS + '/' + id.toString() + '/delete'
		}, handler);
	}

	editArtwork = (id, description, tags, handler) => {
		let data = {};
		if (description) {
			data.description = description;
		}

		if (tags) {
			data.tags = tags;
		}

		this.put({
			url: this._URL_ARTWORKS + '/' + id.toString() + '/edit',
			data: data
		}, handler);
	}

	voteForArtwork = (id, mark, handler) => {
		this.put({
			url: this._URL_ARTWORKS + '/' + id.toString() + '/vote',
			data: {
				mark: mark
			}
		}, handler);
	}
}

export default new ArtworkService();
