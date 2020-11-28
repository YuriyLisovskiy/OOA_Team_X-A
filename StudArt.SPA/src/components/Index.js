import React, {Component} from "react";

import {Redirect} from "react-router";

export default class Index extends Component {

	render () {
		return (<Redirect to={"/artworks"}/>);
	}
}
