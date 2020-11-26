import React, {Component} from 'react';
import {Link, Route, Switch} from 'react-router-dom';

import './App.css';
import AuthService from "./services/auth";
import Login from "./components/login";
import Management from "./components/management";
import Register from "./components/register";
import Profile from "./components/profile";
import Home from "./components/home";
import Artwork from "./components/artwork";
import CreateArtwork from "./components/create_artwork";

export default class App extends Component {

	constructor(props) {
		super(props);
		this.handleLogOut = this.handleLogOut.bind(this);

		this.state = {
			currentUser: undefined
		};
	}

	componentDidMount() {
		const user = AuthService.getCurrentUser();
		if (user) {
			this.setState({
				currentUser: user
			});
		}
	}

	handleLogOut() {
		AuthService.logout();
		window.location = '/';
	}

	render() {
		const currentUser = this.state.currentUser;
		return (
			<div id="body">
				<nav className="navbar navbar-expand-md bg-light navbar-light">
					<Link className="navbar-brand" to='/'>
						<img height={50} src={process.env.PUBLIC_URL + '/logo225.png'} alt="LOGO"/> StudArt
					</Link>
					<button className="navbar-toggler" type="button" data-toggle="collapse"
					        data-target="#collapsibleNavbar">
						<span className="navbar-toggler-icon"/>
					</button>
					<div className="collapse navbar-collapse" id="collapsibleNavbar">
						<ul className="navbar-nav mr-auto">
							<li>
								<Link className='nav-link' to='/artwork/new'>
									<i className="fa fa-plus" aria-hidden="true"/> New Post
								</Link>
							</li>
							{currentUser && currentUser.is_superuser &&
								<li className="nav-item">
									<Link to='/management' className='btn nav-link'>Management</Link>
								</li>
							}
						</ul>
						{currentUser ? (
							<ul className="navbar-nav ml-auto">
								<li className="nav-item">
									<Link className='nav-link'
									      to={'/profile/' + currentUser.id}>{currentUser.username}
									</Link>
								</li>
								<li className="nav-item">
									<Link to='/' className='btn nav-link' onClick={this.handleLogOut}>Sign Out</Link>
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
						<Route path='/management' component={Management}/>
						<Route path='/register' component={Register} />
						<Route path='/profile/:id' component={Profile} />
						<Route path='/artwork/new' component={CreateArtwork} />
						<Route path='/artwork/:id' component={Artwork} />
						<Route path={['/', '/home']} component={Home} />
					</Switch>
				</div>
			</div>
		);
	}
}
