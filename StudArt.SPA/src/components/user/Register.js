import React, {Component} from "react";
import AuthService from "../../services/auth";
import {getErrorMessage, getMessage, strIsEmpty} from "../../utils/misc";
import DrawerComponent from "../Drawer";
import PropTypes from "prop-types";

export default class RegisterComponent extends Component {

	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			username: "",
			email: "",
			password: "",
			passwordRepeat: "",
			registerError: undefined,
			usernameError: undefined,
			emailError: undefined,
			passwordError: undefined,
			passwordRepeatError: undefined
		};
	}

	_setPasswordsError = (password, passwordRepeat) => {
		if (password !== passwordRepeat) {
			this.setState({
				passwordRepeatError: 'Passwords do not match.'
			});
		}
	}

	_setError = (err) => {
		let msg = getErrorMessage(err);
		if (msg.email) {
			msg = msg.email[0];
		}

		this.setState({
			loading: false,
			registerError: msg
		});
	}

	_getFieldError = (name, field, res) => {
		if (strIsEmpty(field)) {
			if (res === null) {
				res = {};
			}

			res[name + 'Error'] = "This field is required.";
		}

		return res;
	}

	_getRegisterError = (username, email, password, passwordRepeat) => {
		let res = null;
		res = this._getFieldError('username', username, res);
		res = this._getFieldError('email', email, res);
		res = this._getFieldError('password', password, res);
		let passwordRepeatError = this._getFieldError('passwordRepeat', passwordRepeat, res);
		if (!passwordRepeatError && passwordRepeat !== password) {
			if (res === null) {
				res = {};
			}

			res.passwordRepeatError = "Passwords do not match.";
		}

		return res;
	}

	_onChangeMakeFor = (field) => {
		return e => {
			let state = {};
			let text = e.target.value;
			state[field] = text;
			state[field + 'Error'] = undefined;
			this.setState(state);
			return text;
		}
	}

	_onChangePassword = (e) => {
		this._setPasswordsError(
			this._onChangeMakeFor('password')(e), this.state.passwordRepeat
		);
	}

	_onChangePasswordRepeat = (e) => {
		this._setPasswordsError(
			this.state.password, this._onChangeMakeFor('passwordRepeat')(e)
		);
	}

	_onClickRegister = (_) => {
		this.setState({
			registerError: "",
			loading: true
		});
		let registerError = this._getRegisterError(
			this.state.username, this.state.email,
			this.state.password, this.state.passwordRepeat
		);
		if (!registerError) {
			let input = {
				username: this.state.username,
				email: this.state.email
			}
			AuthService.userExists(input, (data, err) => {
				if (err) {
					this._setError(err);
				}
				else {
					if (data.exists) {
						this.setState({
							registerError: getMessage(data),
							loading: false
						});
					}
					else {
						AuthService.register(
							this.state.username,
							this.state.email,
							this.state.password,
							(data, err) => {
								if (err) {
									this._setError(err);
								}
								else {
									this.props.onRegisterSuccess();
								}
							}
						);
					}
				}
			});
		}
		else {
			registerError.loading = false;
			this.setState(registerError);
		}
	}

	_onKeyDownLogin = (e) => {
		if (e.key.toLowerCase() === 'enter') {
			this._onClickRegister(e);
		}
	}

	render() {
		return <DrawerComponent title="REGISTER AN ACCOUNT"
		                        open={this.props.open}
		                        onRequestClose={this.props.onRequestClose}
		                        modalElementClass="container w-30 min-w-300">
			{
				this.state.registerError &&
				<div className="form-group">
					<div className="alert alert-danger" role="alert">
						{this.state.registerError}
					</div>
				</div>
			}
			<div className="row">
				<div className="col-md-12">
					<div className="form-group">
						<label className="control-label" htmlFor="username">
							Username <span className="text-danger">*</span></label>
						<input
							type="text"
							className="form-control"
							name="username"
							value={this.state.username}
							onChange={this._onChangeMakeFor('username')}
							placeholder="Type text..."
							onKeyDown={this._onKeyDownLogin}
						/>
						{
							this.state.usernameError && <small className="form-text text-danger ml-1 mt-1">
								{this.state.usernameError}
							</small>
						}
					</div>
					<div className="form-group">
						<label className="control-label" htmlFor="email">
							Email <span className="text-danger">*</span></label>
						<input
							type="email"
							className="form-control"
							name="email"
							value={this.state.email}
							onChange={this._onChangeMakeFor('email')}
							placeholder="Type text..."
							onKeyDown={this._onKeyDownLogin}
						/>
						{
							this.state.emailError && <small className="form-text text-danger ml-1 mt-1">
								{this.state.emailError}
							</small>
						}
					</div>
					<div className="form-group">
						<label className="control-label" htmlFor="password">
							Password <span className="text-danger">*</span></label>
						<input
							type="password"
							className="form-control"
							name="password"
							value={this.state.password}
							onChange={this._onChangePassword}
							placeholder="Type text..."
							onKeyDown={this._onKeyDownLogin}
						/>
						{
							this.state.passwordError && <small className="form-text text-danger ml-1 mt-1">
								{this.state.passwordError}
							</small>
						}
					</div>
					<div className="form-group">
						<label className="control-label" htmlFor="password_repeat">
							Repeat password <span className="text-danger">*</span></label>
						<input
							type="password"
							className="form-control"
							name="password_repeat"
							value={this.state.passwordRepeat}
							onChange={this._onChangePasswordRepeat}
							placeholder="Type text..."
							onKeyDown={this._onKeyDownLogin}
						/>
						{
							this.state.passwordRepeatError && <small className="form-text text-danger ml-1 mt-1">
								{this.state.passwordRepeatError}
							</small>
						}
					</div>
					<div className="form-group">
						<button
							className="btn btn-primary btn-block"
							onClick={this._onClickRegister}
							disabled={this.state.loading}>
							{
								this.state.loading &&
								<span className="spinner-border spinner-border-sm"/>
							} Sign Up
						</button>
					</div>
					<div className="text-center">
						<div className="d-inline">Already on StudArt?</div>
						<button className="btn btn-link d-inline mb-1"
						        onClick={_ => this.props.onClickSwitchToLogin()}>Sign In</button>
					</div>
				</div>
			</div>
		</DrawerComponent>;
	}
}

RegisterComponent.propTypes = {
	onRegisterSuccess: PropTypes.func,
	open: PropTypes.bool,
	onRequestClose: PropTypes.func,
	onClickSwitchToLogin: PropTypes.func
}
