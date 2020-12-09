import React, {Component} from "react";
import PropTypes from "prop-types";

export default class ImagePreviewComponent extends Component {

	constructor(props) {
		super(props);
		if (!props.onClick) {
			this.props.onClick = _ => {
			};
		}

		this.marginClass = "";
		if (props.number) {
			switch (props.number) {
				case 0:
					break;
				default:
					this.marginClass = "ml-2 ";
					break;
			}
		}

		this.borderStyle = {height: 80, cursor: "pointer"};
	}

	render() {
		return <div className="image-container">
			<img src={this.props.src}
			     className={"rounded my-1 " + this.marginClass + (
				     this.props.customClassName ? this.props.customClassName : ""
			     )} alt=""
			     style={this.borderStyle}
			     onClick={this.props.onClick}/>
			{
				this.props.isSelected &&
				<i className="fa fa-search image-text-top-right" aria-hidden="true"/>
			}
		</div>;
	}
}

ImagePreviewComponent.propTypes = {
	src: PropTypes.string
}
