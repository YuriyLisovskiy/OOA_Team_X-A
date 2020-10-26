import axios from 'axios';

const API_URL = 'http://localhost:8000/api/v1';

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
			.post(API_URL + '/auth', {
				username,
				password,
			})
			.then((response) => {
				if (response.data.token) {
					localStorage.setItem('user', JSON.stringify(response.data));
				}

				return response.data;
			});
	};

	logout = () => {
		localStorage.removeItem('user');
	};

	getCurrentUser() {
		return JSON.parse(localStorage.getItem('user'));
	}
}

export default new AuthService();
