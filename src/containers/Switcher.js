import React from 'react';
import ItemListContainer from './ItemListContainer';
import ImageListContainer from './ImageListContainer';
import { connect } from 'react-redux';

const Switcher = ({ selectedFile }) => {
	if (selectedFile) {
		return <ImageListContainer/>;
	}
	return <ItemListContainer/>;
};

const mapStateToProps = (state) => {
	return {
		selectedFile: state.selectedFile
	};
};

export default connect(mapStateToProps)(Switcher);
