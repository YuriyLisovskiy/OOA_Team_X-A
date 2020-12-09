import React, {Component} from "react";
import {Tab, Tabs} from "react-bootstrap";
import UserService from "../../../services/user"
import AccountSettingsComponent from "./Account";
import ProfileSettingsComponent from "./Profile";
import PrivacyAndSafetySettingsComponent from "./PrivacyAndSafety";
import PropTypes from "prop-types";

export default class SettingsComponent extends Component {

	constructor(props) {
		super(props);
		this.state = {
			user: UserService.getCurrentUser()
		};
	}

	render() {
		return <div className="bg-white rounded p-4">
			<div className="row mb-4">
				<h5 className="col-12">
					<i className="fa fa-cog" aria-hidden="true"/>
					<div className="ml-2 d-inline">User settings</div>
				</h5>
			</div>
			<div className="row">
				<div className="col-12">
					<Tabs defaultActiveKey="account" transition={false} activeKey={this.props.activeKey} onSelect={
						key => this.props.history.push('/settings/' + key)
					}>
						<Tab eventKey="account" title="Account" tabClassName="text-secondary">
							<AccountSettingsComponent user={this.state.user}/>
						</Tab>
						<Tab eventKey="profile" title="Profile" tabClassName="text-secondary">
							<ProfileSettingsComponent user={this.state.user}
							                          updateFullName={this.props.updateFullName}
							                          updateAvatar={this.props.updateAvatar}/>
						</Tab>
						<Tab eventKey="privacy-and-safety" title="Privacy & Safety" tabClassName="text-secondary">
							<PrivacyAndSafetySettingsComponent user={this.state.user}/>
						</Tab>
					</Tabs>
				</div>
			</div>
		</div>;
	}
}

SettingsComponent.propTypes = {
	updateAvatar: PropTypes.func,
	updateFullName: PropTypes.func,
	activeKey: PropTypes.string
}
