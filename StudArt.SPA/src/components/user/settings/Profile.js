import React, {Component} from "react";
import PasswordVerificationComponent from "./PasswordVerification";
import PropTypes from "prop-types";
import SettingInputComponent from "./SettingInput";
import UserService from "../../../services/user";
import {getErrorMessage, strIsEmpty} from "../../../utils/misc";
import UpdateAvatarComponent from "./UpdateAvatar";

export default class ProfileSettingsComponent extends Component {

	constructor(props) {
		super(props);
		this.state = {
			user: this.props.user
		};
	}

	_validateInput = (text, title) => {
		if (strIsEmpty(text)) {
			return 'Field must not be empty.';
		}

		if (!text.match(/^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/)) {
			return title + ' must contain only letters.';
		}

		return null;
	}

	_validateFirstName = (text) => {
		return this._validateInput(text, 'First name');
	}

	_validateLastName = (text) => {
		return this._validateInput(text, 'Last name');
	}

	_makeSaveHandler = (text, handler, field) => {
		return (data, err) => {
			if (err) {
				handler(getErrorMessage(err));
			}
			else {
				let user = this.state.user;
				user[field] = text;
				UserService._setCurrentUser(user);
				this.setState({
					user: user
				});
				handler(null);
				if (field === 'first_name') {
					this.props.updateFullName(text, null);
				}
				else if (field === 'last_name') {
					this.props.updateFullName(null, text);
				}
			}
		}
	}

	_onClickSaveFirstName = (text, handler) => {
		UserService.editUser(
			this.state.user.id, text, null, null, null, null, this._makeSaveHandler(text, handler, 'first_name')
		);
	}

	_onClickSaveLastName = (text, handler) => {
		UserService.editUser(
			this.state.user.id, null, text, null, null, null, this._makeSaveHandler(text, handler, 'last_name')
		);
	}

	render() {
		return <div className="p-3">
			<div className="row">
				<div className="col-12 border-bottom mb-4">
					<small className="text-muted font-weight-bold">PROFILE INFORMATION</small>
				</div>
				<div className="col-12">
					<SettingInputComponent initialValue={this.state.user.first_name}
					                       title="First name (optional)"
					                       name="first-name"
					                       validateInput={this._validateFirstName}
					                       onSave={this._onClickSaveFirstName}/>
				</div>
				<div className="col-12">
					<SettingInputComponent initialValue={this.state.user.last_name}
					                       title="Last name (optional)"
					                       name="last-name"
					                       validateInput={this._validateLastName}
					                       onSave={this._onClickSaveLastName}/>
				</div>
			</div>
			<div className="row mt-4">
				<div className="col-12 border-bottom my-4">
					<small className="text-muted font-weight-bold">IMAGES</small>
				</div>
				<div className="col-12">
					<UpdateAvatarComponent user={this.state.user} updateAvatar={this.props.updateAvatar}/>
				</div>
			</div>
		</div>;
	}
}

PasswordVerificationComponent.propTypes = {
	user: PropTypes.object,
	updateAvatar: PropTypes.func,
	updateFullName: PropTypes.func
}
