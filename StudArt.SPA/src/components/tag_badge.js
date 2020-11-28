import React, {Component} from "react";

export default class TagBadge extends Component {

	handleClick = (e) => {
		if (this.props.onClick) {
			this.props.onClick(e, this.props.text);
		}
	}

	render() {
		let badge;
		if (this.props.textOnly) {
			badge = <span className={"badge badge-secondary " + this.props.className}
			              style={{cursor: "pointer"}}
			              onClick={this.handleClick}>
				{this.props.text}
			</span>;
		}
		else {
			badge = <h5 className="d-inline" onClick={this.handleClick} style={{cursor: "pointer"}}>
			<span className={"badge badge-secondary " + this.props.className}>
			{this.props.text}&nbsp;&nbsp;<i className="fa fa-times-circle" aria-hidden="true"
			                                style={{cursor: "pointer"}}
			                                onClick={e => this.props.onClickRemove(e, this.props.text)}/>
		</span>
			</h5>
		}

		return badge;
	}
}
