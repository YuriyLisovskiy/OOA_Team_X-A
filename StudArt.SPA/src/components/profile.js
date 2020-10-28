import React, {Component} from "react";
import UserService from "../services/user.service";

export default class Profile extends Component {
	constructor(props) {
		super(props);
		// this.handleRegister = this.handleRegister.bind(this);
		this.state = {
			user: undefined
		}
	}

	componentDidMount() {
		UserService.getUser(this.props.match.params.id).then(
			resp => {
				console.log(resp);
				this.setState({
					user: resp.data
				})
			},
			err => {
				console.log(err)
			}
		)
	}

	render() {
		return (
			<div>
				{this.state.user ? (
					<h2>{this.state.user.username}</h2>
				) : (
					<h2>USER</h2>
				)}
			</div>
		);
	}
}
