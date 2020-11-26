import React, {Component} from "react";
import AuthService from "../services/auth";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import {required_field} from "./utils";

export default class Login extends Component {

	constructor(props) {
		super(props);
		this.handleLogin = this.handleLogin.bind(this);
		this.state = {
			username: "",
			password: "",
			loading: false,
			message: ""
		};
	}

	onChangeUsername(e) {
		this.setState({
			username: e.target.value
		});
	}

	onChangePassword(e) {
		this.setState({
			password: e.target.value
		});
	}

	handleLogin(e) {
		e.preventDefault();
		this.setState({
			message: "",
			loading: true
		});
		this.form.validateAll();
		if (this.checkBtn.context._errors.length === 0) {
			AuthService.login(this.state.username, this.state.password, (data, err) => {
				if (err) {
					this.setState({
						loading: false,
						message: err
					});
				}
				else {
					this.props.history.push("/");
					window.location.reload();
				}
			});
		}
		else {
			this.setState({
				loading: false
			});
		}
	}

	render() {
		return (
			<div className="row">
				<div className="col-sm-4">
					<Form className="form-horizontal" onSubmit={this.handleLogin}
					      ref={c => {
						      this.form = c;
					      }}>
						<div className="form-group">
							<label className="control-label" htmlFor="username">Username</label>
							<Input
								type="text"
								className="form-control"
								name="username"
								value={this.state.username}
								onChange={e => this.onChangeUsername(e)}
								validations={[required_field]}
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
								onChange={e => this.onChangePassword(e)}
								validations={[required_field]}
								placeholder="Type text..."
							/>
						</div>
						<div className="form-group">
							<button
								className="btn btn-primary btn-block"
								disabled={this.state.loading}>
								{this.state.loading && <span className="spinner-border spinner-border-sm"/>} Login
							</button>
						</div>
						{this.state.message && (
							<div className="form-group">
								<div className="alert alert-danger" role="alert">
									{this.state.message}
								</div>
							</div>
						)}
						<CheckButton
							style={{display: "none"}}
							ref={c => {
								this.checkBtn = c;
							}}
						/>
					</Form>
				</div>
			</div>
		);
	}
}
