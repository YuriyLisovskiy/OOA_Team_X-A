import React, {Component} from "react";

import ArtworkPreviewComponent from "./Preview";
import ArtworkService from "../../services/artwork";
import {getErrorMessage, getOrDefault} from "../../utils/misc";
import SpinnerComponent from "../Spinner";
import {ArtworkEmptyPreview} from "./EmptyPreview";

const DEFAULT_COLUMNS_COUNT = 3;

export default class ArtworksListComponent extends Component {

	constructor(props) {
		super(props);
		this._columnsCount = getOrDefault(this.props.columnsCount, DEFAULT_COLUMNS_COUNT);
		this._handleClickOnPreviewTag = getOrDefault(this.props.clickOnPreviewTag, true);
		this.state = {
			artworks: undefined,
			artworksColList: undefined,
			loading: true,
			lastLoadedPage: undefined,
			filterTags: getOrDefault(this.props.filterTags, []),
			filterAuthors: getOrDefault(this.props.filterAuthors, []),
			filterBySubscriptions: getOrDefault(this.props.filterBySubscriptions, false)
		};
	}

	componentDidMount() {
		this._loadArtworks(
			null,
			this._columnsCount,
			this.state.filterTags,
			this.state.filterAuthors,
			this.state.filterBySubscriptions
		);
		window.addEventListener("scroll", this._onScroll);
	}

	componentWillUnmount() {
		window.removeEventListener("scroll", this._onScroll);
	}

	searchByTags = (tags) => {
		this.setState({
			filterTags: tags
		});
		this._loadArtworks(
			null,
			this._columnsCount,
			this.state.filterTags,
			this.state.filterAuthors,
			this.state.filterBySubscriptions
		);
	}

	_setArtworksState = (currArtworks, newArtworks) => {
		if (currArtworks) {
			let newState = [];
			for (let i = 0; i < this._columnsCount; i++) {
				newState[i] = currArtworks[i] ? currArtworks[i].concat(newArtworks[i]) : newArtworks[i];
			}

			return newState;
		}

		return newArtworks;
	}

	_makeColsFromResp = (data) => {
		let newList = [];
		for (let i = 0; i < this._columnsCount; i++) {
			newList.push(data.results[i].map((artwork) =>
				<ArtworkPreviewComponent onClickTag={this._onClickSearchByTag}
				                         post={artwork} key={artwork.id}/>
			));
		}

		if (this._columnsCount === 2) {
			if (newList[0].length === 0) {
				newList[0].push(<ArtworkEmptyPreview key={-2}/>);
			}

			if (newList[1].length === 0) {
				newList[1].push(<ArtworkEmptyPreview key={-1}/>);
			}
		}

		return newList;
	}

	_loadArtworks = (page, columns, tags, authors, filterBySubs) => {
		ArtworkService.getArtworks(page, columns, filterBySubs, tags, authors, (data, err) => {
			if (err) {
				// TODO:
				alert(getErrorMessage(err));
			}
			else {
				let newArtworksList = this._makeColsFromResp(data);
				this.setState({
					artworks: this._setArtworksState(
						page ? this.state.artworks : null, newArtworksList
					),
					loading: false,
					lastLoadedPage: data.next
				});
			}
		});
	}

	_colHasPosts = (colNum) => {
		return this.state.artworks[colNum] && this.state.artworks[colNum].length > 0;
	}

	_colsHavePosts = () => {
		if (this.state.artworks) {
			for (let i = 0; i < this._columnsCount; i++) {
				if (this.state.artworks[i] && this.state.artworks[i].length > 0) {
					return true;
				}
			}
		}

		return false;
	}

	_makePostsCol = (colNum) => {
		let cn = "col-md-" + (12 / this._columnsCount);
		return <div key={colNum} className={cn}>
			{this._colHasPosts(colNum) && this.state.artworks[colNum]}
		</div>;
	}

	_makeAllColumns = () => {
		let resultCols = [];
		for (let i = 0; i < this._columnsCount; i++) {
			resultCols.push(this._makePostsCol(i));
		}

		return <div className="row">{resultCols}</div>
	}

	_onClickSearchByTag = (e, tag) => {
		if (this._handleClickOnPreviewTag) {
			if (this.props.onClickTag) {
				this.props.onClickTag(e, tag);
			}
		}
	}

	_onScroll = () => {
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
				this._loadArtworks(
					page,
					this._columnsCount,
					this.state.filterTags,
					this.state.filterAuthors,
					this.state.filterBySubscriptions
				);
			}
		}
	}

	render() {
		let hasPosts = this._colsHavePosts();
		return <div>
			{
				hasPosts ? (
					<div>
						{this._makeAllColumns()}
					</div>
				) : (
					!this.state.loading && <h2 className="text-center text-muted">No posts found</h2>
				)
			}
			{
				this.state.loading && <SpinnerComponent/>
			}
		</div>;
	}
}
