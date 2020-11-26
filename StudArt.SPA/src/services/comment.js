import BaseService from './base';

const API_URL = 'http://localhost:8000/api/v1/artworks/comments';

class CommentService extends BaseService {
	getComments = (artworkId, handler) => {
		this.get({url: API_URL + '?artwork_id=' + artworkId.toString()}, handler);
	}

	getComment = (id, handler) => {
		this.get({url: API_URL + '/' + id.toString()}, handler);
	}

	vote = (id, handler) => {
		this.put({url: API_URL + '/' + id.toString() + '/vote'}, handler);
	}
}

export default new CommentService();
