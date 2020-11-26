import React, {Component} from "react";

import CommentService from "../services/comment";
import {getResponseMessage} from "./utils";

export default class Discussion extends Component {

	constructor(props) {
		super(props);
		this.handleVote = this.handleVote.bind(this);
		this.state = {
			discussion: undefined
		}
	}

	componentDidMount() {
		CommentService.getComment(this.props.discussion_id, (data, err) => {
			if (err) {
				// TODO:
				alert(getResponseMessage(err));
			}
			else {
				console.log(data);
			}
		});
	}

	handleVote(id) {
		return e => {
			let updatedDiscussion = this.state.discussion;
			let newVoted = !updatedDiscussion.voted;
			updatedDiscussion.points = newVoted ? updatedDiscussion.points + 1 : updatedDiscussion.points - 1;
			updatedDiscussion.voted = newVoted;
			this.setState({
				discussion: updatedDiscussion
			});
		}
	}

	render() {
		let discussion = this.state.discussion;
		let paddingLeft = this.props.paddingLeft;
		return <div style={{paddingLeft: paddingLeft}} className={'mb-2' + (paddingLeft === 20 ? '' : ' comment-border')}>
			{!discussion ? (
				<div className="row">
					<div className="col-md-12">
						<div className="spinner-grow text-secondary"/>
					</div>
				</div>
			) : (
				<div>
					<div className="row">
						<div className="d-inline mr-2">
							<i role="button"
							   className={"select-none fa fa-lg fa-star" + (discussion.voted ? "" : "-o")}
							   aria-hidden="true" onClick={this.handleVote(discussion.id)}/>
							<div className="text-center">{discussion.points}</div>
						</div>
						<div className="d-inline">{discussion.text}</div>
					</div>
					{discussion.answers && discussion.answers.map(
						(answer) => <Discussion key={answer} discussion_id={answer} paddingLeft={paddingLeft + 20}/>
					)}
				</div>
			)}
		</div>
	}
}
