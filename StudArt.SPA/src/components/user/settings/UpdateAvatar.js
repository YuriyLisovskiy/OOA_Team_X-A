import React, {Component} from "react";
import PropTypes from "prop-types";
import UserService from "../../../services/user";
import {getErrorMessage} from "../../../utils/misc";

export default class UpdateAvatarComponent extends Component {

	constructor(props) {
		super(props);
		this.state = {
			selectedFile: undefined,
			isSaved: true,
			fileError: undefined,
			selectedImageLink: undefined,
			user: this.props.user
		};
	}

	_onChangeValue = (e) => {
		if (e.target.files.length > 0) {
			let file = e.target.files[0];
			this.setState({
				selectedFile: file,
				isSaved: false,
				fileError: undefined,
				selectedImageLink: URL.createObjectURL(file)
			});
		}
	}

	_onClickSave = (_) => {
		if (!this.state.isSaved) {
			UserService.updateAvatar(this.state.user.id, this.state.selectedFile, (data, err) => {
				if (err) {
					this.setState({
						fileError: getErrorMessage(err)
					});
				}
				else {
					let user = this.state.user;
					user.avatar_link = data.avatar_link;
					UserService._setCurrentUser(user);
					this.setState({
						selectedFile: undefined,
						isSaved: true,
						fileError: undefined,
						selectedImageLink: undefined
					});
					this.props.updateAvatar(data.avatar_link);
				}
			});
		}
	}

	render() {
		return <div className="row">
			<div className="col-12">
				<div className="form-group">
					<label htmlFor="email"><h6>Avatar</h6></label>
					<div className="input-group">
						<input type="file" className="form-control" name="avatar"
						       onChange={this._onChangeValue}/>
						<div className="input-group-append"
						     title={this.state.isSaved ? "Saved" : "Click to save"}>
							<button className={"btn btn-" + (this.state.isSaved ? "success" : "warning")}
							        onClick={this._onClickSave}
							        disabled={this.state.isSaved}>
								<div className="d-inline">
									<i className={"fa " + (
										this.state.isSaved ? "fa-check-circle-o" : "fa-exclamation-triangle"
									)}
									   aria-hidden="true"/>
								</div>
								{
									!this.state.isSaved &&
									<div className="d-inline ml-2">Save</div>
								}
							</button>
						</div>
					</div>
					{
						this.state.fileError && <small className="form-text text-danger ml-1 mt-1">
							{this.state.fileError}
						</small>
					}
				</div>
			</div>
			{
				this.state.selectedImageLink &&
				<div className="col-4 text-center">
					<img src={this.state.selectedImageLink} className="img-thumbnail mx-auto d-block" alt="AVATAR"/>
				</div>
			}
		</div>;
	}
}

UpdateAvatarComponent.propTypes = {
	user: PropTypes.object,
	updateAvatar: PropTypes.func
}
