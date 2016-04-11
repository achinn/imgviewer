import ItemList from '../components/ItemList';
import { connect } from 'react-redux';
import { selectDir, selectFile } from '../actions';

const mapStateToProps = (state) => {
	const {
		selectedDir,
		objects,
		accessKeyId,
		secretAccessKey,
		bucketName
	} = state;
	const { dirs, files } = objects[selectedDir] || {
		dirs: [],
		files: []
	};
	return {
		dirs,
		files,
		accessKeyId,
		secretAccessKey,
		bucketName
	};
};

const mergeProps = (stateProps, dispatchProps) => {
	const {
		dirs,
		files,
		accessKeyId,
		secretAccessKey,
		bucketName
	} = stateProps;
	const { dispatch } = dispatchProps;
	return {
		dirs,
		files,
		onClickedDir: (key) => dispatch(selectDir(key, accessKeyId, secretAccessKey, bucketName)),
		onClickedFile: (key) => dispatch(selectFile(key, accessKeyId, secretAccessKey, bucketName))
	};
};

const ItemListContainer = connect(mapStateToProps, null, mergeProps)(ItemList);

export default ItemListContainer;
