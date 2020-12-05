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
			loading: true
		}
	}

	componentDidMount() {
		UserService.getUser(this.props.match.params.id, (user, err) => {
			if (err) {
				// TODO:
				alert(getErrorMessage(err));
			}
			else {
				UserService.getMostUsedTagsForAuthor(user.id, 5, (tags, err) => {
					if (err) {
						// TODO:
						alert(getErrorMessage(err));
					}
					else {
						user.mostUsedTags = tags;
						this.setState({
							user: user,
							loading: false
						});
					}
				});
			}
		});
	}

	onClickSearchByTag = (_, text) => {
		console.log(text);
	}

	render() {
		let user = this.state.user;
		return (
			<div className="container">
				{
					this.state.loading ? (<Spinner/>) : (
						<div className="row">
							<div className="col-md-4">
								<img src={user.avatar_link} alt="Avatar" className="profile-picture"/>
								{
									user.first_name && user.last_name &&
									<h4 className="mt-1">{user.first_name} {user.last_name}</h4>
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
								{
									this.state.user &&
									<ArtworksList columnsCount={2}
									              filterAuthors={[this.state.user.username]}
									              clickOnPreviewTag={false}/>
								}
							</div>
						</div>
					)
				}
			</div>
		);
	}
}
