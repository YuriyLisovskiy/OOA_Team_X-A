import React, {Component} from "react";
import PasswordVerificationComponent from "./PasswordVerification";
import PropTypes from "prop-types";
import UserService from "../../../services/user";
import {emailIsValid, getErrorMessage} from "../../../utils/misc";

export default class ChangeEmailComponent extends Component {

	constructor(props) {
		super(props);
		this.state = {
			newEmail: this.props.user.email,
			newEmailError: undefined,
			newEmailDrawerIsOpen: false,
			user: this.props.user
		};
		this.confirmEmailChangeRef = React.createRef();
	}

	_onChangeMakeFor = (field) => {
		return e => {
			let newState = {};
			newState[field] = e.target.value;
			newState[field + 'Error'] = undefined;
			this.setState(newState);
		}
	}

	_onClickEmailDrawerToggle = () => {
		let {newEmailDrawerIsOpen} = this.state;
		this.setState({
			newEmailDrawerIsOpen: !newEmailDrawerIsOpen
		});
	}

	_onClickEmailSave = (_) => {
		if (!emailIsValid(this.state.newEmail)) {
			this.setState({
				newEmailError: 'Email field is empty or invalid.'
			});
		}
		else {
			this._onClickEmailDrawerToggle();
		}
	}

	_onClickConfirmEmailSaving = (_, password, finished) => {
		UserService.editEmail(
			this.state.user.id,
			this.state.newEmail,
			password,
			(resp, err) => {
				if (err) {
					this.confirmEmailChangeRef.current.setError(getErrorMessage(err));
				}
				else {
					let user = this.state.user;
					user.email = this.state.newEmail;
					this.setState({
						user: user,
						newEmailDrawerIsOpen: false
					});
					UserService._setCurrentUser(user);
					finished();
				}
			}
		);
	}

	render() {
		let emailIsSaved = this.state.user.email === this.state.newEmail;
		return <div>
			<PasswordVerificationComponent description="To change an email address you must verify this action by entering your current password."
			                               ref={this.confirmEmailChangeRef}
			                               open={this.state.newEmailDrawerIsOpen}
			                               onRequestClose={this._onClickEmailDrawerToggle}
			                               onClickConfirm={this._onClickConfirmEmailSaving}/>
			<div className="form-group">
				<label htmlFor="email"><h6>Email address</h6></label>
				<div className="input-group">
					<input type="text" className="form-control" name="email"
					       placeholder="Type email address..."
					       value={this.state.newEmail}
					       onChange={this._onChangeMakeFor('newEmail')}/>
					<div className="input-group-append"
					     title={emailIsSaved ? "Saved" : "Click to save an email address"}>
						<button className={"btn btn-" + (emailIsSaved ? "success" : "warning")}
						        onClick={this._onClickEmailSave}
						        disabled={emailIsSaved}>
							<div className="d-inline">
								<i className={"fa " + (emailIsSaved ? "fa-check-circle-o" : "fa-exclamation-triangle")}
								   aria-hidden="true"/>
							</div>
							{
								!emailIsSaved &&
								<div className="d-inline ml-2">Save</div>
							}
						</button>
					</div>
				</div>
				{
					this.state.newEmailError && <small className="form-text text-danger ml-1 mt-1">
						{this.state.newEmailError}
					</small>
				}
			</div>
		</div>;
	}
}

PasswordVerificationComponent.propTypes = {
	user: PropTypes.object
}
