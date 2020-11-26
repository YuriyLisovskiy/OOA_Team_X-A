import React, {Component} from "react";

import "../styles/artwork_preview.css"
import {Link} from "react-router-dom";
import ArtworkService from "../services/artwork";
import {getResponseMessage} from "./utils";

export default class ArtworkPreview extends Component {

	constructor(props) {
		super(props);
		this.state = {
			postVoting: undefined
		}
	}

	handleVote = (id) => {
		return e => {
			// TODO: set mark from UI
			ArtworkService.vote(id, 10, (data, err) => {
				if (err) {
					// TODO:
					alert(getResponseMessage(err));
				}
				else {
					this.setState({
						postVoting: {
							points: data.points,
							isVoted: data.is_voted
						}
					});
				}
			});
		}
	}

	render() {
		let post = this.props.post;
		let postVoting = this.state.postVoting;
		if (!postVoting) {
			postVoting = {
				points: post.points,
				isVoted: post.voted
			}
		}

		return (
			<div className="card artwork-card mb-4">
				<Link to={'/artwork/' + post.id}>
					<img className="card-img img-fluid" src={post.image} alt="Artwork"/>
				</Link>
				<div className="card-body">
					<div className="card-text pb-2">
						<span className="d-inline-block artwork-description">{post.description}</span>
						<small className="d-inline-block mb-2 read-more-btn">
							<Link to={'/artwork/' + post.id} className="text-muted">more</Link>
						</small>
					</div>
					<div>
						{
							postVoting && postVoting.isVoted && <div className="d-inline">
								<span className="badge badge-success">
									<i className="fa fa-check-circle-o" aria-hidden="true"> Rated</i>
								</span>
							</div>
						}
						<Link to={'/artwork/' + post.id} className="text-muted d-inline">
							<div className={(postVoting && postVoting.isVoted ? "ml-3 " : "") + "d-inline select-none"}>
								<i className="fa fa-comments fa-lg"
								   aria-hidden="true"/> {post.discussions_ids.length} Discussion{post.discussions_ids.length > 1 || post.discussions_ids.length === 0 ? 's' : ''}
							</div>
						</Link>
					</div>
					<div className="card-text mt-3 pb-3 select-none">
						<Link to={'/profile/' + post.author.id} className="text-muted">
							<div className="float-left profile-photo">
								<img src={post.author.avatar} alt="Avatar" className="avatar-picture mr-2"/>
								<small className="underline-on-hover">{post.author.username}</small>
							</div>
						</Link>
						<small className="text-muted float-right mt-1">{post.creation_date} at {post.creation_time}</small>
					</div>
				</div>
			</div>
		);
	}
}
