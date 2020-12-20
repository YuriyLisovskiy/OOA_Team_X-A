import React, {useState} from "react";
import Switch from "react-input-switch";

export default function ToggleSetting(props) {
	const [value, setValue] = useState(props.initialValue);
	let onClickSetValue = (val) => {
		setValue(val);
		props.onToggle(val, (result) => {
			if (result !== val) {
				setValue(result);
			}
		});
	}

	let checkedColor = props.checkedColor ? props.checkedColor : '#28a745';
	return <div className="row">
		<div className="col-8">
			<h6 className="text-left">{props.title}</h6>
			<small className="form-text text-left text-muted">{props.subtitle}</small>
		</div>
		<div className="col-4 text-right">
			<Switch on={true} off={false} value={value} onChange={onClickSetValue} styles={{
				trackChecked: {
					backgroundColor: checkedColor
				}
			}}/>
		</div>
	</div>;
}
