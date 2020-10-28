import React, {Component} from "react";
import "../styles/artwork.css"
import {Link} from "react-router-dom";
import Discussion from "./discussion";
import ArtworkService from "../services/artwork.service";
import {getResponseMessage} from "./utils";

export default class Artwork extends Component {
	constructor(props) {
		super(props);
		this.state = {
			post: undefined,
			postVoting: undefined
		}
	}

	componentDidMount() {
		ArtworkService.getArtwork(this.props.match.params.id).then(
			resp => {
				this.setState({
					artwork: resp.data,
					postVoting: {
						points: resp.data.points,
						isVoted: resp.data.voted
					}
				});
			},
			err => {
				alert(getResponseMessage(err));
			}
		);

		// this.setState({
		// 	post: {
		// 		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
		// 		tags: ["tag1", "tag2", "tag3", "tag5", "tag6"],
		// 		creation_date: "27/10/2020",
		// 		creation_time: "16:47",
		// 		author: {
		// 			id: 1,
		// 			username: "dimon",
		// 			avatar: "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80"
		// 		},
		// 		image: 'https://cdn.pixabay.com/photo/2015/02/24/15/41/dog-647528__340.jpg',
		// 		// image: 'https://images.pexels.com/photos/1819650/pexels-photo-1819650.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
		// 	},
		// 	postVoting: {
		// 		points: 256,
		// 		isVoted: false
		// 	},
		// 	discussions: [
		// 		{
		// 			id: 1,
		// 			text: 'So unnecessary comment',
		// 			points: 3,
		// 			voted: true,
		// 			author: {
		// 				id: 1,
		// 				username: 'yuralisovskiy',
		// 				avatar: 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80'
		// 			},
		// 			answers: [
		// 				{
		// 					id: 3,
		// 					text: 'So unnecessary answer',
		// 					points: 7,
		// 					voted: false,
		// 					author: {
		// 						id: 1,
		// 						username: 'admin',
		// 						avatar: 'https://cdn.pixabay.com/photo/2015/02/24/15/41/dog-647528__340.jpg'
		// 					},
		// 				}
		// 			]
		// 		},
		// 		{
		// 			id: 4,
		// 			text: 'Hello, World!',
		// 			points: -5,
		// 			voted: false,
		// 			author: {
		// 				id: 2,
		// 				username: 'dimon',
		// 				avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ2Tte0mvD9fj--zkJGrAwtpGg80FR5h46RHQ&usqp=CAU'
		// 			}
		// 		}
		// 	]
		// })
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
					})
				},
				err => {
					// TODO:
					alert(getResponseMessage(err));
				}
			)
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
						<Link to={'/profile/' + post.author.id} className="">
							<div className="text-muted profile-photo">
								<img src={post.author.avatar} alt="Avatar" className="avatar-picture mr-2"/>
								<span className="d-inline">{post.author.username}</span>
							</div>
						</Link>
						<small className="text-muted">{post.creation_date} at {post.creation_time}</small>
						<div className="row">
							<div className="col-md-12 text-center top-minus-30">
								<img src={post.image} alt="Artwork" className="h-100 rounded-lg"/>
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
										   aria-hidden="true"/> {post.discussions_ids.length} Discussion{post.discussions_ids.length > 1 ? 's' : ''}
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
								{post.discussions_ids.map((discussion) => <Discussion key={discussion} discussion_id={discussion} paddingLeft={20}/>)}
							</div>
						</div>
					</div>
				)}
			</div>
		);
	}
}
