import React from 'react';

export default class Item extends React.Component {
	constructor(props) {
		super(props);
		this.itemClicked = this.itemClicked.bind(this);
	}

	itemClicked() {
		this.props.onItemClicked({
			type: this.props.type,
			name: this.props.name
		});
	}

	render() {
		return (
			<li>
				<span onClick={this.itemClicked}>
					{this.props.name}
				</span>
			</li>
		);
	}
}
