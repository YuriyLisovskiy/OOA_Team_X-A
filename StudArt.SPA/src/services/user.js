import BaseService from "./base";

class UserService extends BaseService {

	constructor() {
		super();
		this._URL_USERS = this._BASE_URL + '/core/users';
		this._URL_SELF = this._URL_USERS + '/self';
	}

	getUser = (id, handler) => {
		return this.get({
			url: this._URL_USERS + '/' + id.toString()
		}, handler);
	}

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

	blockAuthor = (authorId, handler) => {
		this.put({
			url: this._URL_SELF + '/block/author',
			data: {
				'author_pk': authorId
			}
		}, handler);
	}

	unblockAuthor = (authorId, handler) => {
		this.put({
			url: this._URL_SELF + '/unblock/author',
			data: {
				'author_pk': authorId
			}
		}, handler);
	}

	subscribeToAuthor = (authorId, handler) => {
		this.put({
			url: this._URL_SELF + '/subscribe',
			data: {
				'author_pk': authorId
			}
		}, handler);
	}

	unsubscribeFromAuthor = (authorId, handler) => {
		this.put({
			url: this._URL_SELF + '/unsubscribe',
			data: {
				'author_pk': authorId
			}
		}, handler);
	}

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
