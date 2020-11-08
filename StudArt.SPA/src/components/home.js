import React, {Component} from "react";

import ArtworkPreview from "./artwork_preview";
import ArtworkService from "../services/artwork.service";
import {getResponseMessage} from "./utils";

export default class Home extends Component {
	constructor(props) {
		super(props);
		this.state = {
			artworks: {
				first: undefined,
				second: undefined,
				third: undefined,
			},
			artworksFirstCol: undefined,
			artworksSecondCol: undefined,
			artworksThird: undefined,
			loading: true,
			lastLoadedPage: undefined
		}

		this.handleScroll = this.handleScroll.bind(this);
		this.makeColFromResp = this.makeColFromResp.bind(this);
		this.loadArtworks = this.loadArtworks.bind(this);
	}

	makeColFromResp(resp, i) {
		return resp.data.results[i].map(
			(artwork) => <ArtworkPreview post={artwork} key={artwork.id}/>
		);
	}

	loadArtworks(page) {
		ArtworkService.getArtworks(page).then(
			resp => {
				// let newState = {
				// 	artworksFirstCol: this.makeColFromResp(resp, 0),
				// 	artworksSecondCol: this.makeColFromResp(resp, 1),
				// 	artworksThirdCol: this.makeColFromResp(resp, 2),
				// 	loading: false,
				// 	lastLoadedPage: resp.data.next
				// };
				let newFirst = this.makeColFromResp(resp, 0);
				let newSecond = this.makeColFromResp(resp, 1);
				let newThird = this.makeColFromResp(resp, 2);
				this.setState({
					artworks: {
						first: this.state.artworks.first ? this.state.artworks.first.concat(newFirst) : newFirst,
						second: this.state.artworks.second ? this.state.artworks.second.concat(newSecond) : newSecond,
						third: this.state.artworks.third ? this.state.artworks.third.concat(newThird) : newThird
					},
					loading: false,
					lastLoadedPage: resp.data.next
				});
			},
			err => {
				// TODO:
				alert(getResponseMessage(err));
			}
		);
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

		window.addEventListener("scroll", this.handleScroll);
		this.loadArtworks();
	}

	handleScroll() {
		if (this.state.lastLoadedPage) {
			const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
			const body = document.body;
			const html = document.documentElement;
			const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
			const windowBottom = windowHeight + window.pageYOffset;
			if (windowBottom >= docHeight - 1) {
				let parts = this.state.lastLoadedPage.split('=');
				let page = parts[parts.length - 1];
				this.setState({
					loading: true,
					lastLoadedPage: undefined
				});
				this.loadArtworks(page);
			}
		}
	}

	componentWillUnmount() {
		window.removeEventListener("scroll", this.handleScroll);
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

	colHasPosts = (colName) => {
		return this.state.artworks[colName] && this.state.artworks[colName].length > 0;
	}

	makePostsCol = (colName) => {
		return <div className="col-md-4">
			{this.colHasPosts(colName) && this.state.artworks[colName]}
		</div>;
	}

	render() {
		let hasPosts = this.colHasPosts('first') || this.colHasPosts('second') || this.colHasPosts('third');
		return (
			<div>
				{hasPosts ? (
					<div>
						<div className="row">
							{this.makePostsCol('first')}
							{this.makePostsCol('second')}
							{this.makePostsCol('third')}
						</div>
					</div>
				) : (
					!this.state.loading && <h2>No posts added yet</h2>
				)}
				{
					this.state.loading && <div className="row mb-2">
						<div className="col-md-12 text-center">
							<div className="spinner-grow text-secondary"/>
						</div>
					</div>
				}
			</div>
		);
	}
}
