import React, {Component} from "react";
import "../../styles/artwork/artwork.css"
import {Link} from "react-router-dom";
import Comment from "./comment";
import ArtworkService from "../../services/artwork";
import {getResponseMessage} from "../utils";
import CommentInput from "./comment_input";
import TagBadge from "../tag_badge";

export default class Artwork extends Component {

	constructor(props) {
		super(props);
		this.state = {
			post: undefined
		}
	}

	componentDidMount() {
		ArtworkService.getArtwork(this.props.match.params.id, (data, err) => {
			if (err) {
				alert(getResponseMessage(err));
			}
			else {
				this.setState({
					post: data
				});
			}
		});
	}

	handleVote = (id) => {
		return e => {
			// TODO: set mark from UI
			ArtworkService.voteForArtwork(id, 10, (data, err) => {
				if (err) {
					// TODO:
					console.log(err.response);
					alert(getResponseMessage(err));
				}
				else {
					let post = this.state.post;
					post.points = data.points;
					this.setState({
						post: post
					});
				}
			});
		}
	}

	handleAddComment = (commentId) => {
		let post = this.state.post;
		post.comments.push(commentId);
		this.setState({
			post: post
		});
	}

	render() {
		let post = this.state.post;
		return (
			<div>
				{!post ? (
					<div className="row">
						<div className="col-md-12 text-center">
							<div className="spinner-grow text-secondary"/>
						</div>
					</div>
				) : (
					<div className="bg-light p-3 rounded-lg artwork-details">
						<div className="row w-100 mx-1">
							<Link to={'/profile/' + post.author.id} className="float-left">
								<div className="text-muted profile-photo">
									<img src={post.author.avatar} alt="Avatar" className="avatar-picture mr-2"/>
									<span className="d-inline">{post.author.username}</span>
								</div>
							</Link>
							<div className="float-right text-muted mt-1">
								&nbsp;&nbsp;|&nbsp;&nbsp;
								<small>{post.creation_date} at {post.creation_time}</small>
							</div>
						</div>
						<div className="row mb-4 mt-3">
							<div className="col-md-12 text-center">
								<img src={post.image} alt="Artwork" className="rounded artwork-image"/>
							</div>
						</div>
						<div className="row mb-2">
							<div className="col-md-11">
								<div className="d-inline">
									{
										post.voted ? (
											<i role="button"
											   className={"select-none fa fa-lg fa-star" + (post.voted ? "" : "-o")}
											   aria-hidden="true" onClick={this.handleVote(post.id)}
											   data-voted={post.voted ? "voted" : ""}> {post.points}</i>
										) : (
											<div className="input-group input-group-sm mb-3">
												<select className="form-control" defaultValue={0} style={{maxWidth: 60}}>
													{
														Array.from(
															new Array(21),
															(x, i) => i - 10
														).map(i => <option key={i} value={i}>{i}</option>)
													}
												</select>
												<div className="input-group-append">
													<button className="btn btn btn-success" type="submit">Vote</button>
												</div>
											</div>
										)
									}
								</div>
								<a href="#comments" className="text-muted">
									<div className="d-inline ml-3 select-none">
										<i className="fa fa-comments fa-lg"
										   aria-hidden="true"/> {post.comments.length} Discussion{post.comments.length > 1 || post.comments.length === 0 ? 's' : ''}
									</div>
								</a>
							</div>
						</div>
						<div className="row">
							<div className="col-md-12 text-justify">
								{post.description}
							</div>
						</div>
						{
							post.tags.length > 0 && <div className="row mt-2">
								<div className="col-md-12">
									{post.tags.map((tag) =>
										<TagBadge className="mx-1" key={tag} text={tag} textOnly={true}/>
									)}
								</div>
							</div>
						}
						<div className="mt-4">
							<CommentInput isReply={false} onAddComment={this.handleAddComment} parentId={post.id}/>
						</div>
						<div className="row" id="comments">
							<div className="col-md-12">
								{post.comments.map((comment) => (
									<Comment key={comment} id={comment} parentId={comment} paddingLeft={20}/>
								))}
							</div>
						</div>
					</div>
				)}
			</div>
		);
	}
}
