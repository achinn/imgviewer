import { combineReducers } from 'redux';
import {
	SELECTED_DIR,
	SET_ACCESS_KEY_ID,
	SET_SECRET_ACCESS_KEY,
	SET_BUCKET_NAME,
	RECEIVE_OBJECTS
} from './actions';

function selectedDir(state = '', action) {
	switch (action.type) {
	case SELECTED_DIR:
		return action.dir;
	default:
		return state;
	}
}

function accessKeyId(state = '', action) {
	switch (action.type) {
	case SET_ACCESS_KEY_ID:
		return action.accessKeyId;
	default:
		return state;
	}
}

function secretAccessKey(state = '', action) {
	switch (action.type) {
	case SET_SECRET_ACCESS_KEY:
		return action.secretAccessKey;
	default:
		return state;
	}
}

function bucketName(state = '', action) {
	switch (action.type) {
	case SET_BUCKET_NAME:
		return action.bucketName;
	default:
		return state;
	}
}

function objects(state = {}, action) {
	switch (action.type) {
	case RECEIVE_OBJECTS:
		return {
			...state,
			[action.dir]: {
				files: action.files,
				dirs: action.dirs
			}
		};
	default:
		return state;
	}
}

// {
// 	selectedDir: '',
// 	accessKeyId: '',
// 	secretAccessKey: '',
// 	bucketName: '',
// 	objects: {
// 		key1: {
// 			files: [ 'file1', 'file2' ],
// 			dirs: [ 'dir1', 'dir2' ]
// 		},
// 		key2: {}
// 	}
// }

export default combineReducers({
	selectedDir,
	accessKeyId,
	secretAccessKey,
	bucketName,
	objects
});
