import AWS from 'aws-sdk-promise';

export const SELECTED_DIR = 'SelectedDir';
export const SET_ACCESS_KEY_ID = 'SetAccesKeyId';
export const SET_SECRET_ACCESS_KEY = 'SetSecretAccessKey';
export const SET_BUCKET_NAME = 'SetBucketName';
export const FETCHING_OBJECTS = 'FetchingObjects';
export const RECEIVE_OBJECTS = 'ReceiveObjects';

const UP_DIR = '..';

export function setAccessKeyId(accessKeyId) {
	return {
		type: SET_ACCESS_KEY_ID,
		accessKeyId
	};
}

export function setSecretAccessKey(secretAccessKey) {
	return {
		type: SET_SECRET_ACCESS_KEY,
		secretAccessKey
	};
}

export function setBucketName(bucketName) {
	return {
		type: SET_BUCKET_NAME,
		bucketName
	};
}

export function fetchingObjects(dir) {
	return {
		type: FETCHING_OBJECTS,
		dir
	};
}

export function receiveObjects(dir, data) {
	return {
		type: RECEIVE_OBJECTS,
		dir,
		files: data.Contents.filter(c => c.Key !== dir),
		dirs: [
			`${dir}${UP_DIR}`,
			...data.CommonPrefixes.map(cp => cp.Prefix)// .filter(s => !s.Prefix.endsWith('resized/'))
		]
	};
}

export function selectedDir(dir) {
	return {
		type: SELECTED_DIR,
		dir
	};
}

export function fetchObjects(accessKeyId, secretAccessKey, bucketName, dir) {
	return dispatch => {
		dispatch(fetchingObjects(dir));

		const args = {
			Bucket: bucketName,
			Delimiter: '/',
			Prefix: dir
		};
		AWS.config.update({
			accessKeyId,
			secretAccessKey
		});
		const s3 = new AWS.S3();
		return s3.listObjects(args).promise().then(
			res => {
				dispatch(receiveObjects(dir, res.data));
			},
			error => {
				console.log(error);
			});
	};
}

export function selectDir(dir, accessKeyId, secretAccessKey, bucketName) {
	return dispatch => {
		let targetDir = dir;
		if (dir.endsWith(UP_DIR)) {
			const endPos = dir.lastIndexOf('/', dir.length - UP_DIR.length - 2);
			targetDir = endPos === -1 ? '' : dir.substring(0, endPos + 1);
		}
		return dispatch(fetchObjects(accessKeyId, secretAccessKey, bucketName, targetDir))
			.then(() => {
				dispatch(selectedDir(targetDir));
			});
	};
}
