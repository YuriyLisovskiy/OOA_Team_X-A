import BaseService from "./base";

class AuthService extends BaseService {

	constructor() {
		super(false);
		this._URL_REGISTER = this._BASE_URL + '/auth/register';
		this._URL_LOGIN = this._BASE_URL + '/auth/login';
		this._URL_USER_EXISTS = this._BASE_URL + '/auth/user/exists';
	}

	register = (username, email, password, handler) => {
		this.post({url: this._URL_REGISTER, data: {
			username: username,
			email: email,
			password: password
		}}, handler);
	};

	login = (username, password, handler) => {
		let data = {
			username: username,
			password: password
		}
		this.post({url: this._URL_LOGIN, data: data}, (data, err) => {
			if (!err) {
				if (data.token) {
					localStorage.setItem(this._USER_DATA_KEY, JSON.stringify(data));
				}
			}

			handler(data, err);
		});
	};

	refresh = () => {

	}

	logout = () => {
		localStorage.removeItem(this._USER_DATA_KEY);
	};

	userExists = (data, handler) => {
		let params = [];
		for (let p in data) {
			if (data.hasOwnProperty(p)) {
				params.push(encodeURIComponent(p) + "=" + encodeURIComponent(data[p]));
			}
		}

		this.get({url: this._URL_USER_EXISTS + '?' + params.join("&")}, handler);
	}

	getCurrentUserData() {
		return JSON.parse(localStorage.getItem(this._USER_DATA_KEY));
	}

	getCurrentUser() {
		let data = this.getCurrentUserData();
		if (data != null) {
			return data.user;
		}

		return null;
	}
}

export default new AuthService();
