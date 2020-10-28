import React, {Component} from "react";

export default class Management extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			message: ""
		};
	}

	render() {
		return (
			<div className="row">
				<div className="col-sm-4">
					<h1>This is management page!</h1>
				</div>
			</div>
		);
	}
}
