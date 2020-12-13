import React, {Component} from "react";
import AuthService from "../../services/auth";
import {getErrorMessage, strIsEmpty} from "../../utils/misc";
import DrawerComponent from "../Drawer";
import PropTypes from "prop-types";
import "../../styles/common.css";

export default class LoginComponent extends Component {

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

	_getFieldsError = (username, password) => {
		let res = null;
		if (strIsEmpty(username)) {
			res = {
				usernameError: "This field is required."
			};
		}

		if (strIsEmpty(password)) {
			if (res === null) {
				res = {};
			}

			res['passwordError'] = "This field is required.";
		}

		return res;
	}

	_onChangeMakeFor = (field) => {
		return e => {
			let newState = {};
			newState[field] = e.target.value;
			newState[field + 'Error'] = undefined;
			this.setState(newState);
		}
	}

	_onClickLogin = (_) => {
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

	_onKeyDownLogin = (e) => {
		if (e.key.toLowerCase() === 'enter') {
			this._onClickLogin(e);
		}
	}

	render() {
		return <DrawerComponent title="SIGN IN"
		                        open={this.props.open}
		                        onRequestClose={this.props.onRequestClose}
		                        modalElementClass="container w-25 min-w-250">
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
							<label className="control-label" htmlFor="pwd">Password</label>
							<input
								type="password"
								className="form-control"
								name="password"
								value={this.state.password}
								onChange={this._onChangeMakeFor('password')}
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
							<button
								className="btn btn-primary btn-block"
								onClick={this._onClickLogin}
								disabled={this.state.loading}>
								{
									this.state.loading &&
									<span className="spinner-border spinner-border-sm"/>
								} Login
							</button>
						</div>
						<div className="text-center">
							<div className="d-inline">Do not have an account?</div>
							<button className="btn btn-link d-inline mb-1"
							        onClick={_ => this.props.onClickSwitchToRegister()}>Sign Up</button>
						</div>
					</div>
				</div>
			</div>
		</DrawerComponent>
	}
}

LoginComponent.propTypes = {
	onLoginSuccess: PropTypes.func,
	open: PropTypes.bool,
	onRequestClose: PropTypes.func,
	onClickSwitchToRegister: PropTypes.func
}
