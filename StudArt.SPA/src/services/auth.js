import BaseService from "./base";
import UserService from "./user"

class AuthService extends BaseService {

	constructor() {
		super(false);
		this._URL_REGISTER = this._BASE_URL + '/auth/register';
		this._URL_LOGIN = this._BASE_URL + '/auth/login';
		this._URL_USER_EXISTS = this._BASE_URL + '/auth/user/exists';
	}

	// returns:
	//  {
	//    "id": <int>,
	//    "username": <string>,
	//    "email": <string>,
	//    "first_name": <string>,
	//    "last_name": <string>,
	//    "avatar": <string (avatar full link)>,
	//    "is_superuser": <bool>,
	//    "rating": <float>,
	//    "token": <string (JWT token)>
	//  }
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
		this.post({url: this._URL_LOGIN, data: data}, (tokens, err) => {
			if (!err) {
				this._setCurrentUserData(null, tokens.access, tokens.refresh);
				UserService.getMe((user, err) => {
					if (err) {
						handler(null, err);
					}
					else {
						this._setCurrentUser(user);
						handler(null, null);
					}
				});
			}

			handler(null, err);
		});
	};

	logout = () => {
		this._removeCurrentUserData();
	};

	// returns:
	//  {
	//    "exists": <bool>,
	//    "message": <string>
	//  }
	userExists = (data, handler) => {
		let params = [];
		for (let p in data) {
			if (data.hasOwnProperty(p)) {
				params.push(encodeURIComponent(p) + "=" + encodeURIComponent(data[p]));
			}
		}

		this.get({url: this._URL_USER_EXISTS + '?' + params.join("&")}, handler);
	}
}

export default new AuthService();
