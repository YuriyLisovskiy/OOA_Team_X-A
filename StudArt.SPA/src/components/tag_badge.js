import React, {Component} from "react";
import {getOrDefault} from "./utils";

export default class TagBadge extends Component {

	constructor(props) {
		super(props);
		this._displayInline = getOrDefault(this.props.displayInline, true);
	}


	handleClick = (e) => {
		if (this.props.onClick) {
			this.props.onClick(e, this.props.text);
		}
	}

	render() {
		let badge;
		if (this.props.textOnly) {
			badge = <span className={"badge badge-secondary " + this.props.className}
			              style={this.props.onClick ? {cursor: "pointer"} : {}}
			              onClick={this.handleClick}>
				{this.props.text}
			</span>;
			if (!this._displayInline) {
				badge = <div>{badge}</div>;
			}
		}
		else {
			badge = <h5 className={this._displayInline ? "d-inline" : ""}
			            onClick={this.handleClick}
			            style={{cursor: "pointer"}}>
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
