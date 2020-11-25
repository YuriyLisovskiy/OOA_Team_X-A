export const authHeader = () => {
	const user = JSON.parse(localStorage.getItem('user_data'));

	console.log(user);

	if (user && user.token) {
		return { Authorization: 'JWT ' + user.token };
	}
	else {
		return {};
	}
}

export const axiosRequest = (ax, handler) => {
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
