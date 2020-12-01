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
