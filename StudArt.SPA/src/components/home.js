import React, {Component} from "react";

import ArtworkPreview from "./artwork_preview";
import ArtworkService from "../services/artwork";
import {getResponseMessage} from "./utils";

let HOMEPAGE_COLUMNS = 3;

export default class Home extends Component {
	constructor (props) {
		super(props);
		console.log(this.props.columnsCount)
		let cc=HOMEPAGE_COLUMNS;
		if(this.props.columnsCount) {
			cc = this.props.columnsCount
		}
		console.log(cc)
		this.state = {
			artworks: undefined,
			artworksColList: undefined,
			loading: true,
			lastLoadedPage: undefined,
			columnsCount: cc
		}
		
		console.log(this.state.columnsCount)
		
		this.handleScroll = this.handleScroll.bind(this);
		this.makeColsFromResp = this.makeColsFromResp.bind(this);
		this.loadArtworks = this.loadArtworks.bind(this);
		this.setArtworksState = this.setArtworksState.bind(this);
	}
	
	makeColsFromResp (data) {
		let newList = [];
		for (let i = 0; i < this.state.columnsCount; i++) {
			newList.push(data.results[i].map((artwork) => <ArtworkPreview post={artwork} key={artwork.id}/>))
		}
		return newList;
	}
	
	setArtworksState (currArtworks, newArtworks) {
		if (currArtworks) {
			let newState = [];
			for (let i = 0; i < this.state.columnsCount; i++) {
				newState[i] = currArtworks[i] ? currArtworks[i].concat(newArtworks[i]) : newArtworks[i];
			}
			return newState;
		}
		return newArtworks;
	}
	
	loadArtworks (page, columns) {
		ArtworkService.getArtworks(page, columns, null, null, null, (data, err) => {
			if (err) {
				// TODO:
				alert(getResponseMessage(err));
			}
			else {
				let newArtworksList = this.makeColsFromResp(data);
				this.setState({
					artworks: this.setArtworksState(this.state.artworks, newArtworksList),
					loading: false,
					lastLoadedPage: data.next
				});
			}
		});
	}
	
	componentDidMount () {
		window.addEventListener("scroll", this.handleScroll);
		this.loadArtworks(null, this.state.columnsCount);
	}
	
	handleScroll () {
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
				this.loadArtworks(page, this.state.columnsCount);
			}
		}
	}
	
	componentWillUnmount () {
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
	
	colHasPosts = (colNum) => {
		return this.state.artworks[colNum] && this.state.artworks[colNum].length > 0;
	}
	
	colsHavePosts = () => {
		if (this.state.artworks) {
			for (let i = 0; i < this.state.columnsCount; i++) {
				if (this.state.artworks[i] && this.state.artworks[i].length > 0) {
					return true;
				}
			}
		}
		return false;
	}
	
	makePostsCol = (colNum) => {
		let cn = "col-md-" + (12 / this.state.columnsCount);
		return <div key={colNum} className={cn}>
			{this.colHasPosts(colNum) && this.state.artworks[colNum]}
		</div>;
	}
	
	makeAllColumns = () => {
		let resultCols = [];
		for (let i=0; i< this.state.columnsCount; i++)
		{
			resultCols.push(this.makePostsCol(i));
		}
		return <div className="row">
			{resultCols}
		</div>
	}
	
	render () {
		let hasPosts = this.colsHavePosts();
		return (
			<div>
				{hasPosts ? (
					<div>
						{this.makeAllColumns()}
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
