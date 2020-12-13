import React from "react";

export const ArtworkEmptyPreview = () => {
	return <div className="card artwork-card mb-4" style={{opacity: 0.5}}>
		<div className="artwork-preview-img-container">
			<div className="card-img img-fluid w-100" style={{height: 350, backgroundColor: "lightgray"}}/>
		</div>
		<div className="card-body">
			<div className="card-text pb-2">
				<div className="w-75 rounded" style={{backgroundColor: "lightgray", height: 15}}/>
			</div>
			<div className="rounded" style={{backgroundColor: "lightgray", height: 15, width: 150}}/>
			<div className="card-text mt-3 pb-3 select-none">
				<div className="text-muted">
					<div className="float-left profile-photo">
						<div className="avatar-picture mr-2" style={{
							backgroundColor: "lightgray",
							width: 30,
							height: 30
						}}/>
						<small className="rounded" style={{
							backgroundColor: "lightgray",
							height: 10,
							width: 70
						}}/>
					</div>
				</div>
				<small className="text-muted float-right mt-2 rounded" style={{
					backgroundColor: "lightgray",
					height: 10,
					width: 90
				}}/>
			</div>
		</div>
	</div>;
}
