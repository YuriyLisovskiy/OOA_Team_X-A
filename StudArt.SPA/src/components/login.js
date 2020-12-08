import React, {Component} from "react";
import AuthService from "../services/auth";
import {getErrorMessage} from "./utils";

export default class Login extends Component {

	constructor(props) {
		super(props);
		this.state = {
			username: "",
			password: "",
			loading: false,
			loginError: undefined,
			usernameError: undefined,
			passwordError: undefined
		};
	}

	onChangeUsername = (e) => {
		this.setState({
			username: e.target.value,
			usernameError: undefined
		});
	}

	onChangePassword = (e) => {
		this.setState({
			password: e.target.value,
			passwordError: undefined
		});
	}

	_getFieldsError = (username, password) => {
		let res = null;
		if (!username || username.length === 0) {
			res = {
				usernameError: "This field is required."
			};
		}

		if (!password || password.length === 0) {
			if (res === null) {
				res = {};
			}

			res['passwordError'] = "This field is required.";
		}

		return res;
	}

	handleLogin = (e) => {
		this.setState({
			loginError: undefined,
			loading: true
		});
		let fieldsError = this._getFieldsError(this.state.username, this.state.password);
		if (!fieldsError) {
			AuthService.login(this.state.username, this.state.password, (data, err) => {
				if (err) {
					let msg = getErrorMessage(err);
					this.setState({
						loading: false,
						loginError: (msg && msg.detail) || "Invalid credentials."
					});
				}
				else {
					this.props.onLoginSuccess();
				}
			});
		}
		else {
			fieldsError['loading'] = false;
			this.setState(fieldsError);
		}
	}

	render() {
		return (
			<div className="bg-white p-3 rounded">
				<div className="row">
					<div className="col-md-12 text-center mb-3 font-weight-bold">
						SIGN IN
					</div>
				</div>
				{
					this.state.loginError &&
					<div className="form-group">
						<div className="alert alert-danger" role="alert">
							{this.state.loginError}
						</div>
					</div>
				}
				<div className="row">
					<div className="col-md-12">
						<div className="form-horizontal">
							<div className="form-group">
								<label className="control-label" htmlFor="username">Username</label>
								<input
									type="text"
									className="form-control"
									name="username"
									value={this.state.username}
									onChange={this.onChangeUsername}
									placeholder="Type text..."
								/>
								{
									this.state.usernameError && <small className="form-text text-danger ml-1 mt-1">
										{this.state.usernameError}
									</small>
								}
							</div>
							<div className="form-group">
								<label className="control-label" htmlFor="pwd">Password</label>
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
								<button
									className="btn btn-primary btn-block"
									onClick={this.handleLogin}
									disabled={this.state.loading}>
									{
										this.state.loading &&
										<span className="spinner-border spinner-border-sm"/>
									} Login
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
