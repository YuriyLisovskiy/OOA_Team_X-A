import React from "react";

export const required_field = value => {
	if (!value) {
		return (<div className="text-danger"><small>This field is required.</small></div>);
	}
};

export const getResponseMessage = (r) => {
	return (r && r.response && r.response.message) || r.toString();
}

export const getErrorMessage = (err) => {
	return (err && err.response && (err.response.data || err.response.message)) || err.toString();
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
