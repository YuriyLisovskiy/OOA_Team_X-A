import React, {Component} from "react";
import PasswordVerificationComponent from "./PasswordVerification";
import PropTypes from "prop-types";
import ToggleSettingComponent from "./ToggleSetting";
import UserService from "../../../services/user";
import {getErrorMessage} from "../../../utils/misc";
import {Link} from "react-router-dom";

export default class PrivacyAndSafetySettingsComponent extends Component {

	_onToggleShowFullName = (value, handler) => {
		UserService.editUser(
			this.props.user.id, null, null, value, null, null, (data, err) => {
				if (!err) {
					let user = this.props.user;
					user.show_full_name = data.show_full_name;
					UserService._setCurrentUser(user);
					handler(data.show_full_name);
				}
				else {
					handler(!value);
				}
			}
		);
	}

	_onToggleShowRating = (value, handler) => {
		UserService.editUser(
			this.props.user.id, null, null, null, value, null, (data, err) => {
				if (!err) {
					let user = this.props.user;
					user.show_rating = data.show_rating;
					UserService._setCurrentUser(user);
					handler(data.show_rating);
				}
				else {
					handler(!value);
				}
			}
		);
	}

	_onToggleShowSubscriptions = (value, handler) => {
		UserService.editUser(
			this.props.user.id, null, null, null, null, value, (data, err) => {
				if (!err) {
					let user = this.props.user;
					user.show_subscriptions = data.show_subscriptions;
					UserService._setCurrentUser(user);
					handler(data.show_subscriptions);
				}
				else {
					handler(!value);
				}
			}
		);
	}

	constructor(props) {
		super(props);
		this.state = {
			blacklist: []
		}
	}

	componentDidMount() {
		UserService.getBlacklist(1, (data, err) => {
			if (err) {
				// TODO:
				alert(getErrorMessage(err));
			}
			else {
				this.setState({
					blacklist: data.results
				});
			}
		});
	}

	render() {
		return <div className="p-3">
			<div className="row">
				<div className="col-12 border-bottom mb-4">
					<small className="text-muted font-weight-bold">PRIVACY</small>
				</div>
				<div className="col-12">
					<ToggleSettingComponent title="Show full name"
					                        subtitle="Display first and last name on your account page."
					                        initialValue={this.props.user.show_full_name}
					                        onToggle={this._onToggleShowFullName}/>
				</div>
				<div className="col-12 mt-3">
					<ToggleSettingComponent title="Show rating"
					                        subtitle="Display rating on your account page."
					                        initialValue={this.props.user.show_rating}
					                        onToggle={this._onToggleShowRating}/>
				</div>
				<div className="col-12 mt-3">
					<ToggleSettingComponent title="Show subscriptions"
					                        subtitle="Display user who subscribed to your account."
					                        initialValue={this.props.user.show_subscriptions}
					                        onToggle={this._onToggleShowSubscriptions}/>
				</div>
			</div>
			<div className="row mt-4">
				<div className="col-12 border-bottom my-4">
					<small className="text-muted font-weight-bold">SAFETY</small>
				</div>
				<div className="col-12">
					<h6 className="text-left">People You've blocked</h6>
					<small className="form-text text-left text-muted">
						Blocked people can’t view your profile and artworks.
					</small>
				</div>
				<div className="col-12 pt-3">
					{
						this.state.blacklist.length > 0 ? (
							this.state.blacklist.map((user) => {
								return <Link to={'/profile/' + user.id} className="float-left">
									<div className="text-muted profile-photo">
										<img src={user.avatar_link} alt="Avatar" className="avatar-picture mr-2"/>
										<span className="d-inline">
											{
												user.first_name && user.last_name &&
												<span>{user.first_name} {user.last_name} [</span>
											}
											{user.username}
											{
												user.first_name && user.last_name &&
												"]"
											}
										</span>
									</div>
								</Link>;
							})
						) : (
							<div className="text-muted">NO USERS FOUND</div>
						)
					}
				</div>
			</div>
		</div>;
	}
}

PasswordVerificationComponent.propTypes = {
	user: PropTypes.object
}
