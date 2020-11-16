import React, {Component} from "react";

export default class TagBadge extends Component {
	render() {
		return <h5 className="d-inline">
			<span className={"badge badge-secondary " + this.props.className}>
			{this.props.text}&nbsp;&nbsp;<i className="fa fa-times-circle" aria-hidden="true"
			                     style={{cursor: "pointer"}}
			                     onClick={e => this.props.onClickRemove(e, this.props.text)}/>
		</span>
		</h5>
	}
}
