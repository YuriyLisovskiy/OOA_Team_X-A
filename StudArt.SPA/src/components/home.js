import React, {Component} from "react";

import ArtworkPreview from "./artwork_preview";
import ArtworkService from "../services/artwork.service";
import {getResponseMessage} from "./utils";

export default class Home extends Component {
	constructor(props) {
		super(props);
		// this.handleRegister = this.handleRegister.bind(this);
		this.state = {
			artworks: undefined,
			loading: true
		}
	}

	componentDidMount() {
		// let posts = [
		// 	{
		// 		id: 1,
		// 		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
		// 		tags: ["tag1", "tag2", "tag3"],
		// 		points: 7,
		// 		creation_date: "13/10/2020",
		// 		creation_time: "9:07",
		// 		voted: true,
		// 		discussions_count: 35,
		// 		image: 'https://cdn.pixabay.com/photo/2015/02/24/15/41/dog-647528__340.jpg',
		// 		author: {
		// 			id: 1,
		// 			username: "admin",
		// 			avatar: "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80"
		// 		}
		// 	},
		// 	{
		// 		id: 2,
		// 		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
		// 		tags: ["tag1", "tag2", "tag3", "tag5", "tag6"],
		// 		points: 256,
		// 		creation_date: "27/10/2020",
		// 		creation_time: "16:47",
		// 		voted: false,
		// 		discussions_count: 2,
		// 		image: 'https://images.pexels.com/photos/1819650/pexels-photo-1819650.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
		// 		author: {
		// 			id: 1,
		// 			username: "admin",
		// 			avatar: "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80"
		// 		}
		// 	}
		// ];

		ArtworkService.getArtworks().then(
			resp => {
				console.log(resp.data);
				this.setState({
					artworks: resp.data.map(
						(artwork) => <ArtworkPreview post={artwork} key={artwork.id}/>
					),
					loading: false
				});
			},
			err => {
				// TODO:
				alert(getResponseMessage(err));
			}
		);
	}

	// handleExplorePost(id) {
	// 	let comments = [
	// 		{
	// 			text: 'So unnecessary comment',
	// 			points: 3,
	// 			author: {
	// 				id: 1,
	// 				username: 'yuralisovskiy',
	// 				avatar: 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80'
	// 			}
	// 		},
	// 		{
	// 			text: 'Hello, World!',
	// 			points: -5,
	// 			author: {
	// 				id: 2,
	// 				username: 'dimon',
	// 				avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ2Tte0mvD9fj--zkJGrAwtpGg80FR5h46RHQ&usqp=CAU'
	// 			}
	// 		}
	// 	];
	// 	return e => {
	// 		console.log(comments);
	// 	}
	// }

	// handleVote(id) {
	// 	return e => {
	// 		let newVoted = !(e.target.getAttribute("data-voted") === "voted");
	// 		e.target.setAttribute("data-voted", newVoted ? "voted" : "");
	// 		if (newVoted) {
	// 			e.target.classList.remove("fa-star-o");
	// 			e.target.classList.add("fa-star");
	// 			e.target.innerHTML = " " + (parseInt(e.target.innerHTML) + 1).toString();
	// 		} else {
	// 			e.target.classList.remove("fa-star");
	// 			e.target.classList.add("fa-star-o");
	// 			e.target.innerHTML = " " + (parseInt(e.target.innerHTML) - 1).toString();
	// 		}
	// 	}
	// }
	//
	// makeCard(post) {
	// 	return (
	// 		<div className="card artwork-card" key={post.id}>
	// 			<img className="card-img-top" src={post.image} alt="Artwork"/>
	// 			<div className="card-body">
	// 				<p className="card-text artwork-description">{post.description}</p>
	// 				<div className="d-inline">
	// 					<i role="button" className={"votes-indicator fa fa-lg fa-star" + (post.voted ? "" : "-o")}
	// 					   aria-hidden="true" onClick={this.handleVote(post.id)}
	// 					   data-voted={post.voted ? "voted" : ""}> {post.points}</i>
	// 				</div>
	// 				<div className="d-inline ml-3" role="button" onClick={this.handleExploreArtwork(post.id)}>
	// 					<i className="fa fa-comments fa-lg" aria-hidden="true"/> {post.comments_count} Comments
	// 				</div>
	// 				<p className="card-text mt-3">
	// 					<small className="text-muted">{post.creation_date} at {post.creation_time}</small>
	// 				</p>
	// 			</div>
	// 		</div>
	// 	);
	// }

	// handleExploreArtwork(id) {
	// 	return e => {
	// 		this.setState({
	// 			showModal: true,
	// 			currentArtworkId: id
	// 		})
	// 	}
	// }

	render() {
		return (
			<div>
				{this.state.loading ? (
					<div className="row">
						<div className="col-md-12 text-center">
							<div className="spinner-grow text-secondary"/>
						</div>
					</div>
				) : (
					<div>
						{this.state.artworks && this.state.artworks.length > 0 ? (
							<div>
								<div className="card-columns">{this.state.artworks}</div>
							</div>
						) : (
							<h2>No posts added yet</h2>
						)}
					</div>
				)}
			</div>
		);
	}
}
