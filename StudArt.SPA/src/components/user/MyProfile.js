import ProfileComponent from "./Profile";
import UserProfile from "../../services/user";
import Errors from "../Errors";
import {Component} from "react";

export default class MyProfileComponent extends Component {

	constructor(props) {
		super(props);
		this.state = {
			currentUser: UserProfile.getCurrentUser()
		};
	}

	render() {
		return this.state.currentUser ? (
			<ProfileComponent currentUser={this.state.currentUser} {...this.props}/>
		) : <Errors.NotFound/>;
	}
}
