import BaseService from "./base";

const API_URL = 'http://localhost:8000/api/v1/auth';

const USER_DATA_KEY = "user_data";

// Urls
const URL_REGISTER = API_URL +    "/register";
const URL_LOGIN = API_URL +       "/login";
const URL_USER_EXISTS = API_URL + "/user/exists";

// `handler` receives `json` and `err` args.
class AuthService extends BaseService {

	constructor() {
		super(false);
	}

	register = (username, email, password, handler) => {
		this.post({url: URL_REGISTER, data: {
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
		this.post({url: URL_LOGIN, data: data}, (data, err) => {
			if (!err) {
				if (data.token) {
					localStorage.setItem(USER_DATA_KEY, JSON.stringify(data));
				}
			}

			handler(data, err);
		});
	};

	logout = () => {
		localStorage.removeItem(USER_DATA_KEY);
	};

	checkUserExistsBy = (data, handler) => {
		let params = [];
		for (let p in data) {
			if (data.hasOwnProperty(p)) {
				params.push(encodeURIComponent(p) + "=" + encodeURIComponent(data[p]));
			}
		}

		this.get({url: URL_USER_EXISTS + '?' + params.join("&")}, handler);
	}

	getCurrentUserData() {
		return JSON.parse(localStorage.getItem(USER_DATA_KEY));
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
