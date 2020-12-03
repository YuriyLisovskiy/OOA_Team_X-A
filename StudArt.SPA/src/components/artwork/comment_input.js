import React, {Component} from "react";

import CommentService from "../../services/comment";
import {getErrorMessage} from "../utils";

export default class CommentInput extends Component {

	constructor(props) {
		super(props);
		this.state = {
			text: undefined,
			loading: false,
			textError: undefined
		}
		this._buttonText = this.props.isReply ? "Answer" : "Comment";
		this._inputPlaceholder = this.props.isReply ? "Add your answer" : "Write a comment";
		this._addComment = this.props.isReply ? CommentService.replyToComment : CommentService.createComment;
	}

	handleOnChange = () => {
		return e => {
			let text = e.target.value;
			this.setState({
				text: text.length > 0 ? text : undefined,
				textError: undefined
			});
		}
	}

	handleAddComment = (e) => {
		if (!this.state.text || this.state.text.length === 0) {
			this.setState({
				textError: "Comment field must be filled."
			});
		}
		else {
			this.setState({
				loading: true
			});
			this._addComment(this.props.parentId, this.state.text, (data, err) => {
				if (err) {
					// TODO:
					alert(getErrorMessage(err));
				}
				else {
					CommentService.getComment(data.id, (comment, er) => {
						if (er) {
							// TODO:
							alert(getErrorMessage(er));
						}
						else {
							this.props.onAddComment(comment);
						}
					});
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
				<div className="form-group">
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
					{
						this.state.textError && <small className="form-text text-danger ml-1 mt-1">
							{this.state.textError}
						</small>
					}
				</div>
			</div>
		</div>;
	}
}
