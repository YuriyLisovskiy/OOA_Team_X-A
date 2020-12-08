import React, {Component} from "react";

import {Redirect} from "react-router";

export default class IndexComponent extends Component {

	render () {
		return <Redirect to={"/artworks"}/>;
	}
}
