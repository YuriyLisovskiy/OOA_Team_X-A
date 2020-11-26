import axios from 'axios';

const USER_DATA_KEY = 'user_data';
const BASE_URL = 'http://localhost:8000/api/v1';

// `handler` receives `json` and `err` args.
export default class BaseService {

	constructor(useAuth = true) {
		this._useAuth = useAuth;
		this._BASE_URL = BASE_URL;
		this._USER_DATA_KEY = USER_DATA_KEY;
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

	_setAuth = (params) => {
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

		return params;
	}

	_sendRequest = (method, params, handler) => {
		params = this._setAuth(params);
		if (method === axios.get) {
			return this._axiosRequest(method(params.url, params.config), handler);
		}

		this._axiosRequest(method(params.url, params.data, params.config), handler);
	}

	_tryToAuth = (handler) => {
		// TODO: try to refresh JWT token!
		if (handler) {
			handler(null, {error: "401 Unauthorized"});
		}
	}

	_ensureAuth = (method, params, handler) => {
		this._sendRequest(method, params, (data, err) => {
			if (err.response.status === 401) {
				this._tryToAuth((data, err) => {
					if (!err) {
						this._sendRequest(method, params, handler);
					}
				});
			}
			else if (handler) {
				handler(data, err);
			}
		});
	}

	request = (method, params, handler) => {
		this._ensureAuth(method, params, handler);
	}

	get = (params, handler) => {
		this.request(axios.get, params, handler);
	}

	post = (params, handler) => {
		this.request(axios.post, params, handler);
	}

	put = (params, handler) => {
		this.request(axios.put, params, handler);
	}

	delete_ = (params, handler) => {
		this.request(axios.delete, params, handler);
	}
}
