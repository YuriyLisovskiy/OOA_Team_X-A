import React, {Component} from "react";
import UserService from "../../services/user";
import {getErrorMessage} from "../utils";
import Spinner from "../spinner";
import ArtworksList from "../artwork/list";
import TagBadge from "../tag_badge";
import "../../styles/user/profile.css"

export default class Profile extends Component {

	constructor(props) {
		super(props);
		this.state = {
			user: undefined,
			loading: true,
			currentUser: UserService.getCurrentUser()
		}
	}

	componentDidMount() {
		UserService.getUser(this.props.match.params.id, (user, err) => {
			if (err) {
				// TODO:
				alert(getErrorMessage(err));
			}
			else if (this.state.currentUser) {
				UserService.getMostUsedTagsForAuthor(user.id, 5, (tags, err) => {
					if (err) {
						// TODO:
						alert(getErrorMessage(err));
					}
					else {
						user.mostUsedTags = tags;
						this._setLoadedUser(user);
					}
				});
			}
			else {
				this._setLoadedUser(user);
			}
		});
	}

	_setLoadedUser = (user) => {
		this.setState({
			user: user,
			loading: false
		});
	}

	onClickSearchByTag = (_, text) => {
		// TODO: search by tag in user's posts.
		console.log(text);
	}

	onClickToggleUserAction = (boolVal, methods, updatedUser) => {
		return e => {
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

	onClickSubscription = (subscribe) => {
		return this.onClickToggleUserAction(
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

	onClickBlacklistAuthor = (block) => {
		return this.onClickToggleUserAction(
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

	onClickBanUser = (ban) => {
		return this.onClickToggleUserAction(
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
		return (
			<div className="container">
				{
					this.state.loading ? (<Spinner/>) : (
						<div>
							<div className="row">
								<div className="col-md-4">
									<div className="mx-auto text-center text-muted mb-2">PROFILE</div>
									<img src={user.avatar_link} alt="Avatar" className="img-thumbnail mx-auto d-block mb-2"/>
									{
										this.state.currentUser && this.state.currentUser.id !== user.id &&
											<div>
												{
													this.state.currentUser.is_superuser &&
													(user.is_banned ? (
														<button type="button"
														        className="btn btn-secondary btn-block btn-sm mb-2"
														        onClick={this.onClickBanUser(false)}>
															Unban
														</button>
													) : (
														<button type="button"
														        className="btn btn-danger btn-block btn-sm mb-2"
														        onClick={this.onClickBanUser(true)}>
															Ban
														</button>
													))
												}
												{
													user.is_blocked &&
													<div className="mx-auto btn-group-vertical btn-group-sm w-100">
														<button type="button" className="btn btn-warning mb-2"
														        onClick={this.onClickBlacklistAuthor(false)}>
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
																        onClick={this.onClickSubscription(false)}>
																	Unsubscribe
																</button>
															) : (
																<button type="button" className="btn btn-success"
																        onClick={this.onClickSubscription(true)}>
																	Subscribe
																</button>
															)
														}
														<button type="button" className="btn btn-outline-danger"
														        onClick={this.onClickBlacklistAuthor(true)}>
															Block
														</button>
													</div>

												}
											</div>
									}
									{
										user.first_name && user.last_name &&
										<h4 className="mb-2">{user.first_name} {user.last_name}</h4>
									}
									<h6>{user.username}</h6>
									{
										user && user.mostUsedTags && user.mostUsedTags.length > 0 &&
										<div>
											{user.mostUsedTags.map((tag, i) => {
												return <TagBadge key={tag.text} text={tag.text}
												                 textOnly={true}
												                 onClick={this.onClickSearchByTag}
												                 displayInline={false}/>;
											})}
										</div>
									}
								</div>
								<div className="col-md-8">
									<div className="mx-auto text-center text-muted mb-2">ARTWORKS</div>
									{
										this.state.user &&
										<ArtworksList columnsCount={2}
										              filterAuthors={[this.state.user.username]}
										              clickOnPreviewTag={false}/>
									}
								</div>
							</div>
						</div>
					)
				}
			</div>
		);
	}
}
