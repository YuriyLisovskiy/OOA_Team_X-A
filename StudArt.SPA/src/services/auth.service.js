import axios from 'axios';
import {axiosRequest} from "./common";

const API_URL = 'http://localhost:8000/api/v1/auth';

const USER_DATA_KEY = "user_data";

// Urls
const URL_REGISTER = API_URL +    "/register";
const URL_LOGIN = API_URL +       "/login";
const URL_USER_EXISTS = API_URL + "/user/exists";

// `handler` receives `json` and `err` args.
class AuthService {

	register = (username, email, password, handler) => {
		let data = {
			username: username,
			email: email,
			password: password
		};
		axiosRequest(axios.post(URL_REGISTER, data), handler);
	};

	login = (username, password, handler) => {
		let data = {
			username: username,
			password: password
		}
		axiosRequest(axios.post(URL_LOGIN, data), (data, err) => {
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

		axiosRequest(axios.get(URL_USER_EXISTS + '?' + params.join("&")), handler);
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
