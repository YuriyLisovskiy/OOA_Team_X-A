import React, {Component} from "react";
import "../../styles/artwork/artwork.css"
import {Link} from "react-router-dom";
import Discussion from "./discussion";
import ArtworkService from "../../services/artwork";
import {getResponseMessage} from "../utils";

export default class Artwork extends Component {

	constructor(props) {
		super(props);
		this.state = {
			post: undefined,
			postVoting: undefined
		}
	}

	componentDidMount() {
		ArtworkService.get(this.props.match.params.id, (data, err) => {
			if (err) {
				alert(getResponseMessage(err));
			}
			else {
				this.setState({
					artwork: data,
					postVoting: {
						points: data.points,
						isVoted: data.voted
					}
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
		let post = this.state.artwork;
		let voting = this.state.postVoting;
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
									<i role="button"
									   className={"select-none fa fa-lg fa-star" + (voting && voting.isVoted ? "" : "-o")}
									   aria-hidden="true" onClick={this.handleVote(post.id)}
									   data-voted={voting && voting.isVoted ? "voted" : ""}> {voting ? voting.points : 0}</i>
								</div>
								<a href="#discussions" className="text-muted">
									<div className="d-inline ml-3 select-none">
										<i className="fa fa-comments fa-lg"
										   aria-hidden="true"/> {post.discussions_ids.length} Discussion{post.discussions_ids.length > 1 || post.discussions_ids.length === 0 ? 's' : ''}
									</div>
								</a>
							</div>
						</div>
						<div className="row">
							<div className="col-md-12 text-justify">
								{post.description}
							</div>
						</div>
						<div className="row mt-4" id="discussions">
							<div className="col-md-12">
								{post.discussions_ids.map((discussion) => <Discussion key={discussion}
								                                                      discussion_id={discussion}
								                                                      paddingLeft={20}/>)}
							</div>
						</div>
					</div>
				)}
			</div>
		);
	}
}
