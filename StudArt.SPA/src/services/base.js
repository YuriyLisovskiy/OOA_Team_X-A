import axios from 'axios';

export default class BaseService {

	constructor(useAuth = true) {
		this._useAuth = useAuth;
	}

	_authHeader = () => {
		const user = JSON.parse(localStorage.getItem('user_data'));

		console.log(user);

		if (user && user.token) {
			return { Authorization: 'JWT ' + user.token };
		}
		else {
			return {};
		}
	}

	_axiosRequest = (ax, handler) => {
		ax.then(
			resp => {
				if (handler) {
					handler(resp.data, null);
				}
			}
		).catch(
			err => {
				if (handler) {
					handler(null, err);
				}
			}
		);
	}

	request = (method, params, handler) => {
		if (this._useAuth) {
			let authHeader = this._authHeader();
			if (authHeader.Authorization) {
				if (!params.config) {
					params.config = {};
				}

				if (!params.config.headers) {
					params.config.headers = {};
				}

				params.config.headers.Authorization = authHeader.Authorization;
			}
		}

		if (method === axios.get) {
			return this._axiosRequest(method(params.url, params.config), handler);
		}

		return this._axiosRequest(method(params.url, params.data, params.config), handler);
	}

	get = (params, handler) => {
		return this.request(axios.get, params, handler);
	}

	post = (params, handler) => {
		return this.request(axios.post, params, handler);
	}

	put = (params, handler) => {
		return this.request(axios.put, params, handler);
	}

	delete_ = (params, handler) => {
		return this.request(axios.delete, params, handler);
	}
}
