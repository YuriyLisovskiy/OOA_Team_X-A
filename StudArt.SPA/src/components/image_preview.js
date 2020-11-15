import React, {Component} from "react";

export default class ImagePreview extends Component {
	constructor(props) {
		super(props);
		if (!props.onClick) {
			this.props.onClick = e => {
			};
		}
	}

	render() {
		return <img src={this.props.src}
		            className={"rounded m-2" + (this.props.customClassName ? this.props.customClassName : "")} alt=""
		            style={{height: 100, cursor: "pointer"}}
		            onClick={this.props.onClick}/>
	}
}
