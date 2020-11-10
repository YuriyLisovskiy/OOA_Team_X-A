import React, {Component} from "react";
import UserService from "../services/user.service";
import ArtworkService from "../services/artwork.service";
import ArtworkPreview from "./artwork_preview";
import {getResponseMessage} from "./utils";
import {forEach} from "react-bootstrap/ElementChildren";

export default class Profile extends Component {
	constructor(props) {
		super(props);
		// this.handleRegister = this.handleRegister.bind(this);
		this.state = {
			user: undefined,
			artworks: undefined
		}
	}

	componentDidMount() {
		UserService.getUser(this.props.match.params.id).then(
			resp => {
				console.log(resp);
				this.setState({
					user: resp.data
				})
			},
			err => {
				console.log(err)
			}
		)
		//TODO: get artworks by user id
		//ArtworkService.getArtworks(this.props.match.params.id).then(
		ArtworkService.getArtworks().then(
			resp => {
				console.log(resp.data);
				this.setState({
					artworks: resp.data.map(
						(artwork) => <ArtworkPreview post={artwork} key={artwork.id}/>
					),
					loading: false
				});
			},
			err => {
				// TODO:
				alert(getResponseMessage(err));
			}
		);
		console.log(this.state.user)
	}

	render() {
		return (
			<div>
				<div className="col-8 flex-column">
					<img src="https://i.pinimg.com/564x/04/e7/ba/04e7bafeb76ed96a59fd95e9804b951e.jpg" className="w-100"/>
					<div className="card-columns">{this.state.artworks}</div>
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

