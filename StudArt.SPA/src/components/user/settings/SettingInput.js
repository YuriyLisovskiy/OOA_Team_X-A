import React, {Component} from "react";
import PropTypes from "prop-types";

export default class SettingInputComponent extends Component {

	constructor(props) {
		super(props);
		this._initialValue = this.props.initialValue;
		this.state = {
			value: this._initialValue,
			isSaved: true,
			valueError: undefined
		};
	}

	_onChangeValue = (e) => {
		let text = e.target.value.trim();
		this.setState({
			value: text,
			isSaved: text === this._initialValue,
			valueError: undefined
		});
	}

	_onClickSave = (_) => {
		if (!this.state.isSaved) {
			let hasError = false;
			if (this.props.validateInput) {
				let err = this.props.validateInput(this.state.value);
				if (err) {
					this.setState({
						valueError: err
					});
					hasError = true;
				}
			}

			if (!hasError) {
				this.props.onSave(this.state.value, (err) => {
					if (err) {
						this.setState({
							valueError: err
						});
					}
					else {
						this._initialValue = this.state.value;
						this.setState({
							isSaved: true,
							valueError: undefined
						});
					}
				});
			}
		}
	}

	render() {
		return <div className="form-group">
			<label htmlFor="email"><h6>{this.props.title}</h6></label>
			<div className="input-group">
				<input type="text" className="form-control" name={this.props.name}
				       placeholder="Type text..."
				       value={this.state.value}
				       onChange={this._onChangeValue}/>
				<div className="input-group-append"
				     title={this.state.isSaved ? "Saved" : "Click to save"}>
					<button className={"btn btn-" + (this.state.isSaved ? "success" : "warning")}
					        onClick={this._onClickSave}
					        disabled={this.state.isSaved}>
						<div className="d-inline">
							<i className={"fa " + (
								this.state.isSaved ? "fa-check-circle-o" : "fa-exclamation-triangle"
							)}
							   aria-hidden="true"/>
						</div>
						{
							!this.state.isSaved &&
							<div className="d-inline ml-2">Save</div>
						}
					</button>
				</div>
			</div>
			{
				this.state.valueError && <small className="form-text text-danger ml-1 mt-1">
					{this.state.valueError}
				</small>
			}
		</div>;
	}
}

SettingInputComponent.propTypes = {
	initialValue: PropTypes.string,
	title: PropTypes.string,
	name: PropTypes.string,
	onSave: PropTypes.func
}
