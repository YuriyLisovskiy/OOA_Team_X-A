import BaseService from './base';

class CommentService extends BaseService {

	constructor() {
		super();
		this._URL_ARTWORKS = this._BASE_URL + '/artworks';
		this._URL_COMMENTS = this._URL_ARTWORKS + '/comments';
	}

	_getList = (parentId, answers, handler) => {
		let query = '';
		if (answers === true) {
			query = '?answers=' + true;
		}

		this.get({
			url: this._URL_ARTWORKS + '/' + parentId.toString() + '/comments' + query
		}, handler);
	}

	getComments = (artworkId, handler) => {
		this._getList(artworkId, false, handler);
	}

	getAnswers = (commandId, handler) => {
		this._getList(commandId, true, handler);
	}

	getComment = (id, handler) => {
		this.get({
			url: this._URL_COMMENTS + '/' + id.toString()
		}, handler);
	}

	createComment = (id, text, handler) => {
		this.post({
			url: this._URL_ARTWORKS + '/' + id.toString() + '/comments/create',
			data: {
				text: text
			}
		}, handler);
	}

	editComment = (id, text, handler) => {
		let data = {};
		if (text) {
			data.text = text;
		}

		this.put({
			url: this._URL_COMMENTS + '/' + id.toString() + '/edit',
			data: data
		}, handler);
	}

	deleteComment = (id, handler) => {
		this.delete_({
			url: this._URL_COMMENTS + '/' + id.toString() + '/delete'
		}, handler);
	}

	replyToComment = (parentId, text, handler) => {
		let data = {};
		if (text) {
			data.text = text;
		}

		this.post({
			url: this._URL_COMMENTS + '/' + parentId.toString() + '/reply',
			data: data
		}, handler);
	}

	voteForComment = (id, mark, handler) => {
		this.put({
			url: this._URL_COMMENTS + '/' + id.toString() + '/vote',
			data: {
				mark: mark
			}
		}, handler);
	}
}

export default new CommentService();
