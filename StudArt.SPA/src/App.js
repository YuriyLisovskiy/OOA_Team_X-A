import React, {Component} from 'react';
import {Link, Route, Switch} from 'react-router-dom';

import './App.css';
import AuthService from "./services/AuthService";
import Login from "./components/login";

export default class App extends Component {

	constructor(props) {
		super(props);
		this.logOut = this.logOut.bind(this);

		this.state = {
			// showModeratorBoard: false,
			// showAdminBoard: false,
			currentUser: undefined,
		};
	}

	componentDidMount() {
		const user = AuthService.getCurrentUser();
		if (user) {
			this.setState({
				currentUser: user,
				// showModeratorBoard: user.roles.includes("ROLE_MODERATOR"),
				// showAdminBoard: user.roles.includes("ROLE_ADMIN"),
			});
		}
	}

	logOut() {
		AuthService.logout();
		window.location = '/';
	}

	render() {
		// const {currentUser, showModeratorBoard, showAdminBoard} = this.state;
		const {currentUser} = this.state;
		return (
			<div>
				<nav className="navbar navbar-expand-md bg-dark navbar-dark">
					<Link className="navbar-brand" to='/'>StudArt</Link>
					<button className="navbar-toggler" type="button" data-toggle="collapse"
					        data-target="#collapsibleNavbar">
						<span className="navbar-toggler-icon"/>
					</button>
					<div className="collapse navbar-collapse" id="collapsibleNavbar">
						{currentUser ? (
							<ul className="navbar-nav ml-auto">
								<li className="nav-item">
									<Link className='nav-link'
									      to={'/user/' + currentUser.id}>{currentUser.username}
									</Link>
								</li>
								<li className="nav-item">
									<Link to='/' className='btn nav-link' onClick={this.logOut}>Sign Out</Link>
								</li>
							</ul>
						) : (
							<ul className='navbar-nav ml-auto'>
								<li className="nav-item">
									<Link className='nav-link' to='/login'>Login</Link>
								</li>
								<li className="nav-item">
									<Link className='nav-link' to='/register'>Sign Up</Link>
								</li>
							</ul>
						)}
					</div>
				</nav>
				<div className='container mt-3'>
					<Switch>
						<Route path='/login' component={Login}/>
						{/*<Route path='/register' component={SignupForm} />*/}
					</Switch>
				</div>
			</div>
		);
	}
}
