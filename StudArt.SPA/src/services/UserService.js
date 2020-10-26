import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8000/api/v1/core/user';

class UserService {
	getCurrentUser = () => {
		return axios.get(API_URL + '/current', { headers: authHeader() });
	}
}

export default new UserService();
