import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1/auth';

class AuthService {

	register = (username, email, password) => {
		return axios.post(API_URL + '/register', {
			username,
			email,
			password,
		});
	};

	login = (username, password) => {
		return axios
			.post(API_URL + '/login', {
				username,
				password,
			})
			.then((response) => {
				if (response.data.token) {
					localStorage.setItem('userData', JSON.stringify(response.data));
				}

				return response.data;
			});
	};

	logout = () => {
		localStorage.removeItem('userData');
	};

	checkUserExistsBy = (data) => {
		let params = [];
		for (let p in data) {
			if (data.hasOwnProperty(p)) {
				params.push(encodeURIComponent(p) + "=" + encodeURIComponent(data[p]));
			}
		}

		return axios.get(API_URL + '/userExists?' + params.join("&"));
	}

	getCurrentUserData() {
		return JSON.parse(localStorage.getItem('userData'));
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
