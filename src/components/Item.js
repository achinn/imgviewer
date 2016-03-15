import React, { PropTypes } from 'react';

const Item = ({ name, onClick }) => {
	return (
		<li>
			<span onClick={onClick}>
				{name}
			</span>
		</li>
	);
};

Item.propTypes = {
	name: PropTypes.string.isRequired,
	onClick: PropTypes.func.isRequired
};

export default Item;
