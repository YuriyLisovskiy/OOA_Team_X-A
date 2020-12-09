import React, {Component} from 'react';
import {Link, Route, Switch} from 'react-router-dom';

import './styles/app.css';
import AuthService from "./services/auth";
import RegisterComponent from "./components/user/Register";
import ProfileComponent from "./components/user/Profile";
import HomeComponent from "./components/Home";
import ArtworkComponent from "./components/artwork/Artwork";
import CreateArtworkComponent from "./components/artwork/Create";
import IndexComponent from "./components/Index";
import NotFound from "./components/errors";
import {Dropdown, NavDropdown} from "react-bootstrap";
import SettingsComponent from "./components/user/settings/Settings";
import DropdownItem from "react-bootstrap/DropdownItem";
import UserService from "./services/user";
import LoginComponent from "./components/user/Login";

export default class App extends Component {

	constructor(props) {
		super(props);
		this.handleLogOut = this.handleLogOut.bind(this);
		this.state = {
			currentUser: undefined,
			loginIsOpen: false,
			registerIsOpen: false
		};
	}

	componentDidMount() {
		UserService.getMe((user, err) => {
			if (err) {
				// mute error
			}
			else {
				this.setState({
					currentUser: user
				});
			}
		});
	}

	handleLogOut() {
		AuthService.logout();
		window.location = '/';
	}

	onClickLoginToggle = () => {
		let {loginIsOpen} = this.state;
		this.setState({
			loginIsOpen: !loginIsOpen,
			registerIsOpen: false
		});
	}

	onClickRegisterToggle = () => {
		let {registerIsOpen} = this.state;
		this.setState({
			loginIsOpen: false,
			registerIsOpen: !registerIsOpen
		});
	}

	onLoginSuccess = () => {
		window.location = '/';
	}

	onRegisterSuccess = () => {
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
								<NavDropdown title={
									<div className="d-inline">
										<div className="text-muted profile-photo d-inline">
											<img src={user.avatar_link}
											     alt="Avatar"
											     className="avatar-picture mr-2"/>
											<div className="d-inline font-weight-bold">{user.username}</div>
										</div>
									</div>
								} id="basic-nav-dropdown">
									{
										user.first_name && user.last_name &&
										<div>
											<Dropdown.ItemText>
												<div className="font-weight-bold">
													{user.first_name} {user.last_name}
												</div>
											</Dropdown.ItemText>
											<NavDropdown.Divider/>
										</div>
									}
									<Dropdown.Item as={Link} to={'/profile/' + user.id}>
										<i className="fa fa-user-circle-o" aria-hidden="true"/> My Profile
									</Dropdown.Item>
									<Dropdown.Item as={Link} to={'/settings/account'}>
										<i className="fa fa-cog" aria-hidden="true"/> User Settings
									</Dropdown.Item>
									<NavDropdown.Divider/>
									<DropdownItem as={Link} to='/' onClick={this.handleLogOut}>
										<i className="fa fa-sign-out" aria-hidden="true"/> Sign Out
									</DropdownItem>
								</NavDropdown>
							</ul>
						) : (
							<ul className='navbar-nav ml-auto'>
								<li className="nav-item mr-2">
									<button className="btn btn-outline-primary"
									        onClick={this.onClickLoginToggle}>
										LOGIN
									</button>
								</li>
								<li className="nav-item">
									<button className="btn btn-primary"
									        onClick={this.onClickRegisterToggle}>
										SIGN UP
									</button>
								</li>
							</ul>
						)}
					</div>
				</nav>
				<div className="container mt-3 w-65">
					<LoginComponent onLoginSuccess={this.onLoginSuccess}
					                open={this.state.loginIsOpen}
						            onRequestClose={this.onClickLoginToggle}
						            onClickSwitchToRegister={this.onClickRegisterToggle}/>
					<RegisterComponent onRegisterSuccess={this.onRegisterSuccess}
					                   open={this.state.registerIsOpen}
					                   onRequestClose={this.onClickRegisterToggle}
					                   onClickSwitchToLogin={this.onClickLoginToggle}/>
					<Switch>
						{
							user && <Route path='/new/artwork' component={CreateArtworkComponent} />
						}
						<Route path='/profile/:id' component={ProfileComponent} />
						<Route path='/artwork/:id' component={ArtworkComponent} />
						<Route path='/settings/account' component={SettingsComponent} />
						<Route path='/artworks' component={HomeComponent} />
						<Route path='/page-not-found' component={NotFound} />
						<Route path={['/', '/home']} component={IndexComponent} />
					</Switch>
				</div>
			</div>
		);
	}
}
