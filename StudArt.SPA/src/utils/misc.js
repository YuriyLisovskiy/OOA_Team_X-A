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
	let clsName;
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

export const strIsEmpty = (str) => {
	return !str || str.length === 0;
}

export const emailIsValid = (email) => {
	return !strIsEmpty(email) && email.includes('@');
}

export const checkPassword = (password) => {
	if (!password || password.length < 8) {
		return 'Password must be at least 8 characters long.';
	}

	return undefined;
}

export const requiredFieldError = (field) => {
	if (strIsEmpty(field)) {
		return 'This field is required.';
	}

	return undefined;
}

export const roundFloat = (val, precision) => {
	precision = Math.max(precision, 1);
	let number = 1;
	while (precision > 0) {
		number *= 10;
		precision--;
	}

	return Math.round(val * number + Number.EPSILON) / number;
}
