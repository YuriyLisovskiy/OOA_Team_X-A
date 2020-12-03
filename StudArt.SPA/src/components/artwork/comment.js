import React, {Component} from "react";

import CommentService from "../../services/comment";
import {getErrorMessage} from "../utils";
import CommentInput from "./comment_input";
import "../../styles/common.css"
import {Link} from "react-router-dom";

export default class Comment extends Component {

	constructor(props) {
		super(props);
		this.state = {
			comment: this.props.data,
			showReplyInput: false,
			editing: false,
			newComment: undefined,
			newCommentError: undefined
		}
		this.wrapperEditCommentInputRef = React.createRef();
		this.wrapperSaveCommentButtonRef = React.createRef();
		this.wrapperAnswerInputRef = React.createRef();
	}

	componentDidMount() {
		document.addEventListener('mouseup', this.handleClickOutside);
		CommentService.getAnswers(this.props.data.id, (data, err) => {
			if (err) {
				// TODO:
				alert(getErrorMessage(err));
			}
			else {
				let comment = this.state.comment;
				comment.answers = data.results;
				this.setState({
					comment: comment,
					newComment: comment.text
				});
			}
		});
	}

	componentWillUnmount() {
		document.removeEventListener('mouseup', this.handleClickOutside);
	}

	_checkOutsideClick = (e, reference, newState, secondRef) => {
		if (reference && reference.current && !reference.current.contains(e.target)) {
			if (secondRef && secondRef.current.contains(e.target)) {
				return;
			}

			this.setState(newState);
		}
	}

	handleClickOutside = (e) => {
		this._checkOutsideClick(e, this.wrapperEditCommentInputRef, {
			editing: false,
			newComment: this.state.comment.text
		}, this.wrapperSaveCommentButtonRef);
		this._checkOutsideClick(e, this.wrapperAnswerInputRef, {
			showReplyInput: false
		});
	}

	handleVote = (upVote, method) => {
		method(this.state.comment.id, (data, err) => {
			if (err) {
				alert(getErrorMessage(err));
			}
			else {
				let comment = this.state.comment;
				comment.points = data.points;
				comment.up_voted = upVote;
				comment.down_voted = !upVote;
				this.setState({
					comment: comment
				});
			}
		});
	}

	handleUpVote = (e) => {
		this.handleVote(true, CommentService.upVoteComment);
	}

	handleDownVote = (e) => {
		this.handleVote(false, CommentService.downVoteComment);
	}

	handleCancelVote = (e) => {
		CommentService.cancelVoteForComment(this.state.comment.id, (data, err) => {
			if (err) {
				alert(getErrorMessage(err));
				console.log(err.response);
			}
			else {
				let comment = this.state.comment;
				comment.points = data.points;
				comment.up_voted = false;
				comment.down_voted = false;
				this.setState({
					comment: comment
				});
			}
		});
	}

	onAddComment = (answer) => {
		let comment = this.state.comment;
		comment.answers.splice(0, 0, answer);
		this.setState({
			comment: comment
		});
	}

	onDeleteComment = (answer) => {
		let comment = this.state.comment;
		comment.answers.splice(comment.answers.indexOf(answer), 1);
		this.setState({
			comment: comment
		});
	}

	handleDeleteComment = (e) => {
		CommentService.deleteComment(this.state.comment.id, (res, err) => {
			if (err) {
				// TODO:
				alert(getErrorMessage(err));
			}
			else {
				this.props.onDeleteComment(this.state.comment);
			}
		});
	}

	handleEditComment = (e) => {
		this.setState({
			editing: true
		});
	}

	handleSaveComment = (e) => {
		if (!this.state.newComment || this.state.newComment.length === 0) {
			this.setState({
				newCommentError: "Comment field must be filled."
			});
		}
		else if (this.state.comment.text === this.state.newComment) {
			this.setState({
				editing: false,
				newComment: this.state.comment.text
			});
		}
		else {
			CommentService.editComment(this.state.comment.id, this.state.newComment, (resp, err) => {
				if (err) {
					// TODO:
					alert(getErrorMessage(err));
				}
				else {
					let comment = this.state.comment;
					comment.text = this.state.newComment;
					this.setState({
						editing: false,
						comment: comment
					});
				}
			});
		}
	}

	handleCancelEditComment = (e) => {
		this.setState({
			editing: false,
			newComment: this.state.comment.text
		});
	}

	handleCommentChanged = (e) => {
		let text = e.target.value;
		this.setState({
			newComment: text.length > 0 ? text : undefined,
			newCommentError: undefined
		})
	}

	handleShowReply = (e) => {
		this.setState({
			showReplyInput: true
		});
	}

