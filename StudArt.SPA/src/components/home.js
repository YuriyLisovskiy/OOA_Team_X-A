import React, {Component} from "react";

import ArtworkPreview from "./artwork/preview";
import ArtworkService from "../services/artwork";
import {getResponseMessage} from "./utils";

let DEFAULT_COLUMNS_COUNT = 3;

export default class Home extends Component {

	constructor (props) {
		super(props);
		let colsCnt = this.props.columnsCount ? this.props.columnsCount : DEFAULT_COLUMNS_COUNT;
		this.state = {
			artworks: undefined,
			artworksColList: undefined,
			loading: true,
			lastLoadedPage: undefined,
			columnsCount: colsCnt,
			filterTags: undefined,
			filterAuthors: undefined,
			filterBySubs: false
		}
	}

	makeColsFromResp = (data) => {
		let newList = [];
		for (let i = 0; i < this.state.columnsCount; i++) {
			newList.push(data.results[i].map((artwork) =>
				<ArtworkPreview onClickTag={this.handleOnClickTag} post={artwork} key={artwork.id}/>
			));
		}

		return newList;
	}

	setArtworksState = (currArtworks, newArtworks) => {
		if (currArtworks) {
			let newState = [];
			for (let i = 0; i < this.state.columnsCount; i++) {
				newState[i] = currArtworks[i] ? currArtworks[i].concat(newArtworks[i]) : newArtworks[i];
			}

			return newState;
		}

		return newArtworks;
	}

	loadArtworks = (page, columns, tags, authors, filterBySubs) => {
		ArtworkService.getArtworks(page, columns, filterBySubs, tags, authors, (data, err) => {
			if (err) {
				// TODO:
				alert(getResponseMessage(err));
			}
			else {
				let newArtworksList = this.makeColsFromResp(data);
				this.setState({
					artworks: this.setArtworksState(
						page ? this.state.artworks : null, newArtworksList
					),
					loading: false,
					lastLoadedPage: data.next,
					filterTags: tags
				});
			}
		});
	}

	componentDidMount () {
		this.loadArtworks(
			null,
			this.state.columnsCount,
			this.state.filterTags,
			this.props.filterAuthors,
			this.props.filterBySubs ? true : null
		);
		window.addEventListener("scroll", this.handleScroll);
	}

	handleOnClickTag = (e, tag) => {
		this.loadArtworks(
			null,
			this.state.columnsCount,
			[tag],
			this.props.filterAuthors,
			this.props.filterBySubs ? true : null
		);
	}

	handleScroll = () => {
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
				this.loadArtworks(
					page,
					this.state.columnsCount,
					this.state.filterTags,
					this.props.filterAuthors,
					this.props.filterBySubs ? true : null
				);
			}
		}
	}

	componentWillUnmount () {
		window.removeEventListener("scroll", this.handleScroll);
	}

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
		for (let i = 0; i < this.state.columnsCount; i++)
		{
			resultCols.push(this.makePostsCol(i));
		}

		return <div className="row">{resultCols}</div>
	}

	render () {
		let hasPosts = this.colsHavePosts();
		return (
			<div>
				{
					hasPosts ? (
						<div>
							{this.makeAllColumns()}
						</div>
					) : (
						!this.state.loading && <h2>No posts added yet</h2>
					)
				}
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
