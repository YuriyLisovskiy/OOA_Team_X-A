import React, {Component} from "react";
import AuthService from "../services/auth.service";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import {required_field} from "./utils";

export default class Register extends Component {
	constructor(props) {
		super(props);
		this.handleRegister = this.handleRegister.bind(this);
		this.required_password_match = this.required_password_match.bind(this);
		this.user_already_exists = this.user_already_exists.bind(this);

		this.state = {
			username: "",
			email: "",
			password: "",
			loading: false,
			message: "",
			user_exists_error: undefined,
		};
	}

	onChange(field) {
		return e => {
			let state = {};
			state[field] = e.target.value;
			if (field === 'username' || field === 'email') {
				state['user_exists_error'] = undefined;
			}

			this.setState(state);
		}
	}

	required_password_match(value) {
		if (value !== this.state.password) {
			return (<div className="text-danger"><small>Passwords do not match.</small></div>);
		}
	};

	user_already_exists(value) {
		if (this.state.user_exists_error) {
			return (<div className="text-danger"><small>{this.state.user_exists_error}.</small></div>);
		}
	}

	getMessage = (r) => {
		return (r.response && r.response.data && r.response.data.message) || r.message || r.data.message || r.toString();
	}

	setError = (err) => {
		this.setState({
			loading: false,
			message: this.getMessage(err)
		});
	}

	handleRegister(e) {
		e.preventDefault();
		this.setState({
			message: "",
			loading: true
		});

		this.form.validateAll();
		if (this.checkBtn.context._errors.length === 0) {
			AuthService.checkUserExistsBy({
				username: this.state.username,
				email: this.state.email
			}).then(
				(resp) => {
					if (resp.data && resp.data.exists) {
						this.setState({
							user_exists_error: this.getMessage(resp),
							loading: false
						});
					}
					else {
						AuthService.register(
							this.state.username, this.state.email, this.state.password
						).then(
							() => {
								this.props.history.push("/");
								window.location.reload();
							},
							error => this.setError(error)
						);
					}
				},
				error => this.setError(error)
			)
		} else {
			this.setState({
				loading: false
			});
		}
	}

	render() {
		return (
			<div className="row">
				<div className="col-sm-5">
					<Form onSubmit={this.handleRegister} ref={c => {this.form = c;}}>
						<div className="form-group">
							<label className="control-label" htmlFor="username">Username</label>
							<Input
								type="text"
								className="form-control"
								name="username"
								value={this.state.username}
								onChange={this.onChange('username')}
								validations={[required_field, this.user_already_exists]}
								placeholder="Type text..."
							/>
						</div>
						<div className="form-group">
							<label className="control-label" htmlFor="pwd">Email</label>
							<Input
								type="email"
								className="form-control"
								name="email"
								value={this.state.email}
								onChange={this.onChange('email')}
								validations={[required_field, this.user_already_exists]}
								placeholder="Type text..."
							/>
						</div>
						<div className="form-group">
							<label className="control-label" htmlFor="pwd">Password</label>
							<Input
								type="password"
								className="form-control"
								name="password"
								value={this.state.password}
								onChange={this.onChange('password')}
								validations={[required_field]}
								placeholder="Type text..."
							/>
						</div>
						<div className="form-group">
							<label className="control-label" htmlFor="pwd">Repeat password</label>
							<Input
								type="password"
								className="form-control"
								name="password_repeat"
								validations={[required_field, this.required_password_match]}
								placeholder="Type text..."
							/>
						</div>
						<div className="form-group">
							<button
								className="btn btn-primary btn-block"
								disabled={this.state.loading}>
								{this.state.loading && <span className="spinner-border spinner-border-sm"/>} Sign Up
							</button>
						</div>
						{this.state.message && (
							<div className="form-group">
								<div className="alert alert-danger" role="alert">
									{this.state.message}
								</div>
							</div>
						)}
						<CheckButton style={{display: "none"}} ref={c => {this.checkBtn = c;}}/>
					</Form>
				</div>
			</div>
		);
	}
}
