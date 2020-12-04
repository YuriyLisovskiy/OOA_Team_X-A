import BaseService from "./base";

class UserService extends BaseService {

	constructor() {
		super();
		this._URL_USERS = this._BASE_URL + '/core/users';
		this._URL_SELF = this._URL_USERS + '/self';
	}

	// returns:
	//  {
	//    "id": <int>,
	//    "first_name": <string>,
	//    "last_name": <string>,
	//    "username": <string>,
	//    "email": <string>,
	//    "avatar_link": <string (full url)>,
	//    "is_superuser": <bool>,
	//    "rating": <float>
	//  }
	getUser = (id, handler) => {
		return this.get({
			url: this._URL_USERS + '/' + id.toString()
		}, handler);
	}

	// returns:
	//  {
	//    "id": <int>,
	//    "first_name": <string>,
	//    "last_name": <string>,
	//    "username": <string>,
	//    "email": <string>,
	//    "avatar_link": <string (full url)>,
	//    "is_superuser": <bool>,
	//    "rating": <float>
	//  }
	getMe = (handler) => {
		return this.get({url: this._URL_SELF}, handler);
	}

	// returns:
	//  {
	//    "avatar_link": <string> (full url)
	//  }
	editUser = (id, firstName, lastName, avatar, handler) => {
		let formData = new FormData();
		if (firstName) {
			formData.append('first_name', firstName);
		}

		if (lastName) {
			formData.append('last_name', lastName);
		}

		if (avatar) {
			formData.append('avatar', avatar);
		}

		this.put({
			url: this._URL_SELF + '/edit',
			data: formData,
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		}, handler);
	}

	// returns:
	// {}
	blockAuthor = (authorId, handler) => {
		this.put({
			url: this._URL_SELF + '/block/author',
			data: {
				'author_pk': authorId
			}
		}, handler);
	}

	// returns:
	// {}
	unblockAuthor = (authorId, handler) => {
		this.put({
			url: this._URL_SELF + '/unblock/author',
			data: {
				'author_pk': authorId
			}
		}, handler);
	}

	// returns:
	// {}
	subscribeToAuthor = (authorId, handler) => {
		this.put({
			url: this._URL_SELF + '/subscribe',
			data: {
				'author_pk': authorId
			}
		}, handler);
	}

	// returns:
	// {}
	unsubscribeFromAuthor = (authorId, handler) => {
		this.put({
			url: this._URL_SELF + '/unsubscribe',
			data: {
				'author_pk': authorId
			}
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
	//        "first_name": <string>,
	//        "last_name": <string>,
	//        "username": <string>,
	//        "email": <string>,
	//        "avatar_link": <string (full url)>,
	//        "is_superuser": <bool>,
	//        "rating": <float>
	//      },
	//      ...
	//    ]
	//  }
	getSubscriptions = (authorId, page, handler) => {
		let data = {};
		if (page) {
			data.page = page;
		}

		this.get({
			url: this._URL_USERS + '/' + authorId.toString() + '/subscriptions',
			data: data
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
	//        "first_name": <string>,
	//        "last_name": <string>,
	//        "username": <string>,
	//        "email": <string>,
	//        "avatar_link": <string (full url)>,
	//        "is_superuser": <bool>,
	//        "rating": <float>
	//      },
	//      ...
	//    ]
	//  }
	getBlacklist = (page, handler) => {
		let data = {};
		if (page) {
			data.page = page;
		}

		this.get({
			url: this._URL_SELF + '/blacklist',
			data: data
		}, handler);
	}

	// returns:
	//  [
	//    {
	//      "text": <string>
	//    },
	//    ...
	//  ]
	getMostUsedTagsForAuthor = (authorId, limit, handler) => {
		let data = {};
		if (limit) {
			data.limit = limit;
		}

		this.get({
			url: this._URL_USERS + '/' + authorId.toString() + '/tags/top',
			data: data
		}, handler);
	}
}

export default new UserService();
