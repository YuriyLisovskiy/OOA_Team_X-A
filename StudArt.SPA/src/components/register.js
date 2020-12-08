import React, {Component} from "react";
import AuthService from "../services/auth";
import {getErrorMessage, getMessage} from "./utils";

export default class Register extends Component {

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

	_getFieldError = (name, field, res) => {
		if (!field || field.length === 0) {
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

			res['passwordRepeatError'] = "Passwords do not match.";
		}

		return res;
	}

	onChange = (field) => {
		return e => {
			let state = {};
			let text = e.target.value;
			state[field] = text;
			state[field + 'Error'] = undefined;
			this.setState(state);
			return text;
		}
	}

	onChangePassword = (e) => {
		this._setPasswordsError(this.onChange('password')(e), this.state.passwordRepeat);
	}

	onChangePasswordRepeat = (e) => {
		this._setPasswordsError(this.state.password, this.onChange('passwordRepeat')(e));
	}

	setError = (err) => {
		let msg = getErrorMessage(err);
		if (msg.email) {
			msg = msg.email[0];
		}

		this.setState({
			loading: false,
			registerError: msg
		});
	}

	handleRegister = (e) => {
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
					this.setError(err);
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
									this.setError(err);
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

	render() {
		return (
			<div className="bg-white p-3 rounded">
				<div className="row">
					<div className="col-md-12 text-center mb-3 font-weight-bold">
						REGISTER AN ACCOUNT
					</div>
				</div>
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
						<form onSubmit={e => e.preventDefault()}>
							<div className="form-group">
								<label className="control-label" htmlFor="username">
									Username <span className="text-danger">*</span></label>
								<input
									type="text"
									className="form-control"
									name="username"
									value={this.state.username}
									onChange={this.onChange('username')}
									placeholder="Type text..."
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
									onChange={this.onChange('email')}
									placeholder="Type text..."
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
									onChange={this.onChangePassword}
									placeholder="Type text..."
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
									onChange={this.onChangePasswordRepeat}
									placeholder="Type text..."
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
									onClick={this.handleRegister}
									disabled={this.state.loading}>
									{
										this.state.loading &&
										<span className="spinner-border spinner-border-sm"/>
									} Sign Up
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		);
	}
}
