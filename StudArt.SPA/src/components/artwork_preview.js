import React, {Component} from "react";

import "../styles/artwork_preview.css"
import Artwork from "./artwork";
import {Link} from "react-router-dom";
import ArtworkService from "../services/artwork.service";
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
			ArtworkService.vote(id).then(
				resp => {
					this.setState({
						postVoting: {
							points: resp.data.points,
							isVoted: resp.data.is_voted
						}
					});
				},
				err => {
					// TODO:
					alert(getResponseMessage(err));
				}
			);
		}
	}

	render() {
		let post = this.props.post;
		let postVoting = this.state.postVoting;
		return (
			<div className="card artwork-card">
				{this.state.showModal && <Artwork id={post.id} onHide={() => {
					this.setState({
						showModal: false
					})
				}}/>}
				<Link to={'/artwork/' + post.id}>
					<img className="card-img-top" src={post.image} alt="Artwork"/>
				</Link>
				<div className="card-body">
					<div className="card-text pb-2">
						<span className="d-inline-block artwork-description">{post.description}</span>
						<small className="d-inline-block mb-2 read-more-btn">
							<Link to={'/artwork/' + post.id} className="text-muted">more</Link>
						</small>
					</div>
					<div className="d-inline">
						<i role="button" className={"select-none fa fa-lg fa-star" + (postVoting && postVoting.isVoted ? "" : "-o")}
						   aria-hidden="true" onClick={this.handleVote(post.id)}
						   data-voted={postVoting && postVoting.isVoted ? "voted" : ""}> {postVoting ? postVoting.points : 0}</i>
					</div>
					<Link to={'/artwork/' + post.id} className="text-muted">
						<div className="d-inline ml-3 select-none">
							<i className="fa fa-comments fa-lg"
							   aria-hidden="true"/> {post.discussions_ids.length} Discussion{post.discussions_ids.length > 1 ? 's' : ''}
						</div>
					</Link>
					<div className="card-text mt-3 pb-3 select-none">
						<Link to={'/profile/' + post.author.id} className="text-muted">
							<div className="float-left profile-photo">
								<img src={post.author.avatar} alt="Avatar" className="avatar-picture mr-2"/>
								<small className="underline-on-hover">{post.author.username}</small>
							</div>
						</Link>
						<small className="text-muted float-right">{post.creation_date} at {post.creation_time}</small>
					</div>
				</div>
			</div>
		);
	}
}
