import ImageList from '../components/ImageList';
import { connect } from 'react-redux';
import { selectFile, unselectFile } from '../actions';

const mapStateToProps = (state) => {
	const {
		accessKeyId,
		secretAccessKey,
		bucketName,
		selectedFile: { file, thumbnailUrl },
		selectedDir,
		objects
	} = state;
	const fileNames = objects[selectedDir].files.map(f => f.file);
	return {
		accessKeyId,
		secretAccessKey,
		bucketName,
		currentImageUrl: thumbnailUrl,
		currentIndex: fileNames.indexOf(file),
		fileNames,
		file
	};
};

const mergeProps = (stateProps, dispatchProps) => {
	const {
		accessKeyId,
		secretAccessKey,
		bucketName,
		currentImageUrl,
		currentIndex,
		fileNames,
		file
	} = stateProps;
	const { dispatch } = dispatchProps;

	// Select next and previous files if possible, otherwise do nothing.
	const onClickedPrevious = currentIndex > 1 ? () => {
			dispatch(
				selectFile(
					fileNames[currentIndex - 1],
					accessKeyId,
					secretAccessKey,
					bucketName
				)
			);
		} : () => {};
	const onClickedNext = currentIndex < fileNames.length - 1 ? () => {
			dispatch(
				selectFile(
					fileNames[currentIndex + 1],
					accessKeyId,
					secretAccessKey,
					bucketName
				)
			);
		} : () => {};
	return {
		file,
		currentImageUrl,
		onClickedPrevious,
		onClickedNext,
		onClickedClose: () => dispatch(unselectFile())
	};
};

const ImageListContainer = connect(mapStateToProps, null, mergeProps)(ImageList);

export default ImageListContainer;
