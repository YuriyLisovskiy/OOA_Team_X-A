import React, {Component} from "react";
import "../../styles/artwork/artwork.css"
import {Link} from "react-router-dom";
import AuthService from "../../services/auth";
import ArtworkService from "../../services/artwork";
import CommentService from "../../services/comment";
import {getErrorMessage} from "../../utils/misc";
import CommentInputComponent from "./CommentInput";
import TagBadgeComponent from "../TagBadge";
import ImagePreviewComponent from "./ImagePreview";
import NotFound from "../errors";
import CommentComponent from "./Comment";

export default class ArtworkComponent extends Component {

	constructor(props) {
		super(props);
		this.state = {
			post: undefined,
			lastLoadedCommentsPage: undefined,
			selectedMark: 0,
			selectedImage: undefined,
			editingDescription: false,
			newDescription: undefined,
			descriptionError: undefined,
			user: undefined,
			notFound: false
		}
	}

	componentDidMount() {
		ArtworkService.getArtwork(this.props.match.params.id, (post, err) => {
			if (err) {
				if (err.response && err.response.status === 404) {
					this.setState({
						notFound: true
					});
				}
				else {
					// TODO:
					alert(getErrorMessage(err));
				}
			}
			else {
				CommentService.getComments(post.id, (comments, er) => {
					if (er) {
						// TODO:
						alert(getErrorMessage(er));
					}
					else {
						post.comments = comments.results;
						this.setState({
							post: post,
							lastLoadedCommentsPage: comments.next,
							selectedImage: post.images[0],
							newDescription: post.description,
							user: AuthService.getCurrentUser(),
							notFound: false
						});
					}
				});
			}
		});
		window.addEventListener("scroll", this._onScroll);
	}

	componentWillUnmount () {
		window.removeEventListener("scroll", this._onScroll);
	}

	_onClickSelectImage = (e) => {
		if (this.state.selectedImage !== e.target.src) {
			this.setState({
				selectedImage: e.target.src
			});
		}
	}

