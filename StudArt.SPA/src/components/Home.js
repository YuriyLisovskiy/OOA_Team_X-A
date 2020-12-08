import React, {Component} from "react";

import ArtworksListComponent from "./artwork/List";
import TagBadgeComponent from "./TagBadge";

export default class HomeComponent extends Component {

	constructor(props) {
		super(props);
		this.state = {
			tags: [],
			currentTag: "",
			tagError: undefined
		};
		this._listComponentRef = React.createRef();
	}

	_addTag = (tag) => {
		let message = undefined;
		if (tag.length === 0) {
			message = "Tag field is empty.";
		}
		else if (tag.match(/^[A-Za-z0-9-_\s]{1,30}$/)) {
			let tags = this.state.tags;
			if (!tags.includes(tag)) {
				tags.push(tag);
				this.setState({
					tags: tags
				});
			}
			else {
				message = "Tag already exists.";
			}
		}
		else {
			message = "Tag contains forbidden characters.";
		}

		this.setState({
			tagError: message,
			currentTag: ""
		});
		this._listComponentRef.current.searchByTags(this.state.tags);
	}

	_onChangeTagInput = (e) => {
		this.setState({
			currentTag: e.target.value.trim(),
			tagError: undefined
		});
	}

	_onClickAddTag = (_) => {
		this._addTag(this.state.currentTag);
	}

	_onAddTag = (_, tag) => {
		this._addTag(tag);
	}

	_onKeyDownAddTag = (e) => {
		if (e.key.toLowerCase() === 'enter') {
			this._addTag(this.state.currentTag);
		}
	}

	_onClickRemoveTag = (_, tag) => {
		let tags = this.state.tags;
		if (tags.includes(tag)) {
			tags.splice(tags.indexOf(tag), 1);
			this.setState({
				tags: tags
			});

			this._listComponentRef.current.searchByTags(this.state.tags);
		}
	}

	render () {
		return <div className="container">
			<div className="row">
				<div className="col-md-12">
					<div className="form-group mb-4">
						<div className="input-group">
							<input type="text" className="form-control" placeholder="Type tag..."
							       value={this.state.currentTag}
							       onChange={this._onChangeTagInput}
							       onKeyDown={this._onKeyDownAddTag}/>
							<div className="input-group-append">
								<button className="btn btn-success" onClick={this._onClickAddTag}>Add</button>
							</div>
						</div>
						{
							this.state.tagError && <small className="form-text text-danger ml-1 mt-1">
								{this.state.tagError}
							</small>
						}
					</div>
				</div>
			</div>
			{
				this.state.tags.length > 0 && <div className="row mb-3">
					<div className="col-sm-12">
						<span>Tags: </span>
						{this.state.tags.map((tag) =>
							<TagBadgeComponent className="mx-1" key={tag} text={tag}
							                   onClickRemove={this._onClickRemoveTag}/>)}
					</div>
				</div>
			}
			<ArtworksListComponent ref={this._listComponentRef}
			                       filterTags={this.state.tags}
			                       onClickTag={this._onAddTag}/>
		</div>;
	}
}
