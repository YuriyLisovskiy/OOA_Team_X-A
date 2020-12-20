import React, {Component} from "react";
import Drawer from "react-drag-drawer";
import PropTypes from "prop-types";

export default class DrawerComponent extends Component {

	render() {
		return (
			<Drawer
				open={this.props.open}
				onRequestClose={this.props.onRequestClose}
				modalElementClass={this.props.modalElementClass}>
				<div className="p-3 bg-white rounded">
					<div className="row">
						<div className="col-md-12 mb-3 font-weight-bold text-center">
							<div className="d-block">
								<img height={50} src={process.env.PUBLIC_URL + '/logo225.png'} alt="LOGO"/>
							</div>
							<div className="d-block mt-2">{this.props.title}</div>
						</div>
					</div>
					{this.props.children}
				</div>
			</Drawer>
		);
	}
}

DrawerComponent.propTypes = {
	open: PropTypes.bool,
	onRequestClose: PropTypes.func,
	title: PropTypes.string
}
