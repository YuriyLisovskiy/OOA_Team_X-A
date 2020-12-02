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

	// returns:
	//  {
	//    "count": <int (total pages quantity)>,
	//    "next": <string (link to load next page)>,
	//    "previous": <string (link to load previous page)>,
	//    "results": [
	//      {
	//        "id": <int>,
	//        "text": <string>,
	//        "points": <int>,
	//        "up_voted": <bool>,
	//        "down_voted": <bool>,
	//        "author": {
	//          "id": <int>,
	//          "username": <string>,
	//          "avatar": <string (full link)>
	//        },
	//        "creation_date": <string>,
	//        "creation_time": <string>
	//        "can_vote": <bool>,
	//        "can_be_deleted": <bool>
	//      },
	//      ...
	//    ]
	//  }
	getComments = (artworkId, handler) => {
		this._getList(artworkId, false, handler);
	}

	// returns:
	//  {
	//    "count": <int (total pages quantity)>,
	//    "next": <string (link to load next page)>,
	//    "previous": <string (link to load previous page)>,
	//    "results": [
	//      {
	//        "id": <int>,
	//        "text": <string>,
	//        "points": <int>,
	//        "up_voted": <bool>,
	//        "down_voted": <bool>,
	//        "author": {
	//          "id": <int>,
	//          "username": <string>,
	//          "avatar": <string (full link)>
	//        },
	//        "creation_date": <string>,
	//        "creation_time": <string>,
	//        "can_vote": <bool>,
	//        "can_be_deleted": <bool>
	//      },
	//      ...
	//    ]
	//  }
	getAnswers = (commandId, handler) => {
		this._getList(commandId, true, handler);
	}

	// returns:
	//  {
	//    "id": <int>,
	//    "text": <string>,
	//    "points": <int>,
	//    "up_voted": <bool>,
	//    "down_voted": <bool>,
	//    "author": {
	//      "id": <int>,
	//      "username": <string>,
	//      "avatar": <string (full link)>
	//    },
	//    "creation_date": <string>,
	//    "creation_time": <string>,
	//    "answers": <array of primary keys of answers>
	//  }
	getComment = (id, handler) => {
		this.get({
			url: this._URL_COMMENTS + '/' + id.toString(),
		}, handler);
	}

	// returns:
	//  {
	//    "id": <int>,
	//    "author_details": {
	//      "id": <int>,
	//      "username": <string>,
	//      "avatar": <string (full link)>
	//    }
	//  }
	createComment = (id, text, handler) => {
		this.post({
			url: this._URL_ARTWORKS + '/' + id.toString() + '/comments/create',
			data: {
				text: text
			}
		}, handler);
	}

	// returns:
	// {}
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

	// returns:
	// {}
	deleteComment = (id, handler) => {
		this.delete_({
			url: this._URL_COMMENTS + '/' + id.toString() + '/delete'
		}, handler);
	}

	// returns:
	//  {
	//    "id": <int>,
	//    "author_details": {
	//      "id": <int>,
	//  	"username": <string>,
	//  	"avatar": <string (full link)>
	//    }
	//  }
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

	upVoteComment = (id, handler) => {
		this.voteForComment(id, 1, handler);
	}

	downVoteComment = (id, handler) => {
		this.voteForComment(id, -1, handler);
	}

	// returns:
	//  {
	//    "points": <int>
	//  }
	voteForComment = (id, mark, handler) => {
		this.put({
			url: this._URL_COMMENTS + '/' + id.toString() + '/vote',
			data: {
				mark: mark
			}
		}, handler);
	}

	// returns:
	//  {
	//    "points": <int>
	//  }
	cancelVoteForComment = (id, handler) => {
		this.put({
			url: this._URL_COMMENTS + '/' + id.toString() + '/vote/cancel',
		}, handler);
	}
}

export default new CommentService();
