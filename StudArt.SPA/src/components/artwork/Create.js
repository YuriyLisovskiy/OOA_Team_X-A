import React, {Component} from "react";
import TagBadgeComponent from "../TagBadge";
import ImagePreviewComponent from "./ImagePreview";
import ArtworkService from "../../services/artwork";
import {getErrorMessage} from "../../utils/misc";

export default class CreateArtworkComponent extends Component {

	constructor(props) {
		super(props);
		this.addImageRef = React.createRef();
		this.state = {
			images: [],
			selectedImage: undefined,
			description: "",
			lastTag: "",
			tags: [],
			loading: false,
			imagesError: undefined,
			tagsError: undefined,
			descriptionError: undefined,
			errorMessage: undefined
		};
	}

	_addTag = (tag) => {
		tag = tag.trim();
		if (tag.match(/^[A-Za-z0-9-_\s]{1,30}$/)) {
			let tags = this.state.tags;
			if (!tags.includes(tag)) {
				tags.push(tag);
				this.setState({
					tags: tags
				});
			}
			else {
				this.setState({
					tagsError: "Tag already exists."
				});
			}
		}
		else {
			this.setState({
				tagsError: "Tag contains forbidden characters."
			});
		}
	}

	_validateInputs = () => {
		let newState = {};
		if (this.state.images.length === 0) {
			newState['imagesError'] = 'Add at least one image.';
		}

		if (this.state.tags.length === 0) {
			newState['tagsError'] = 'Add at least one tag.';
		}

		if (this.state.description.length === 0) {
			newState['descriptionError'] = 'Description field must be filled.';
		}

		if (Object.keys(newState).length === 0) {
			return false;
		}

		this.setState(newState);
		return true;
	}

	_onChange = (field) => {
		return e => {
			let state = {};
			state[field] = e.target.value;
			if (field === 'lastTag') {
				state['tagsError'] = undefined;
			}
			else {
				state[field + 'Error'] = undefined;
			}

			this.setState(state);
		}
	}

	_onKeyDownTagInput = (e) => {
		if (e.key.toLowerCase() === 'enter') {
			this._addTag(this.state.lastTag);
		}
	}

	_onClickAddTag = () => {
		this._addTag(this.state.lastTag);
	}

	_onClickRemoveTag = (e, tag) => {
		let tags = this.state.tags;
		if (tags.includes(tag)) {
			tags.splice(tags.indexOf(tag), 1);
			this.setState({
				tags: tags
			});
		}
	}

	_onChangeTagInput = (e) => {
		this._onChange('lastTag')(e);
		// TODO: load list of suggested tags!
	}

	_onChangeAddImage = (e) => {
		if (e.target.files.length > 0) {
			let images = this.state.images;
			for (let i = 0; i < e.target.files.length; i++) {
				let item = e.target.files[i];
				images.push({
					file: item,
					url: URL.createObjectURL(item)
				});
			}

			this.setState({
				images: images,
				selectedImage: images[images.length - 1].url,
				imagesError: undefined
			});
		}
	}

	_onClickPreviewImage = (e) => {
		if (this.state.selectedImage !== e.target.src) {
			this.setState({
				selectedImage: e.target.src
			});
		}
	}

	_onClickCreatePost = (_) => {
		this.setState({
			errorMessage: undefined,
			loading: true
		});

		let hasErrors = this._validateInputs();
		if (!hasErrors) {
			ArtworkService.createArtwork(
				this.state.description,
				this.state.tags,
				this.state.images.map((image) => image.file), (data, err) => {
					if (err) {
						// TODO:
						alert(getErrorMessage(err));
					}
					else {
						this.props.history.push('/artwork/' + data.id.toString());
					}

					this.setState({
						loading: false
					});
				});
		}
		else {
			this.setState({
				loading: false
			});
		}
	}

	render() {
		return (
			<div>
				<div className="row">
					<div className="col-sm-12">
						<div className="row mb-2">
							<div className="col-sm-12 text-center">
								{
									this.state.images.length > 0 && <div className="d-inline">
										{this.state.images.map((image) =>
											<ImagePreviewComponent key={image.url} src={image.url}
											              onClick={this._onClickPreviewImage}
											              isSelected={image.url === this.state.selectedImage}/>
										)}
									</div>
								}
								<div className="d-inline ml-2">
									<button className="btn btn-success btn-sm rounded"
									        onClick={_ => {this.addImageRef.current.click();}}>
										<i className="fa fa-plus" aria-hidden="true"/> Upload image
									</button>
									{
										this.state.imagesError && <small className="form-text text-danger ml-1 mt-1">
											{this.state.imagesError}
										</small>
									}
									<input type="file" multiple style={{display: "none"}}
									       ref={this.addImageRef}
									       onChange={this._onChangeAddImage}/>
								</div>
							</div>
						</div>
						{
							this.state.selectedImage && <div className="row text-center">
								<div className="col-sm-12">
									<img src={this.state.selectedImage} alt="Artwork Pic"
									     className="my-3 rounded artwork-image"/>
								</div>
							</div>
						}
						<div className="row">
							<div className="col-sm-12">
								<div className="form-group">
									<label className="control-label" htmlFor="description">Description</label>
									<textarea
										rows={5}
										className="form-control"
										name="description"
										value={this.state.description}
										onChange={this._onChange('description')}
										placeholder="Type text..."
									/>
									{
										this.state.descriptionError && <small className="form-text text-danger ml-1 mt-1">
											{this.state.descriptionError}
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
						<div className="row">
							<div className="col-sm-9">
								<div className="form-group">
									<div className="input-group">
										<input
											type="text"
											className="form-control"
											name="add-tag"
											maxLength={30}
											onChange={this._onChangeTagInput}
											onKeyDown={this._onKeyDownTagInput}
											placeholder="e.g. nature, sunset, ..."
										/>
										<div className="input-group-append">
											<button className="btn btn-success" type="button"
											        onClick={this._onClickAddTag}>
												<i className="fa fa-plus" aria-hidden="true"/> Add tag
											</button>
										</div>
									</div>
									{
										this.state.tagsError && <small className="form-text text-danger ml-1 mt-1">
											{this.state.tagsError}
										</small>
									}
									<small className="form-text text-muted ml-1 mt-1">
										Use upper/lower case letters, numbers, underscores, dashes and spaces.
									</small>
								</div>
							</div>
							<div className="col-sm-3 text-right">
								<div className="form-group">
									<button
										onClick={this._onClickCreatePost}
										className="btn btn-primary"
										disabled={this.state.loading}>
										{this.state.loading &&
										<span className="spinner-border spinner-border-sm"/>} Post
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
