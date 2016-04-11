import React, { PropTypes } from 'react';
import Image from './Image';

const ImageList = ({ file, currentImageUrl, onClickedPrevious, onClickedNext, onClickedClose }) => {
	return (
		<div>
			<button onClick={onClickedPrevious}>{"Previous"}</button>
			<button onClick={onClickedNext}>{"Next"}</button>
			<button onClick={onClickedClose}>{"Close"}</button>
			<Image url={currentImageUrl}/>
			<span>{file}</span>
		</div>
	);
};

ImageList.propTypes = {
	file: PropTypes.string.isRequired,
	currentImageUrl: PropTypes.string.isRequired,
	onClickedPrevious: PropTypes.func.isRequired,
	onClickedNext: PropTypes.func.isRequired,
	onClickedClose: PropTypes.func.isRequired
};

export default ImageList;