	_onScroll = () => {
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
				CommentService.get(
					{url: pageLink},
					(page, err) => {
						if (err) {
							// TODO:
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

	_onClickStartEditDescription = (_) => {
		this.setState({
			editingDescription: true
		});
	}

	_onClickCancelEditDescription = (_) => {
		this.setState({
			editingDescription: false,
			newDescription: this.state.post.description
		});
	}

	_onClickSaveDescription = (_) => {
		if (!this.state.newDescription || this.state.newDescription.length === 0) {
			this.setState({
				descriptionError: "Description field must be filled."
			});
		}
		else {
			ArtworkService.editArtwork(this.state.post.id, this.state.newDescription, null, (resp, err) => {
				if (err) {
					// TODO:
					alert(getErrorMessage(err));
				}
				else {
					let post = this.state.post;
					post.description = this.state.newDescription;
					this.setState({
						editingDescription: false,
						post: post
					});
				}
			});
		}
	}

	_onClickDeletePost = (_) => {
		ArtworkService.deleteArtwork(this.state.post.id, (resp, err) => {
			if (err) {
				// TODO:
				alert(getErrorMessage(err));
			}
			else {
				this.props.history.push('/profile/' + this.state.user.id.toString());
			}
		});
	}

	_onChangeDescription = (e) => {
		let text = e.target.value;
		this.setState({
			newDescription: text.length > 0 ? text : undefined,
			descriptionError: undefined
		})
	}

	_onChangeMark = (e) => {
		this.setState({
			selectedMark: e.target.value
		});
	}

	_onClickVote = (_) => {
		ArtworkService.voteForArtwork(this.state.post.id, this.state.selectedMark, (data, err) => {
			if (err) {
				// TODO:
				alert(getErrorMessage(err));
			}
			else {
				let post = this.state.post;
				post.points = data.points;
				post.votes_count = data.votes_count;
				post.voted = true;
				this.setState({
					post: post
				});
			}
		});
	}

	_onClickAddComment = (comment) => {
		let post = this.state.post;
		post.comments.splice(0, 0, comment);
		post.can_be_edited = false;
		post.can_be_deleted = false;
		this.setState({
			post: post,

		});
	}

	_onClickDeleteComment = (comment) => {
		let post = this.state.post;
		post.comments.splice(post.comments.indexOf(comment), 1);
		this.setState({
			post: post
		});
	}

	render() {
		let post = this.state.post;
		return (
			this.state.notFound ? (<NotFound/>) : (
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
									<img src={this.state.selectedImage} alt="Artwork" className="rounded artwork-image"/>
								</div>
							</div>
							{
								this.state.post.images.length > 1 &&
								<div className="row mb-4">
									<div className="col-md-12 text-center">
										<div className="d-inline">
											{post.images.map((image, number) =>
												<div className="image-container">
													<ImagePreviewComponent key={image} src={image}
													              number={number}
													              onClick={this._onClickSelectImage}/>
													{
														image === this.state.selectedImage &&
														<i className="fa fa-search image-text-top-right" aria-hidden="true"/>
													}
												</div>

											)}
										</div>
									</div>
								</div>
							}
							<div className="row mb-2">
								<div className="col-md-11">
									{
										this.state.user &&
										<div className="d-inline">
											{
												(!post.can_vote || post.voted) ? (
													<i className="select-none fa fa-lg fa-star"
													   aria-hidden="true"
													   data-voted={post.voted ? "voted" : ""}> {post.points}</i>
												) : (
													<div className="input-group input-group-sm mb-3">
														<select className="form-control"
														        defaultValue={0}
														        style={{maxWidth: 60}}
														        onChange={this._onChangeMark}>
															{
																Array.from(
																	new Array(21),
																	(x, i) => i - 10
																).map(i => <option key={i} value={i}>{i}</option>)
															}
														</select>
														<div className="input-group-append">
															<button className="btn btn btn-success" type="submit"
															        onClick={this._onClickVote}>
																Vote
															</button>
														</div>
													</div>
												)
											}
										</div>
									}
									{
										post.votes_count > 0 &&
										<i className="select-none fa fa-users ml-3 text-muted"
										   aria-hidden="true"> {post.votes_count} voter{post.votes_count > 1 ? "s" : ""}</i>
									}
									<a href="#comments" className="text-muted">
										<div className="d-inline ml-3 select-none">
											<i className="fa fa-comments fa-lg"
											   aria-hidden="true"/> {post.comments.length} Discussion{post.comments.length > 1 || post.comments.length === 0 ? 's' : ''}
										</div>
									</a>
									<div className="d-inline ml-3">
										{
											this.state.post.can_be_edited && this.state.editingDescription &&
											<div className="d-inline">
												<i className="fa fa-check-square-o muted-btn btn-success-hover"
												   aria-hidden="true" onClick={this._onClickSaveDescription}> Save</i>
												<i className="fa fa-times muted-btn btn-danger-hover ml-3"
												   aria-hidden="true" onClick={this._onClickCancelEditDescription}> Cancel</i>
											</div>
										}
										{
											!this.state.editingDescription &&
											<div className="d-inline">
												{
													this.state.post.can_be_edited &&
													<i className="fa fa-pencil-square-o muted-btn btn-success-hover mr-2"
													   aria-hidden="true" onClick={this._onClickStartEditDescription}> Edit description</i>
												}
												{
													(this.state.post.can_be_deleted || (this.state.user && this.state.user.is_superuser)) &&
													<i className="fa fa-trash muted-btn btn-danger-hover ml-1"
													   aria-hidden="true" onClick={this._onClickDeletePost}> Delete post</i>
												}
											</div>
										}
									</div>
								</div>
							</div>
							<div className="row my-4">
								<div className="col-md-12">
									{
										this.state.user && this.state.editingDescription ? (
											<div className="form-group">
											<textarea
												rows={5}
												className="form-control"
												name="description"
												value={this.state.newDescription}
												onChange={this._onChangeDescription}
												placeholder="Type text..."
											/>
												{
													this.state.descriptionError && <small className="form-text text-danger ml-1 mt-1">
														{this.state.descriptionError}
													</small>
												}
											</div>
										) : (
											<div className="text-justify">{post.description}</div>
										)
									}
								</div>
							</div>
							{
								post.tags.length > 0 && <div className="row mt-2">
									<div className="col-md-12">
										{post.tags.map((tag) =>
											<TagBadgeComponent className="mx-1" key={tag} text={tag} textOnly={true}/>
										)}
									</div>
								</div>
							}
							{
								this.state.user &&
								<div className="mt-4">
									<CommentInputComponent isReply={false}
									                       onAddComment={this._onClickAddComment}
									                       parentId={post.id}/>
								</div>
							}
							{
								post.comments &&
								<div className="row" id="comments">
									<div className="col-md-12">
										{post.comments.map((comment) => (
											<CommentComponent key={comment.id}
											         data={comment}
											         parentId={comment.id}
											         paddingLeft={20}
											         userExists={this.state.user !== null}
											         onDeleteComment={this._onClickDeleteComment}/>
										))}
									</div>
								</div>
							}
						</div>
					)}
				</div>
			)
		);
	}
}
