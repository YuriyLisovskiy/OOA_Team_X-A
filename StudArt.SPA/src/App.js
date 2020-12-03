import React, {Component} from 'react';
import {Link, Route, Switch} from 'react-router-dom';

import './App.css';
import AuthService from "./services/auth";
import Login from "./components/login";
import Register from "./components/register";
import Profile from "./components/user/profile";
import Home from "./components/home";
import Artwork from "./components/artwork/artwork";
import CreateArtwork from "./components/artwork/create";
import Index from "./components/Index";
import NotFound from "./components/not_found";

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
		const user = this.state.currentUser;
		return (
			<div id="body" className="pb-5">
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
							{
								user &&
								<li>
									<Link className='nav-link' to='/new/artwork'>
										<i className="fa fa-plus" aria-hidden="true"/> New Post
									</Link>
								</li>
							}
						</ul>
						{user ? (
							<ul className="navbar-nav ml-auto">
								<li className="nav-item">
									<Link className='nav-link'
									      to={'/profile/' + user.id}>{user.username}
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
						{
							!user && <Route path='/login' component={Login}/>
						}
						{
							!user && <Route path='/register' component={Register} />
						}
						{
							user && <Route path='/new/artwork' component={CreateArtwork} />
						}
						<Route path='/profile/:id' component={Profile} />
						<Route path='/artwork/:id' component={Artwork} />
						<Route path='/artworks' component={Home} />
						<Route path='/page-not-found' component={NotFound} />
						<Route path={['/', '/home']} component={Index} />
					</Switch>
				</div>
			</div>
		);
	}
}
