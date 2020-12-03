import React, {Component} from "react";

export default class ImagePreview extends Component {
	constructor(props) {
		super(props);
		if (!props.onClick) {
			this.props.onClick = e => {
			};
		}

		this.marginClass = "";
		if (props.number) {
			switch (props.number) {
				case 0:
					break;
				default:
					this.marginClass = "ml-2";
					break;
			}
		}
	}

	render() {
		return <img src={this.props.src}
		            className={"rounded " + this.marginClass + (this.props.customClassName ? this.props.customClassName : "")} alt=""
		            style={{height: 100, cursor: "pointer"}}
		            onClick={this.props.onClick}/>
	}
}
