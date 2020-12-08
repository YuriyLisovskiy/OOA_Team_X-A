import React, {Component} from "react";

import ArtworkPreview from "../artwork/preview";
import ArtworkService from "../../services/artwork";
import {getOrDefault, getResponseMessage} from "../utils";
import Spinner from "../spinner";
import ArtworkEmptyPreview from "./empty_preview";

const DEFAULT_COLUMNS_COUNT = 3;

export default class ArtworksList extends Component {

	constructor(props) {
		super(props);
		this._columnsCount = getOrDefault(this.props.columnsCount, DEFAULT_COLUMNS_COUNT);
		this._handleClickOnPreviewTag = getOrDefault(this.props.clickOnPreviewTag, true)
		this.state = {
			artworks: undefined,
			artworksColList: undefined,
			loading: true,
			lastLoadedPage: undefined,
			filterTags: getOrDefault(this.props.filterTags, []),
			filterAuthors: getOrDefault(this.props.filterAuthors, []),
			filterBySubscriptions: getOrDefault(this.props.filterBySubscriptions, false)
		}
	}

	componentDidMount() {
		this.loadArtworks(
			null,
			this._columnsCount,
			this.state.filterTags,
			this.state.filterAuthors,
			this.state.filterBySubscriptions
		);
		window.addEventListener("scroll", this.handleScroll);
	}

	componentWillUnmount() {
		window.removeEventListener("scroll", this.handleScroll);
	}

	makeColsFromResp = (data) => {
		let newList = [];
		for (let i = 0; i < this._columnsCount; i++) {
			newList.push(data.results[i].map((artwork) =>
				<ArtworkPreview onClickTag={this.handleOnClickTag} post={artwork} key={artwork.id}/>
			));
		}

		if (this._columnsCount === 2 && newList[1].length === 0) {
			newList[1].push(<ArtworkEmptyPreview key={-1}/>);
		}

		console.log(newList);

		return newList;
	}

	setArtworksState = (currArtworks, newArtworks) => {
		if (currArtworks) {
			let newState = [];
			for (let i = 0; i < this._columnsCount; i++) {
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
					lastLoadedPage: data.next
				});
			}
		});
	}

	handleOnClickTag = (e, tag) => {
		if (this._handleClickOnPreviewTag) {
			this.loadArtworks(
				null,
				this._columnsCount,
				[tag],
				this.state.filterAuthors,
				this.state.filterBySubscriptions
			);
		}
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
					this._columnsCount,
					this.state.filterTags,
					this.state.filterAuthors,
					this.state.filterBySubscriptions
				);
			}
		}
	}

	colHasPosts = (colNum) => {
		return this.state.artworks[colNum] && this.state.artworks[colNum].length > 0;
	}

	colsHavePosts = () => {
		if (this.state.artworks) {
			for (let i = 0; i < this._columnsCount; i++) {
				if (this.state.artworks[i] && this.state.artworks[i].length > 0) {
					return true;
				}
			}
		}

		return false;
	}

	makePostsCol = (colNum) => {
		let cn = "col-md-" + (12 / this._columnsCount);
		return <div key={colNum} className={cn}>
			{this.colHasPosts(colNum) && this.state.artworks[colNum]}
		</div>;
	}

	makeAllColumns = () => {
		let resultCols = [];
		for (let i = 0; i < this._columnsCount; i++)
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
					this.state.loading && <Spinner/>
				}
			</div>
		);
	}
}
