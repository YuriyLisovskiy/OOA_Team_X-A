import React, {Component} from "react";

import CommentService from "../../services/comment";
import {getErrorMessage} from "../utils";
import CommentInput from "./comment_input";
import "../../styles/common.css"
import "../../styles/comment.css"
import {Link} from "react-router-dom";

export default class Comment extends Component {

	constructor(props) {
		super(props);
		this.state = {
			comment: this.props.data,
			showReplyInput: false
		}
		this.wrapperRef = React.createRef();
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
					comment: comment
				});
			}
		});
	}

	componentWillUnmount() {
		document.removeEventListener('mouseup', this.handleClickOutside);
	}

	handleClickOutside = (e) => {
		if (this.wrapperRef && this.wrapperRef.current && !this.wrapperRef.current.contains(e.target)) {
			this.setState({
				showReplyInput: false
			});
		}
	}

	handleVote = (upVote, method) => {
		method(this.props.data.id, (data, err) => {
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
		CommentService.cancelVoteForComment(this.props.id, (data, err) => {
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
									discussion.can_vote ? (
										<i className={"fa fa-chevron-up cursor-pointer" + (discussion.up_voted ? " text-success" : "")}
										   title="Up-vote"
										   onClick={!discussion.up_voted ? this.handleUpVote : this.handleCancelVote}
										   aria-hidden="true"/>
									) : (
										<i className="fa fa-chevron-up cursor-pointer text-secondary"
										   title="Unable to vote for your own comment"
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
							· [{discussion.points} point{discussion.points !== 1 && discussion.points !== -1 ? "s" : ""}]
							{
								discussion.can_be_deleted &&
								<div className="d-inline">
									&nbsp;· <i className="fa fa-trash delete-comment-btn"
									           aria-hidden="true"
									           onClick={this.handleDeleteComment}/>
								</div>
							}
						</small>
					</div>
					<div className="row">
						<div className="mr-2">
							<div>
								{
									discussion.can_vote ? (
										<i className={"fa fa-chevron-down cursor-pointer" + (discussion.down_voted ? " text-danger" : "")}
										   title="Down-vote"
										   onClick={!discussion.down_voted ? this.handleDownVote : this.handleCancelVote}
										   aria-hidden="true"/>
									) : (
										<i className="fa fa-chevron-down cursor-pointer text-secondary"
										   title="Unable to vote for your own comment"
										   aria-hidden="true"/>
									)
								}
							</div>
						</div>
						<div className="d-inline" onClick={this.handleShowReply} style={{cursor: "pointer"}}>
							{discussion.text}
						</div>
					</div>
					{discussion.answers && discussion.answers.map(
						(answer) => <Comment key={answer.id}
						                     data={answer}
						                     parentId={answer.id}
						                     paddingLeft={paddingLeft + 10}
						                     onDeleteComment={this.onDeleteComment}/>
					)}
					<div ref={this.wrapperRef} className="mt-2">
						{
							this.state.showReplyInput &&
							<CommentInput isReply={true} onAddComment={this.onAddComment} parentId={discussion.id}/>
						}
					</div>
				</div>
			)}
		</div>
	}
}
