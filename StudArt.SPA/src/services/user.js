import BaseService from "./base";

const API_URL = 'http://localhost:8000/api/v1/core/user';

class UserService extends BaseService {

	getUser = (id, handler) => {
		return this.get({url: API_URL + '/' + id.toString()}, handler);
	}
}

export default new UserService();
