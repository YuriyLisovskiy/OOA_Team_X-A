import React, {Component} from "react";
import PasswordVerificationComponent from "./PasswordVerification";
import PropTypes from "prop-types";
import ChangeEmailComponent from "./ChangeEmail";
import ChangePasswordComponent from "./ChangePassword";
import UserService from "../../../services/user";
import AuthService from "../../../services/auth";
import {getErrorMessage} from "../../../utils/misc";

export default class AccountSettingsComponent extends Component {

	constructor(props) {
		super(props);
		this.state = {
			deactivateDrawerIsOpen: false
		};
		this.confirmDeactivateRef = React.createRef();
	}

	_onClickDeactivateToggle = () => {
		let {deactivateDrawerIsOpen} = this.state;
		this.setState({
			deactivateDrawerIsOpen: !deactivateDrawerIsOpen
		});
	}

	_onClickDeactivateConfirm = (_, password, finished) => {
		UserService.deactivateMe(this.props.user.id, password, (resp, err) => {
			if (err) {
				this.confirmDeactivateRef.current.setError(getErrorMessage(err));
			}
			else {
				AuthService.logout();
				window.location = '/';
			}

			finished();
		});
	}

	render() {
		return <div className="p-3">
			<div className="row">
				<div className="col-12 border-bottom mb-4">
					<small className="text-muted font-weight-bold">ACCOUNT PREFERENCES</small>
				</div>
				<div className="col-12">
					<ChangeEmailComponent user={this.props.user}/>
				</div>
				<div className="col-12 mt-4">
					<ChangePasswordComponent user={this.props.user}/>
				</div>
			</div>
			<div className="row mt-4">
				<div className="col-12 border-bottom my-4">
					<small className="text-muted font-weight-bold">DEACTIVATE ACCOUNT</small>
				</div>
				<div className="col-12 text-right">
					<PasswordVerificationComponent description={
						<div className="text-left text-justify">
							<ul>
								<li>
									Deactivating your account will not delete the content of posts and
									comments you've made on StudArt. To do so please delete them individually.
								</li>
								<li className="mt-3">Deactivated accounts are not recoverable.</li>
							</ul>
						</div>
					}
					                               ref={this.confirmDeactivateRef}
					                               open={this.state.deactivateDrawerIsOpen}
					                               modalElementClass="container w-30 min-w-300"
					                               onRequestClose={this._onClickDeactivateToggle}
					                               onClickConfirm={this._onClickDeactivateConfirm}/>
					<button className="btn btn-outline-danger" onClick={this._onClickDeactivateToggle}>
						DEACTIVATE ACCOUNT
					</button>
				</div>
			</div>
		</div>;
	}
}

PasswordVerificationComponent.propTypes = {
	user: PropTypes.object
}