	render() {
		let discussion = this.state.comment;
		let paddingLeft = this.props.paddingLeft;
		return <div>
			{!discussion ? (
				<div className="row">
					<div className="col-md-12">
						<div className="spinner-grow text-secondary"/>
					</div>
				</div>
			) : (
				<div style={{paddingLeft: paddingLeft + "px"}} className="my-4 comment-border">
					<div className="row">
						<div className="mr-2">
							<div>
								{
									this.props.userExists && discussion.can_vote ? (
										<i className={"fa fa-chevron-up cursor-pointer" + (discussion.up_voted ? " text-success" : "")}
										   title="Up-vote"
										   onClick={!discussion.up_voted ? this.handleUpVote : this.handleCancelVote}
										   aria-hidden="true"/>
									) : (
										<i className="fa fa-chevron-up cursor-pointer text-secondary"
										   title="Unable to vote for your own comment or you are not authorized"
										   aria-hidden="true"/>
									)
								}
							</div>
						</div>
						<div className="d-inline">
							<Link to={'/profile/' + discussion.author.id} className="text-muted">
								{discussion.author.username + " "}
							</Link>
						</div>
						<small className="d-inline mx-1 text-muted mt-1">
							· {discussion.creation_date} at {discussion.creation_time + " "}
							{
								discussion.points > 0 &&
								<div className="d-inline">
									· [{discussion.points} point{discussion.points !== 1 && discussion.points !== -1 ? "s" : ""}]
								</div>
							}
							&nbsp;· <i className="fa fa-reply muted-btn btn-secondary-hover"
							           aria-hidden="true"
							           onClick={this.handleShowReply}/>
							{
								discussion.can_be_edited && (
									this.state.editing ? (
										<div className="d-inline">
											&nbsp;· <i className="fa fa-check-square-o muted-btn btn-success-hover"
											           aria-hidden="true"
											           title="Save"
											           ref={this.wrapperSaveCommentButtonRef}
											           onClick={this.handleSaveComment}/>
											<i className="fa fa-times-circle-o muted-btn btn-danger-hover ml-2"
											   aria-hidden="true"
											   title="Cancel"/>
										</div>
									) : (
										<div className="d-inline">
											&nbsp;· <i className="fa fa-pencil-square-o muted-btn btn-success-hover"
											           aria-hidden="true"
											           title="Edit"
											           onClick={this.handleEditComment}/>
										</div>
									)
								)
							}
							{
								!this.state.editing && discussion.can_be_deleted &&
								<div className="d-inline">
									&nbsp;· <i className="fa fa-trash muted-btn btn-danger-hover"
									           aria-hidden="true"
									           title="Remove"
									           onClick={this.handleDeleteComment}/>
								</div>
							}
						</small>
					</div>
					<div className="row">
						<div className="mr-2">
							<div>
								{
									this.props.userExists && discussion.can_vote ? (
										<i className={"fa fa-chevron-down cursor-pointer" + (discussion.down_voted ? " text-danger" : "")}
										   title="Down-vote"
										   onClick={!discussion.down_voted ? this.handleDownVote : this.handleCancelVote}
										   aria-hidden="true"/>
									) : (
										<i className="fa fa-chevron-down cursor-pointer text-secondary"
										   title="Unable to vote for your own comment or you are not authorized"
										   aria-hidden="true"/>
									)
								}
							</div>
						</div>
						{
							this.props.userExists && this.state.editing ? (
								<div className="form-group d-inline w-95" ref={this.wrapperEditCommentInputRef}>
									<input
										type="text"
										className="form-control"
										value={this.state.newComment}
										maxLength={500}
										onChange={this.handleCommentChanged}
										placeholder="Edit your comment..."
									/>
									{
										this.state.newCommentError && <small className="form-text text-danger ml-1 mt-1">
											{this.state.newCommentError}
										</small>
									}
								</div>
							) : (
								<div className="d-inline"
								     title="Click to reply to this comment"
								     onClick={this.handleShowReply}
								     style={{cursor: "pointer"}}>
									{discussion.text}
								</div>
							)
						}
					</div>
					{discussion.answers && discussion.answers.map(
						(answer) => <Comment key={answer.id}
						                     data={answer}
						                     userExists={this.props.userExists}
						                     parentId={answer.id}
						                     paddingLeft={paddingLeft + 10}
						                     onDeleteComment={this.onDeleteComment}/>
					)}
					{
						this.props.userExists &&
						<div ref={this.wrapperAnswerInputRef} className="mt-2">
							{
								this.state.showReplyInput &&
								<CommentInput isReply={true} onAddComment={this.onAddComment} parentId={discussion.id}/>
							}
						</div>
					}
				</div>
			)}
		</div>
	}
}
