import React, { PropTypes } from 'react';

const Image = ({ url }) => {
	return (
		<div>
			<img src={url} />
		</div>
	);
};

Image.propTypes = {
	url: PropTypes.string.isRequired
};

export default Image;
