import React, {Component} from "react";
import "../../styles/artwork/artwork.css"
import {Link} from "react-router-dom";
import Comment from "./comment";
import ArtworkService from "../../services/artwork";
import CommentService from "../../services/comment";
import {getErrorMessage, getResponseMessage} from "../utils";
import CommentInput from "./comment_input";
import TagBadge from "../tag_badge";

export default class Artwork extends Component {

	constructor(props) {
		super(props);
		this.state = {
			post: undefined,
			lastLoadedCommentsPage: undefined,
			selectedMark: 0
		}
	}

	componentDidMount() {
		ArtworkService.getArtwork(this.props.match.params.id, (post, err) => {
			if (err) {
				alert(getResponseMessage(err));
			}
			else {
				CommentService.getComments(post.id, (comments, er) => {
					if (er) {
						alert(getErrorMessage(er));
					}
					else {
						post.comments = comments.results;
						this.setState({
							post: post,
							lastLoadedCommentsPage: comments.next
						});
					}
				});
			}
		});
		window.addEventListener("scroll", this.handleScroll);
	}

	componentWillUnmount () {
		window.removeEventListener("scroll", this.handleScroll);
	}

	handleScroll = () => {
		if (this.state.lastLoadedCommentsPage) {
			const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
			const body = document.body;
			const html = document.documentElement;
			const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
			const windowBottom = windowHeight + window.pageYOffset;
			if (windowBottom >= docHeight - 1) {
				let pageLink = this.state.lastLoadedCommentsPage;
				this.setState({
					loading: true,
					lastLoadedCommentsPage: undefined
				});

				console.log(pageLink);

				CommentService.get(
					{url: pageLink},
					(page, err) => {
						if (err) {
							alert(getErrorMessage(err));
						}
						else {
							let post = this.state.post;
							post.comments = post.comments.concat(page.results);
							this.setState({
								loading: false,
								lastLoadedCommentsPage: page.next,
								post: post
							});
						}
					}
				);
			}
		}
	}

	handleMarkChanged = (e) => {
		this.setState({
			selectedMark: e.target.value
		});
	}

	handleVote = (e) => {
		ArtworkService.voteForArtwork(this.state.post.id, this.state.selectedMark, (data, err) => {
			if (err) {
				// TODO:
				alert(getErrorMessage(err));
			}
			else {
				let post = this.state.post;
				post.points = data.points;
				post.voted = true;
				this.setState({
					post: post
				});
			}
		});
	}

	handleAddComment = (comment) => {
		let post = this.state.post;
		post.comments.splice(0, 0, comment);
		this.setState({
			post: post
		});
	}

	onDeleteComment = (comment) => {
		let post = this.state.post;
		post.comments.splice(post.comments.indexOf(comment), 1);
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
										(!post.can_vote || post.voted) ? (
											<i role="button"
											   className="select-none fa fa-lg fa-star"
											   aria-hidden="true"
											   data-voted={post.voted ? "voted" : ""}> {post.points}</i>
										) : (
											<div className="input-group input-group-sm mb-3">
												<select className="form-control"
												        defaultValue={0}
												        style={{maxWidth: 60}}
												        onChange={this.handleMarkChanged}>
													{
														Array.from(
															new Array(21),
															(x, i) => i - 10
														).map(i => <option key={i} value={i}>{i}</option>)
													}
												</select>
												<div className="input-group-append">
													<button className="btn btn btn-success" type="submit"
													        onClick={this.handleVote}>
														Vote
													</button>
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
						{
							post.comments &&
							<div className="row" id="comments">
								<div className="col-md-12">
									{post.comments.map((comment) => (
										<Comment key={comment.id}
										         data={comment}
										         parentId={comment.id}
										         paddingLeft={20}
										         onDeleteComment={this.onDeleteComment}/>
									))}
								</div>
							</div>
						}
					</div>
				)}
			</div>
		);
	}
}
