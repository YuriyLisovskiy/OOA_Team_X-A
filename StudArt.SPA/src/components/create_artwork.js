import React, {Component} from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import Textarea from "react-validation/build/textarea";
import CheckButton from "react-validation/build/button";
import {required_field} from "./utils";
import TagBadge from "./tag_badge";
import ImagePreview from "./image_preview";
import ArtworkService from "../services/artwork";

export default class CreateArtwork extends Component {

	constructor(props) {
		super(props);
		this.addImageRef = React.createRef();
		this.state = {
			images: [],
			selectedImage: undefined,
			description: {
				errorMsg: undefined,
				value: ""
			},
			lastTag: {
				errorMsg: undefined,
				value: ""
			},
			tags: [],
			loading: false,
			message: ""
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
			} else {
				this.setState({
					invalidTagMsg: "Tag already exists."
				});
			}
		} else {
			this.setState({
				invalidTagMsg: "Tag contains forbidden characters."
			});
		}
	}

	onChange = (field) => {
		return e => {
			let fieldState = {};
			fieldState['value'] = e.target.value;
			fieldState['errorMsg'] = undefined;
			let state = {};
			state[field] = fieldState;
			this.setState(state);
		}
	}

	onKeyDownTagInput = (e) => {
		if (e.key.toLowerCase() === 'enter') {
			this.addTag(this.state.lastTag.value);
		}
	}

	handleAddTag = () => {
		this.addTag(this.state.lastTag.value);
	}

	handleRemoveTag = (e, tag) => {
		let tags = this.state.tags;
		if (tags.includes(tag)) {
			delete tags[tags.indexOf(tag)];
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
				selectedImage: images[images.length - 1].url
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

	// setError = (err) => {
	// 	this.setState({
	// 		loading: false,
	// 		message: getResponseMessage(err)
	// 	});
	// }

	handlePost = (e) => {
		this.setState({
			message: "",
			loading: true
		});

		let hasErrors = false;
		if (hasErrors) {
			// TODO: handle response!
			ArtworkService.createArtwork(
				this.state.description.value,
				this.state.tags,
				this.state.images.map((image) => image.file)
			);
			this.props.history.push('/artwork/1');
		} else {
			this.setState({
				loading: false
			});
		}
	}

	render() {
		return (
			<div className="row">
				<div className="col-sm-12">
					<Form onSubmit={e => {
						e.preventDefault();
					}} ref={c => {
						this.form = c;
					}}>
						<div className="row mb-2">
							<div className="col-sm-12 text-center">
								{
									this.state.images.length > 0 && <div className="d-inline">
										{this.state.images.map((image) =>
											<ImagePreview id={image.url} src={image.url}
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
									<Textarea
										type="text"
										rows={5}
										className="form-control"
										name="description"
										value={this.state.description.value}
										onChange={this.onChange('description')}
										validations={[required_field]}
										placeholder="Type text..."
									/>
								</div>
							</div>
						</div>
						{
							this.state.tags.length > 0 && <div className="row mb-3">
								<div className="col-sm-12">
									<span>Tags: </span>
									{this.state.tags.map((tag) =>
										<TagBadge className="mx-1" id={tag} text={tag}
										          onClickRemove={this.handleRemoveTag}/>)}
								</div>
							</div>
						}
						<div className="row">
							<div className="col-sm-8">
								<div className="form-group">
									<div className="input-group">
										<Input
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
										this.state.invalidTagMsg && <small className="form-text text-danger">
											{this.state.invalidTagMsg}
										</small>
									}
									<small className="form-text text-muted">
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
						{this.state.message && (
							<div className="form-group">
								<div className="alert alert-danger" role="alert">
									{this.state.message}
								</div>
							</div>
						)}
						<CheckButton style={{display: "none"}} ref={c => {
							this.checkBtn = c;
						}}/>
					</Form>
				</div>
			</div>
		);
	}
}
