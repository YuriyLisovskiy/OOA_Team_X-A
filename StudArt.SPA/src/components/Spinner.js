import React, {Component} from "react";

export default class SpinnerComponent extends Component {

	render() {
		return <div className="row mb-2">
			<div className="col-md-12 text-center">
				<div className="spinner-grow text-secondary"/>
			</div>
		</div>;
	}
}
