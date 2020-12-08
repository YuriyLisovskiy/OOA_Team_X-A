export const getResponseMessage = (r) => {
	return (r && r.response && r.response.message) || r.toString();
}

export const getMessage = (data) => {
	if (data.hasOwnProperty('message')) {
		return data.message;
	}

	return data.toString();
}

export const getErrorMessage = (err) => {
	return (
		err && err.response && (
			(
				err.response.data && err.response.data.detail
			) || err.response.data || err.response.message
		)
	) || err.toString();
}

export const getOrDefault = (val, default_) => {
	return val === null || val === undefined ? default_ : val;
}

export const getClassForTag = (idx, length) => {
	let clsName = '';
	switch (idx) {
		case 0:
			clsName = "mr-1";
			break;
		case length - 1:
			clsName = "ml-1";
			break;
		default:
			clsName = "mx-1";
			break;
	}

	return clsName;
}
