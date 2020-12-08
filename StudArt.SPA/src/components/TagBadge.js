import React, {Component} from "react";
import {getOrDefault} from "../utils/misc";

export default class TagBadgeComponent extends Component {

	constructor(props) {
		super(props);
		this._displayInline = getOrDefault(this.props.displayInline, true);
	}

	_onClick = (e) => {
		if (this.props.onClick) {
			this.props.onClick(e, this.props.text);
		}
	}

	render() {
		let badge;
		if (this.props.textOnly) {
			badge = <span className={"badge badge-secondary " + this.props.className}
			              style={this.props.onClick ? {cursor: "pointer"} : {}}
			              onClick={this._onClick}>
				{this.props.text}
			</span>;
			if (!this._displayInline) {
				badge = <div>{badge}</div>;
			}
		}
		else {
			badge = <h5 className={this._displayInline ? "d-inline" : ""}
			            onClick={this._onClick}
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
