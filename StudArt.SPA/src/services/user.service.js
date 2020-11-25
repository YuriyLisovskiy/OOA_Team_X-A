import axios from 'axios';
import {authHeader} from './common';

const API_URL = 'http://localhost:8000/api/v1/core/user';

class UserService {
	getUser = (id) => {
		return axios.get(API_URL + '/' + id.toString(), { headers: authHeader() });
	}

	// editSelf = (first_name, last_name) => {
	// 	return axios.put(API_URL + '/' + id.toString(), {
	// 		first_name: first_name,
	// 		last_name: last_name,
	// 	}, { headers: authHeader() });
	// }
}

export default new UserService();
