import React, {Component} from "react";
import UserService from "../services/user";
import Home from "./home";

export default class Profile extends Component {

	constructor(props) {
		super(props);
		// this.handleRegister = this.handleRegister.bind(this);
		this.state = {
			user: undefined
		}
	}

	componentDidMount() {
		UserService.getUser(this.props.match.params.id, (data, err) => {
			if (err) {
				console.log(err);
			}
			else {
				this.setState({
					user: data
				});
			}
		});
		//TODO: get artworks by user id
	}

	render() {
		return (
			<div>
				<div className="col-8 flex-column">
					<Home columnsCount={2}/>
				</div>
				<div className="col-3 flex-column ">
					<div className=" rounded bg-white h-25 w-100 pt-2 align-content-center">
						{this.state.user ? (
						<img src={this.state.user.avatar} alt="Avatar" className="avatar-picture"/>)
							:(<img src="https://i.pinimg.com/564x/7f/17/5b/7f175b43dbf76a8b958e1c7726a7ddea.jpg" alt="Avatar" className="avatar-picture rounded-circle"/>
							)}
						{this.state.user ? (
								<h2>{this.state.user.username}</h2>)
							:(<h2>User</h2>
							)}
						{this.state.user ? (
								<p>{this.state.user.description}</p>)
							:(<p>This is user's description of their profile Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet Lorem ipsum dolor sit amet</p>
							)}
						{this.state.user ? (
								<div>{this.state.user.activeTags}</div>)
							:(<div>
									<span className="pl-1 pr-1 ml-1 mr-1 badge badge-pill badge-dark">tag 1</span>
									<span className="pl-1 pr-1 ml-1 mr-1 badge badge-pill badge-dark">tag 2</span>
									<span className="pl-1 pr-1 ml-1 mr-1 badge badge-pill badge-dark">tag 3</span>
									<span className="pl-1 pr-1 ml-1 mr-1 badge badge-pill badge-dark">long tag</span>
									<span className="pl-1 pr-1 ml-1 mr-1 badge badge-pill badge-dark">VERY very VERY LONG TAG</span>
								</div>
							)}
					</div>
					<div  className=" rounded bg-white h-25 w-100 pt-2 align-content-center">

					</div>
				</div>
			</div>
		);
	}
}
