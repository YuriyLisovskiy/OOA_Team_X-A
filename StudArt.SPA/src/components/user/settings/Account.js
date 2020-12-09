import React, {Component} from "react";
import PasswordVerificationComponent from "./PasswordVerification";
import PropTypes from "prop-types";
import ChangeEmailComponent from "./ChangeEmail";
import ChangePasswordComponent from "./ChangePassword";

export default class AccountSettingsComponent extends Component {

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
					<button className="btn btn-outline-danger">
						DEACTIVATE ACCOUNT (TODO)
					</button>
				</div>
			</div>
		</div>;
	}
}

PasswordVerificationComponent.propTypes = {
	user: PropTypes.object
}
