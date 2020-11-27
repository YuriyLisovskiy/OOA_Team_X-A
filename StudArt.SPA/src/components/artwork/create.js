import React, {Component} from "react";
import TagBadge from "../tag_badge";
import ImagePreview from "./image_preview";
import ArtworkService from "../../services/artwork";

export default class CreateArtwork extends Component {

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

	addTag = (tag) => {
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
					invalidTagMsg: "Tag already exists."
				});
			}

			this.setState({
				tagsError: undefined
			})
		}
		else {
			this.setState({
				invalidTagMsg: "Tag contains forbidden characters."
			});
		}
	}

	onChange = (field) => {
		return e => {
			let state = {};
			state[field] = e.target.value;
			this.setState(state);
		}
	}

	onKeyDownTagInput = (e) => {
		if (e.key.toLowerCase() === 'enter') {
			this.addTag(this.state.lastTag);
		}
	}

	handleAddTag = () => {
		this.addTag(this.state.lastTag);
	}

	handleRemoveTag = (e, tag) => {
		let tags = this.state.tags;
		if (tags.includes(tag)) {
			tags.splice(tags.indexOf(tag), 1);
			this.setState({
				tags: tags
			});
		}
	}

	onChangeTagInput = (e) => {
		this.onChange('lastTag')(e);
		// TODO: load list of suggested tags!
	}

	handleAddImage = (e) => {
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

	handlePreviewImageClick = (e) => {
		if (this.state.selectedImage !== e.target.src) {
			this.setState({
				selectedImage: e.target.src
			});
		}
	}

	validateInputs = () => {
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

	handlePost = (e) => {
		this.setState({
			errorMessage: undefined,
			loading: true
		});

		let hasErrors = this.validateInputs();
		if (!hasErrors) {
			ArtworkService.createArtwork(
				this.state.description,
				this.state.tags,
				this.state.images.map((image) => image.file),
				(data, err) => {
					if (!err) {
						this.props.history.push('/artwork/' + data.id.toString());
					}
					else {
						alert(err.response.message);
					}

					this.setState({
						loading: false
					});
				}
			);
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
						<form onSubmit={e => {e.preventDefault()}}>
							<div className="row mb-2">
								<div className="col-sm-12 text-center">
									{
										this.state.images.length > 0 && <div className="d-inline">
											{this.state.images.map((image) =>
												<ImagePreview key={image.url} src={image.url}
												              onClick={this.handlePreviewImageClick}
												              isSelected={image.url === this.state.selectedImage}/>
											)}
										</div>
									}
									<div className="d-inline ml-2">
										<button className="btn btn-success btn-sm rounded" onClick={e => {
											this.addImageRef.current.click();
										}}>
											<i className="fa fa-plus" aria-hidden="true"/> Upload image
										</button>
										{
											this.state.imagesError && <small className="form-text text-danger ml-1 mt-1">
												{this.state.imagesError}
											</small>
										}
										<input type="file" multiple style={{display: "none"}} ref={this.addImageRef}
										       onKeyPress={e => {
										        if (e.key.toLowerCase() === 'enter') {
										            e.preventDefault();
										        }
										       }}
										       onChange={this.handleAddImage}/>
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
											onChange={this.onChange('description')}
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
											<TagBadge className="mx-1" key={tag} text={tag}
											          onClickRemove={this.handleRemoveTag}/>)}
									</div>
								</div>
							}
							<div className="row">
								<div className="col-sm-8">
									<div className="form-group">
										<div className="input-group">
											<input
												type="text"
												className="form-control"
												name="add-tag"
												maxLength={30}
												onChange={this.onChangeTagInput}
												onKeyDown={this.onKeyDownTagInput}
												placeholder="e.g. nature, sunset, ..."
											/>
											<div className="input-group-append">
												<button className="btn btn-success" type="button"
												        onClick={this.handleAddTag}>
													<i className="fa fa-plus" aria-hidden="true"/> Add tag
												</button>
											</div>
										</div>
										{
											this.state.tagsError && <small className="form-text text-danger ml-1 mt-1">
												{this.state.tagsError}
											</small>
										}
										{
											this.state.invalidTagMsg && <small className="form-text text-danger ml-1 mt-1">
												{this.state.invalidTagMsg}
											</small>
										}
										<small className="form-text text-muted ml-1 mt-1">
											Use upper/lower case letters, numbers, underscores, dashes and spaces.
										</small>
									</div>
								</div>
								<div className="col-sm-1 ml-auto">
									<div className="form-group">
										<button
											onClick={this.handlePost}
											className="btn btn-primary"
											disabled={this.state.loading}>
											{this.state.loading &&
											<span className="spinner-border spinner-border-sm"/>} Post
										</button>
									</div>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		);
	}
}
