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
import Errors from "./components/Errors";
import SettingsComponent from "./components/user/settings/Settings";
import UserService from "./services/user";
import LoginComponent from "./components/user/Login";

import dotenv from "dotenv";
import MyProfileComponent from "./components/user/MyProfile";

export default class App extends Component {

	constructor(props) {
		super(props);

		dotenv.config();

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

	_makeSubSettingRoute = (subPath) => {
		return <Route path={'/settings/' + subPath} render={
			(routeProps) => <SettingsComponent {...routeProps}
			                                   updateAvatar={this._onUpdateAvatar}
			                                   updateFullName={this._onUpdateFullName}
			                                   activeKey={subPath}/>
		} />
	}

	_onLoginSuccess = () => {
		window.location.reload();
	}

	_onRegisterSuccess = () => {
		window.location = '/';
	}

	_onUpdateAvatar = (avatarLink) => {
		let user = this.state.currentUser;
		if (user.avatar_link !== avatarLink) {
			user.avatar_link = avatarLink;
			this.setState({
				user: user
			});
		}
	}

	_onUpdateFullName = (first_name, last_name) => {
		let user = this.state.currentUser;
		if (first_name) {
			user.first_name = first_name;
		}

		if (last_name) {
			user.last_name = last_name;
		}

		if (first_name || last_name) {
			this.setState({
				user: user
			});
		}
	}

	_onClickLogOut = () => {
		AuthService.logout();
		window.location = '/';
	}

	_onClickLoginToggle = () => {
		let {loginIsOpen} = this.state;
		this.setState({
			loginIsOpen: !loginIsOpen,
			registerIsOpen: false
		});
	}

	_onClickRegisterToggle = () => {
		let {registerIsOpen} = this.state;
		this.setState({
			loginIsOpen: false,
			registerIsOpen: !registerIsOpen
		});
	}

	render() {
		const user = this.state.currentUser;
		return <div id="body" className="pb-5">
			<LoginComponent onLoginSuccess={this._onLoginSuccess}
			                open={this.state.loginIsOpen}
			                onRequestClose={this._onClickLoginToggle}
			                onClickSwitchToRegister={this._onClickRegisterToggle}/>
			<RegisterComponent onRegisterSuccess={this._onRegisterSuccess}
			                   open={this.state.registerIsOpen}
			                   onRequestClose={this._onClickRegisterToggle}
			                   onClickSwitchToLogin={this._onClickLoginToggle}/>
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
							<li className="nav-item dropdown">
								<div id="navbardrop"
								     className="nav-link dropdown-toggle select-none cursor-pointer"
								     data-toggle="dropdown">
									<div className="d-inline">
										<div className="text-muted profile-photo d-inline">
											<img src={user.avatar_link}
											     alt="Avatar"
											     className="avatar-picture mr-2"/>
											<div className="d-inline font-weight-bold">{user.username}</div>
										</div>
									</div>
								</div>
								<div className="dropdown-menu dropdown-menu-right">
									{
										user.first_name && user.last_name &&
										<div>
											<div className="dropdown-item-text font-weight-bold white-space-nowrap">
												{user.first_name} {user.last_name}
											</div>
											<div className="dropdown-divider"/>
										</div>
									}
									<Link to={"/profile/me"} className="dropdown-item">
										<i className="fa fa-user-circle-o" aria-hidden="true"/> My Profile
									</Link>
									<Link to="/settings/account" className="dropdown-item">
										<i className="fa fa-cog" aria-hidden="true"/> User Settings
									</Link>
									<div className="dropdown-divider"/>
									<div className="dropdown-item select-none cursor-pointer"
									     onClick={this._onClickLogOut}>
										<i className="fa fa-sign-out" aria-hidden="true"/> Sign Out
									</div>
								</div>
							</li>
						</ul>
					) : (
						<ul className='navbar-nav ml-auto'>
							<li className="nav-item mr-2">
								<button className="btn btn-outline-primary"
								        onClick={this._onClickLoginToggle}>
									LOGIN
								</button>
							</li>
							<li className="nav-item">
								<button className="btn btn-primary"
								        onClick={this._onClickRegisterToggle}>
									SIGN UP
								</button>
							</li>
						</ul>
					)}
				</div>
			</nav>
			<div className="container mt-3 w-65">
				<Switch>
					<Route path='/new/artwork' component={CreateArtworkComponent} />
					<Route path='/profile/me' component={MyProfileComponent} />
					<Route path='/profile/:id' component={ProfileComponent} />
					<Route path='/artwork/:id' component={ArtworkComponent} />
					{this._makeSubSettingRoute('account')}
					{this._makeSubSettingRoute('profile')}
					{this._makeSubSettingRoute('privacy-and-safety')}
					<Route path='/artworks' component={HomeComponent} />
					<Route path='/page-not-found' component={Errors.NotFound} />
					<Route path={['/', '/home']} component={IndexComponent} />
				</Switch>
			</div>
		</div>;
	}
}
