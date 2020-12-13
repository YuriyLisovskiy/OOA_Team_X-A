import React, {Component} from "react";
import DrawerComponent from "../../Drawer";
import PropTypes from "prop-types";
import UserService from "../../../services/user";
import {checkPassword, getErrorMessage, requiredFieldError} from "../../../utils/misc";

export default class ChangePasswordComponent extends Component {

	constructor(props) {
		super(props);
		this.state = {
			oldPassword: "",
			oldPasswordError: undefined,
			newPassword: "",
			newPasswordError: undefined,
			newPasswordRepeat: "",
			newPasswordRepeatError: undefined,
			loading: false,
			drawerIsOpen: false
		};
	}

	_onChangeMakeFor = (field, validationFunc) => {
		return e => {
			let state = {};
			let text = e.target.value;
			state[field] = text;
			state[field + 'Error'] = validationFunc ? validationFunc(text) : undefined;
			this.setState(state);
			return text;
		}
	}

	// _getFieldError = (name, field, res) => {
	// 	if (strIsEmpty(field)) {
	// 		if (res === null) {
	// 			res = {};
	// 		}
	//
	// 		res[name + 'Error'] = "This field is required.";
	// 	}
	//
	// 	return res;
	// }

	_getFieldError = (name, getErrorFunc, res) => {
		let errMessage = getErrorFunc();
		if (errMessage) {
			if (res === null) {
				res = {};
			}

			let currError = res[name + 'Error'];
			if (!currError) {
				res[name + 'Error'] = errMessage;
			}
		}

		return res;
	}

	_getNewPasswordError = (newPassword, res) => {
		res = this._getFieldError(
			'newPassword', _ => requiredFieldError(this.state.newPassword), res
		);
		res = this._getFieldError(
			'newPassword', _ => checkPassword(this.state.newPassword), res
		);
		return res;
	}

	_getPasswordsErrors = () => {
		let res = null;
		res = this._getFieldError(
			'oldPassword', _ => requiredFieldError(this.state.oldPassword), res
		);
		res = this._getNewPasswordError(this.state.newPassword, res);
		res = this._getFieldError(
			'newPasswordRepeat', _ => {
				return this.state.newPasswordRepeat !== this.state.newPassword ? (
					'Passwords do not match.'
				) : undefined;
			}, res
		);
		return res;
	}

	_clearFieldsAndCloseDrawer = () => {
		this.setState({
			oldPassword: "",
			oldPasswordError: undefined,
			newPassword: "",
			newPasswordError: undefined,
			newPasswordRepeat: "",
			newPasswordRepeatError: undefined,
			drawerIsOpen: false,
			errorMessage: undefined,
			loading: false
		});
	}

	_setPasswordsError = (password, passwordRepeat) => {
		if (password !== passwordRepeat) {
			this.setState({
				newPasswordRepeatError: 'Passwords do not match.'
			});
		}
	}

	_onChangeNewPassword = (e) => {
		this._setPasswordsError(
			this._onChangeMakeFor('newPassword', checkPassword)(e), this.state.newPasswordRepeat
		);
	}

	_onChangeNewPasswordRepeat = (e) => {
		this._setPasswordsError(
			this.state.newPassword, this._onChangeMakeFor('newPasswordRepeat')(e)
		);
	}

	_onClickCancel = (_) => {
		this._clearFieldsAndCloseDrawer();
	}

	_onClickConfirm = (_) => {
		let errors = this._getPasswordsErrors();
		if (!errors) {
			this.setState({
				loading: true
			});
			UserService.editPassword(
				this.props.user.id,
				this.state.oldPassword,
				this.state.newPassword,
				(resp, err) => {
					if (err) {
						this.setState({
							errorMessage: getErrorMessage(err),
							loading: false
						});
					}
					else {
						this._clearFieldsAndCloseDrawer();
					}
				}
			);
		}
		else {
			this.setState(errors);
		}
	}

	_onClickDrawerToggle = () => {
		let {drawerIsOpen} = this.state;
		this.setState({
			drawerIsOpen: !drawerIsOpen
		});
	}

	render() {
		return <div className="row">
			<div className="col-8">
				<h6>Change password</h6>
				<small className="form-text text-secondary">
					Password must be at least 8 characters long
				</small>
			</div>
			<div className="col-4 text-right">
				<button className="btn btn-outline-success" onClick={this._onClickDrawerToggle}>
					Change
				</button>
			</div>
			<DrawerComponent title="UPDATE YOUR PASSWORD"
			                 open={this.state.drawerIsOpen}
			                 onRequestClose={this._onClickDrawerToggle}
			                 modalElementClass="container w-30 min-w-300">
				{
					this.state.errorMessage &&
					<div className="form-group">
						<div className="alert alert-danger" role="alert">
							{this.state.errorMessage}
						</div>
					</div>
				}
				<div className="form-group">
					<label htmlFor="old-password">
						Old password <span className="text-danger">*</span>
					</label>
					<input type="password" name="old-password" className="form-control"
					       placeholder="Type text..." onChange={this._onChangeMakeFor('oldPassword')}/>
					{
						this.state.oldPasswordError &&
						<small className="form-text text-danger ml-1 mt-1">
							{this.state.oldPasswordError}
						</small>
					}
				</div>
				<div className="form-group">
					<label htmlFor="new-password">
						New password <span className="text-danger">*</span>
					</label>
					<input type="password" name="new-password" className="form-control"
					       placeholder="Type text..." onChange={this._onChangeNewPassword}/>
					{
						this.state.newPasswordError &&
						<small className="form-text text-danger ml-1 mt-1">
							{this.state.newPasswordError}
						</small>
					}
				</div>
				<div className="form-group">
					<label htmlFor="new-password-repeat">
						Confirm new password <span className="text-danger">*</span>
					</label>
					<input type="password" name="new-password-repeat" className="form-control"
					       placeholder="Type text..." onChange={this._onChangeNewPasswordRepeat}/>
					{
						this.state.newPasswordRepeatError &&
						<small className="form-text text-danger ml-1 mt-1">
							{this.state.newPasswordRepeatError}
						</small>
					}
				</div>
				<div className="text-right">
					<button className="btn btn-outline-danger d-inline"
					        onClick={this._onClickCancel}>Cancel</button>
					<button className="btn btn-primary d-inline ml-1"
					        onClick={this._onClickConfirm}
					        disabled={this.state.loading}>
						{
							this.state.loading &&
							<span className="spinner-border spinner-border-sm"/>
						} Change
					</button>
				</div>
			</DrawerComponent>
		</div>;
	}
}

ChangePasswordComponent.propTypes = {
	user: PropTypes.object
}
