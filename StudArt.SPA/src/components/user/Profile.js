import React, {Component} from "react";
import UserService from "../../services/user";
import {getErrorMessage} from "../../utils/misc";
import SpinnerComponent from "../Spinner";
import ArtworksListComponent from "../artwork/List";
import TagBadgeComponent from "../TagBadge";
import Errors from "../Errors";
import {Link} from "react-router-dom";

export default class ProfileComponent extends Component {

	constructor(props) {
		super(props);
		this.state = {
			user: undefined,
			loading: true,
			currentUser: UserService.getCurrentUser(),
			notFound: false,
			subscriptions: [],
			mostUsedTags: []
		}
	}

	componentDidMount() {
		let userId = null;
		if (this.props.match.params.id) {
			userId = this.props.match.params.id;
		}
		else if (this.state.currentUser) {
			userId = this.state.currentUser.id;
		}

		if (userId) {
			UserService.getUser(userId, (user, err) => {
				if (err) {
					if (err.response.status === 404) {
						this.setState({
							notFound: true,
							loading: false
						});
					}
					else {
						// TODO:
						alert(getErrorMessage(err));
					}
				}
				else {
					this._setLoadedUser(user);
					UserService.getMostUsedTagsForAuthor(userId, 5, (tags, err) => {
						if (err) {
							// TODO:
							alert(getErrorMessage(err));
						}
						else {
							this.setState({
								mostUsedTags: tags
							});
						}
					});

					if (user.show_subscriptions) {
						UserService.getSubscriptions(userId, 1, (data, err) => {
							if (err) {
								// TODO:
								alert(getErrorMessage(err));
							}
							else {
								this.setState({
									subscriptions: data.results
								});
							}
						});
					}
				}
			});
		}
		else {
			this.props.history.push('/');
		}
	}

	_setLoadedUser = (user) => {
		this.setState({
			user: user,
			loading: false
		});
	}

	_toggleUserAction = (boolVal, methods, updatedUser) => {
		return _ => {
			let method = boolVal ? methods.ifTrue : methods.ifFalse;
			method(this.state.user.id, (resp, err) => {
				if (err) {
					// TODO:
					alert(getErrorMessage(err));
				}
				else {
					this.setState({
						user: updatedUser(this.state.user)
					});
				}
			});
		}
	}

	_onClickSubscription = (subscribe) => {
		return this._toggleUserAction(
			subscribe,
			{
				ifTrue: UserService.subscribeToAuthor,
				ifFalse: UserService.unsubscribeFromAuthor
			},
			(user) => {
				user.is_subscribed = subscribe
				return user
			}
		);
	}

	_onClickBlacklistAuthor = (block) => {
		return this._toggleUserAction(
			block,
			{
				ifTrue: UserService.blockAuthor,
				ifFalse: UserService.unblockAuthor
			},
			(user) => {
				user.is_blocked = block
				user.is_subscribed = false
				return user
			}
		);
	}

	_onClickBanUser = (ban) => {
		return this._toggleUserAction(
			ban,
			{
				ifTrue: UserService.banUser,
				ifFalse: UserService.unbanUser
			},
			(user) => {
				user.is_banned = ban
				return user
			}
		);
	}

	render() {
		let user = this.state.user;
		return <div className="container">
			{
				this.state.loading ? (<SpinnerComponent/>) : (
					this.state.notFound ? (<Errors.NotFound/>) : (
						<div className="row">
							<div className="col-md-4">
								<div className="mx-auto text-center text-muted mb-2">PROFILE</div>
								<img src={user.avatar_link} alt="Avatar"
								     className="img-thumbnail mx-auto d-block mb-2"/>
								{
									this.state.currentUser && this.state.currentUser.id !== user.id &&
									<div>
										{
											this.state.currentUser.is_superuser &&
											(user.is_banned ? (
												<button type="button"
												        className="btn btn-secondary btn-block btn-sm mb-2"
												        onClick={this._onClickBanUser(false)}>
													Unban
												</button>
											) : (
												<button type="button"
												        className="btn btn-danger btn-block btn-sm mb-2"
												        onClick={this._onClickBanUser(true)}>
													Ban
												</button>
											))
										}
										{
											user.is_blocked &&
											<div className="mx-auto btn-group-vertical btn-group-sm w-100">
												<button type="button" className="btn btn-warning mb-2"
												        onClick={this._onClickBlacklistAuthor(false)}>
													Unblock
												</button>
											</div>
										}
										{
											!user.is_blocked &&
											<div className="mx-auto btn-group-vertical btn-group-sm w-100 mb-2">
												{
													user.is_subscribed ? (
														<button type="button" className="btn btn-warning"
														        onClick={this._onClickSubscription(false)}>
															Unsubscribe
														</button>
													) : (
														<button type="button" className="btn btn-success"
														        onClick={this._onClickSubscription(true)}>
															Subscribe
														</button>
													)
												}
												<button type="button" className="btn btn-outline-secondary"
												        onClick={this._onClickBlacklistAuthor(true)}>
													Block
												</button>
											</div>

										}
									</div>
								}
								{
									((
										this.state.currentUser && this.state.currentUser.id === user.id
									) || user.show_rating) &&
									<h5 className="float-right">Rating: {user.rating}</h5>
								}
								{
									((
										this.state.currentUser && this.state.currentUser.id === user.id
									) || (
										user.show_full_name && user.first_name && user.last_name
									)) &&
									<h5 className="mb-2">{user.first_name} {user.last_name}</h5>
								}
								<h6>{user.username}</h6>
								{
									this.state.mostUsedTags.length > 0 &&
									<div className="mt-4">
										<div className="text-muted text-center mb-1 muted-border-bottom">
											<small>MOST USED TAGS</small>
										</div>
										{this.state.mostUsedTags.map((tag) => {
											return <TagBadgeComponent key={tag.text} text={tag.text}
											                          className="mr-1"
											                          textOnly={true}
											                          displayInline={true}/>;
										})}
									</div>
								}
								{
									(
										(
											this.state.currentUser && this.state.currentUser.id === user.id
										) || user.show_subscriptions
									) && this.state.subscriptions.length > 0 &&
									<div>
										<div className="text-muted text-center mt-4 mb-1 muted-border-bottom">
											<small>SUBSCRIPTIONS</small>
										</div>
										{
											this.state.subscriptions.map((user) => {
												return <Link to={'/profile/' + user.id} className="float-left"
												             key={user.id}>
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
										}
									</div>
								}
							</div>
							<div className="col-md-8">
								<div className="mx-auto text-center text-muted mb-2">
									ARTWORKS
								</div>
								{
									user &&
									<ArtworksListComponent columnsCount={2}
									                       filterAuthors={[user.username]}
									                       clickOnPreviewTag={false}/>
								}
							</div>
						</div>
					)
				)
			}
		</div>;
	}
}
