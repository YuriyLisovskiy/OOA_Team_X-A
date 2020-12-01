import React, {Component} from "react";

import CommentService from "../../services/comment";
import {getErrorMessage} from "../utils";

export default class CommentInput extends Component {

	constructor(props) {
		super(props);
		this.state = {
			text: undefined,
			loading: false
		}
		this._buttonText = this.props.isReply ? "Answer" : "Comment";
		this._inputPlaceholder = this.props.isReply ? "Add your answer" : "Write a comment";
		this._addComment = this.props.isReply ? CommentService.replyToComment : CommentService.createComment;
	}

	handleOnChange = () => {
		return e => {
			let text = e.target.value;
			this.setState({
				text: text.length > 0 ? text : undefined
			});
		}
	}

	handleAddComment = (e) => {
		if (this.state.text) {
			this.setState({
				loading: true
			});
			this._addComment(this.props.parentId, this.state.text, (data, err) => {
				if (err) {
					// TODO:
					alert(getErrorMessage(err));
				}
				else {
					this.props.onAddComment(data.id);
				}

				this.setState({
					loading: false,
					text: undefined
				});
			});
		}
	}

	render() {
		return <div className="row">
			<div className="col-md-12">
				<div className="input-group">
					<input type="text" className="form-control" placeholder={this._inputPlaceholder + "..."}
					       value={this.state.text ? this.state.text : ""}
					       onChange={this.handleOnChange()}/>
					<div className="input-group-append">
						<button className="btn btn-success" type="button"
						        onClick={this.handleAddComment}
						        disabled={this.state.loading}>
							{this.state.loading &&
							<span className="spinner-border spinner-border-sm"/>} {this._buttonText}
						</button>
					</div>
				</div>
			</div>
		</div>;
	}
}
