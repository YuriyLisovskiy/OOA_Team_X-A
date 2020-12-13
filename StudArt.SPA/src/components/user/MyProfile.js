import ProfileComponent from "./Profile";
import UserProfile from "../../services/user";
import Errors from "../Errors";

export default class MyProfileComponent extends ProfileComponent {

	constructor(props) {
		super(props);
		this.state = {
			user: UserProfile.getCurrentUser()
		};
	}

	render() {
		return this.state.user ? super.render() : <Errors.NotFound/>;
	}
}
