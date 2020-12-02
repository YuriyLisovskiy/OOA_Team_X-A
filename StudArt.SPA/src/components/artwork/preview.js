import React, {Component} from "react";

import "../../styles/artwork/artwork_preview.css"
import {Link} from "react-router-dom";
import TagBadge from "../tag_badge";

export default class ArtworkPreview extends Component {

	getClassForTag = (idx, length) => {
		let clsName = '';
		switch (idx) {
			case 0:
				clsName = "mr-1";
				break;
			case length - 1:
				clsName = "ml-1";
				break;
			default:
				clsName = "mx-1";
				break;
		}

		return clsName;
	}

	render() {
		let post = this.props.post;
		let imagesPlusCount = post.images.length - 1;
		return (
			<div className="card artwork-card mb-4">
				<Link to={'/artwork/' + post.id} className={imagesPlusCount > 0 ? "artwork-preview-img-container" : ""}>
					<img className="card-img img-fluid" src={post.images[0]} alt="Artwork"/>
					{
						imagesPlusCount > 0 &&
						<div className="artwork-preview-img-text">
							+ {imagesPlusCount} picture{imagesPlusCount > 1 ? "s" : ""}
						</div>
					}
				</Link>
				<div className="card-body">
					<div className="card-text pb-2">
						<span className="d-inline-block artwork-description">{post.description}</span>
					</div>
					<div>
						{
							post.voted && <div className="d-inline">
								<span className="badge badge-success">
									<i className="fa fa-check-circle-o" aria-hidden="true"> Rated</i>
								</span>
							</div>
						}
						<Link to={'/artwork/' + post.id} className="text-muted d-inline">
							<div className={(post.voted ? "ml-3 " : "") + "d-inline select-none"}>
								<i className="fa fa-comments fa-lg"
								   aria-hidden="true"/> {post.comments_count} Discussion{post.comments_count > 1 || post.comments_count === 0 ? 's' : ''}
							</div>
						</Link>
					</div>
					{
						post.tags && post.tags.length > 0 &&
						<div className="card-text mt-3">
							{post.tags.map((tag, i) => {
								return <TagBadge key={tag} text={tag} textOnly={true} onClick={this.props.onClickTag}
								                 className={this.getClassForTag(i, post.tags.length)}/>;
							})}
						</div>
					}
					<div className="card-text mt-3 pb-3 select-none">
						<Link to={'/profile/' + post.author.id} className="text-muted">
							<div className="float-left profile-photo">
								<img src={post.author.avatar} alt="Avatar" className="avatar-picture mr-2"/>
								<small className="underline-on-hover">{post.author.username}</small>
							</div>
						</Link>
						<small className="text-muted float-right mt-1">{post.creation_date} at {post.creation_time}</small>
					</div>
				</div>
			</div>
		);
	}
}
