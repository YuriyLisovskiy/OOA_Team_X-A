import BaseService from './base';

class ArtworkService extends BaseService {

	constructor() {
		super();
		this._URL_ARTWORKS = this._BASE_URL + '/artworks';
		this._URL_CREATE_ARTWORK = this._URL_ARTWORKS + '/create';
	}

	// returns:
	//  {
	//    "count": <int (total pages quantity)>,
	//    "next": <string (link to load next page)>,
	//    "previous": <string (link to load previous page)>,
	//    "results": [
	//      {
	//        "id": <int>,
	//        "description": <string>,
	//        "tags": <array ont strings>,
	//        "points": <float>,
	//        "creation_date": <string>,
	//        "creation_time": <string>,
	//        "images": <array of full urls of images>,
	//        "author": <int (user pk)>,
	//        "voted": <bool (shows if current user voted ot not)>,
	//        "can_vote": <bool (shows if current user can vote this post)>,
	//        "comments_count": <int>
	//     },
	//     ...
	//    ]
	//  }
	getArtworks = (page, columns, filterBySubscriptions, tags, authors, handler) => {
		let params = [];
		if (page) {
			params.push('page=' + page.toString());
		}

		if (columns) {
			params.push('columns=' + columns.toString());
		}

		if (filterBySubscriptions === true) {
			let param = 'filter_by_subscriptions=true';
			params.push(param);
		}

		if (tags) {
			for (let i = 0; i < tags.length; i++) {
				let tagParam = 'tag=' + tags[i].toString();
				params.push(tagParam);
			}
		}

		if (authors) {
			for (let i = 0; i < authors.length; i++) {
				let authorParam = 'author=' + authors[i].toString();
				params.push(authorParam);
			}
		}

		let query = params.join('&');
		if (query.length > 0) {
			query = '?' + query;
		}

		this.get({url: this._URL_ARTWORKS + query}, handler);
	}

	// returns:
	//  {
	//    "id": <int>,
	//    "description": <string>,
	//    "tags": <array ont strings>,
	//    "points": <float>,
	//    "creation_date": <string>,
	//    "creation_time": <string>,
	//    "images": <array of full urls of images>,
	//    "author": <int (user pk)>,
	//    "voted": <bool (shows if current user voted ot not)>,
	//    "can_vote": <bool (shows if current user can vote this post)>,
	//    "comments": <array of primary keys of comments>
	//  }
	getArtwork = (id, handler) => {
		this.get({url: this._URL_ARTWORKS + '/' + id.toString()}, handler);
	}

	// returns:
	//  {
	//    "id": <int (pk of created artwork)>
	//  }
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

	// returns:
	// {}
	deleteArtwork = (id, handler) => {
		this.delete_({
			url: this._URL_ARTWORKS + '/' + id.toString() + '/delete'
		}, handler);
	}

	// returns:
	// {}
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

	// returns:
	//  {
	//    "points": <float>
	//  }
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
