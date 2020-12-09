import React, {Component} from "react";
import DrawerComponent from "../../Drawer";
import PropTypes from "prop-types";
import {strIsEmpty} from "../../../utils/misc";

export default class PasswordVerificationComponent extends Component {

	constructor(props) {
		super(props);
		this.state = {
			errorMessage: undefined,
			password: "",
			passwordError: undefined,
			loading: false
		};
		this._inputRef = React.createRef();
	}

	componentDidMount() {
		this.setState({
			loading: false
		});
	}

	_onChangePassword = (e) => {
		this.setState({
			password: e.target.value,
			passwordError: undefined
		})
	}

	_onClickCancel = (_) => {
		this.setState({
			password: "",
			passwordError: undefined,
			errorMessage: undefined
		})
		this.props.onRequestClose();
	}

	_onClickConfirm = (e) => {
		if (!strIsEmpty(this.state.password)) {
			this.setState({
				loading: true
			});
			this.props.onClickConfirm(e, this.state.password, () => {
				this.setState({
					loading: false,
					password: ""
				});
				this._inputRef.current.value = "";
			});
		}
		else {
			this.setState({
				passwordError: "Password field is empty."
			});
		}
	}

	setError = (msg) => {
		this.setState({
			errorMessage: msg,
			loading: false
		});
	}

	render() {
		return <DrawerComponent title="CONFIRM AN ACTION"
		                        open={this.props.open}
		                        onRequestClose={this.props.onRequestClose}
		                        modalElementClass={this.props.modalElementClass ?
			                        this.props.modalElementClass : "container w-25 min-w-250"
		                        }>
			{
				this.props.description &&
				<div className="text-center pb-4">{this.props.description}</div>
			}
			{
				this.state.errorMessage &&
				<div className="form-group">
					<div className="alert alert-danger" role="alert">
						{this.state.errorMessage}
					</div>
				</div>
			}
			<div className="form-group">
				<input type="password" className="form-control" ref={this._inputRef}
				       placeholder="Type password..." onChange={this._onChangePassword}/>
				{
					this.state.passwordError && <small className="form-text text-danger ml-1 mt-1">
						{this.state.passwordError}
					</small>
				}
			</div>
			<div className="text-right">
				<button className="btn btn-outline-danger d-inline"
				        onClick={this._onClickCancel}>Cancel</button>
				<button className="btn btn-primary d-inline ml-1"
				        onClick={this._onClickConfirm}
				        disabled={this.state.loading}>
					{
						this.state.loading &&
						<span className="spinner-border spinner-border-sm"/>
					} Confirm
				</button>
			</div>
		</DrawerComponent>;
	}
}

PasswordVerificationComponent.propTypes = {
	open: PropTypes.bool,
	onRequestClose: PropTypes.func,
	onClickConfirm: PropTypes.func,
}
