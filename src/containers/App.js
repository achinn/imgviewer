import React, { Component } from 'react';
import Credentials from '../components/Credentials';
import ItemListContainer from './ItemListContainer';
import { fetchObjects } from '../actions';
import { connect } from 'react-redux';

class App extends Component {
	constructor(props) {
		super(props);
	}
	componentDidMount() {
		const {
			dispatch,
			accessKeyId,
			secretAccessKey,
			bucketName,
			selectedDir
		} = this.props;
		dispatch(fetchObjects(accessKeyId, secretAccessKey, bucketName, selectedDir));
	}
	render() {
		return (
			<div>
				<Credentials/>
				<ItemListContainer/>
			</div>
		);
	}
}

const mapStateToProps = (state) => {
	return {
		accessKeyId: state.accessKeyId,
		secretAccessKey: state.secretAccessKey,
		bucketName: state.bucketName,
		selectedDir: state.selectedDir
	};
};

export default connect(mapStateToProps)(App);
