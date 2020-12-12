import axios from "axios";
import EventObserver from "../utils/observer";

const USER_DATA_KEY = 'user_data';
const API_V1 = '/api/v1';

// `handler` receives `json` and `err` args.
export default class BaseService {

	static #RefreshTokenObserver = new EventObserver();

	constructor(useAuth = true) {
		this._useAuth = useAuth;
		this._BASE_URL = process.env.REACT_APP_API_URL_BASE + API_V1;
		this._USER_DATA_KEY = USER_DATA_KEY;
	}

	_authHeader = () => {
		const access = this._getAccessToken();
		if (access) {
			return {Authorization: 'Bearer ' + access};
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
		).catch(err => {
			if (handler) {
				handler(null, err);
			}
		});
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
			this._axiosRequest(method(params.url, params.config), handler);
		}
		else if (method === axios.delete) {
			this._axiosRequest(method(params.url, params.config), handler);
		}
		else {
			this._axiosRequest(method(params.url, params.data, params.config), handler);
		}
	}

	_tryToRefreshToken = (handler) => {
		let refresh = this._getRefreshToken();
		this._axiosRequest(axios.post(
			this._BASE_URL + '/auth/refresh',
			{
				refresh: refresh
			}
		), (data, err) => {
			if (err) {
				if (err.response && err.response.status === 401) {
					this._removeCurrentUserData();
				}

				handler(false);
			}
			else {
				this._setAccessToken(data.access);
				handler(true);
			}
		});
	}

	_ensureAuth (method, params, handler) {
		this._sendRequest(method, params, (data, err) => {
			if (err && err.response && err.response.status === 401) {
				if (BaseService.#RefreshTokenObserver.isLocked()) {
					BaseService.#RefreshTokenObserver.subscribe(
						_ => this._sendRequest(method, params, handler)
					);
				}
				else if (!this._getRefreshToken()) {
					this._removeCurrentUserData();
					handler(data, err);
				}
				else {
					BaseService.#RefreshTokenObserver.lock();
					this._setAccessToken(null);
					BaseService.#RefreshTokenObserver.subscribe(
						_ => this._sendRequest(method, params, handler)
					);
					this._tryToRefreshToken((isSuccess) => {
						if (!isSuccess) {
							this._setRefreshToken(null);
							window.location.reload();
						}
						else {
							BaseService.#RefreshTokenObserver.broadcast(null);
						}

						BaseService.#RefreshTokenObserver.unlock();
					});
				}
			}
			else if (handler) {
				handler(data, err);
			}
		});
	}

	_getCurrentUserData() {
		return JSON.parse(localStorage.getItem(this._USER_DATA_KEY));
	}

	_getTokens() {
		let data = this._getCurrentUserData();
		return data ? data.tokens : null;
	}

	_getAccessToken() {
		let tokens = this._getTokens();
		return tokens ? tokens.access : null;
	}

	_getRefreshToken() {
		let tokens = this._getTokens();
		return tokens ? tokens.refresh : null;
	}

	_setCurrentUserData(user, accessToken, refreshToken) {
		localStorage.setItem(this._USER_DATA_KEY, JSON.stringify({
			tokens: {
				access: accessToken,
				refresh: refreshToken
			},
			user: user
		}));
	}

	_removeCurrentUserData() {
		localStorage.removeItem(this._USER_DATA_KEY);
	}

	_setCurrentUser(user) {
		let data = this._getCurrentUserData();
		if (data) {
			this._setCurrentUserData(user, data.tokens.access, data.tokens.refresh);
			return true;
		}

		return false;
	}

	_setAccessToken(accessToken) {
		let data = this._getCurrentUserData();
		if (data) {
			this._setCurrentUserData(data.user, accessToken, data.tokens.refresh);
			return true;
		}

		return false;
	}

	_setRefreshToken = (refreshToken) => {
		let data = this._getCurrentUserData();
		if (data) {
			this._setCurrentUserData(data.user, data.tokens.access, refreshToken);
			return true;
		}

		return false;
	}

	getCurrentUser() {
		let data = this._getCurrentUserData();
		if (data && data.user) {
			return data.user;
		}

		return null;
	}

	request = (method, params, handler, forceAuth = false) => {
		if (!this._useAuth && !forceAuth) {
			this._sendRequest(method, params, handler);
		}
		else {
			this._ensureAuth(method, params, handler);
		}
	}

	get = (params, handler, forceAuth = false) => {
		this.request(axios.get, params, handler, forceAuth);
	}

	post = (params, handler, forceAuth = false) => {
		this.request(axios.post, params, handler, forceAuth);
	}

	put = (params, handler, forceAuth = false) => {
		this.request(axios.put, params, handler, forceAuth);
	}

	delete_ = (params, handler, forceAuth = false) => {
		this.request(axios.delete, params, handler, forceAuth);
	}
}
