import AWS from 'aws-sdk-promise';
import path from 'path';

export const SELECTED_DIR = 'SelectedDir';
export const SET_ACCESS_KEY_ID = 'SetAccesKeyId';
export const SET_SECRET_ACCESS_KEY = 'SetSecretAccessKey';
export const SET_BUCKET_NAME = 'SetBucketName';
export const FETCHING_OBJECTS = 'FetchingObjects';
export const RECEIVE_OBJECTS = 'ReceiveObjects';
export const SELECTED_FILE = 'SelectedFile';
export const UNSELECT_FILE = 'UnselectFile';

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

function getThumbnailFile(accessKeyId, secretAccessKey, bucketName, file) {
	const dir = path.dirname(file);
	const fileName = path.basename(file);
	const thumbnailFile = path.join(dir, 'thumbnails', fileName);
	const args = {
		Bucket: bucketName,
		Key: thumbnailFile
	};
	AWS.config.update({
		accessKeyId,
		secretAccessKey
	});
	const s3 = new AWS.S3();
	return s3.headObject(args).promise().then(
		() => {
			return Promise.resolve(thumbnailFile);
		},
		() => {
			return Promise.resolve(null);
		}
	);
}

function getThumbnailUrl(accessKeyId, secretAccessKey, bucketName, thumbnailFile) {
	const args = {
		Bucket: bucketName,
		Key: thumbnailFile
	};
	AWS.config.update({
		accessKeyId,
		secretAccessKey
	});
	const s3 = new AWS.S3();
	return new Promise((resolve, reject) => {
		s3.getSignedUrl('getObject', args, (err, url) => {
			if (err) {
				console.log(err);
				reject(err);
			} else {
				resolve(url);
			}
		});
	});
}

function createThumbnail(accessKeyId, secretAccessKey, bucketName, file) {
	const payload = {
		Records: [{
			s3: {
				object: { key: file },
				bucket: { name: bucketName }
			}
		}]
	};

	const args = {
		FunctionName: 'thumbnailer',
		InvocationType: 'RequestResponse',
		Payload: JSON.stringify(payload)
	};
	AWS.config.update({
		accessKeyId,
		secretAccessKey,
		region: 'us-east-1'
	});
	const lambda = new AWS.Lambda();
	return lambda.invoke(args).promise().then(
		res => {
			const result = JSON.parse(res.data.Payload);
			return Promise.resolve(result.key);
		},
		error => {
			return Promise.reject(error);
		}
	);
}

export function selectedFile(file, thumbnailUrl) {
	return {
		type: SELECTED_FILE,
		file,
		thumbnailUrl
	};
}

export function selectFile(file, accessKeyId, secretAccessKey, bucketName) {
	return dispatch => {
		return getThumbnailFile(accessKeyId, secretAccessKey, bucketName, file).then(thumbnailFile => {
			if (!thumbnailFile) {
				// No thumbnail exists.
				return createThumbnail(accessKeyId, secretAccessKey, bucketName, file);
			}
			return Promise.resolve(thumbnailFile);
		}).then(thumbnailFile => {
			return getThumbnailUrl(accessKeyId, secretAccessKey, bucketName, thumbnailFile)
				.then(url => {
					dispatch(selectedFile(file, url));
				});
		});
	};
}

export function unselectFile() {
	return {
		type: UNSELECT_FILE
	};
}

export function selectedDir(dir) {
	return {
		type: SELECTED_DIR,
		dir
	};
}

export function receiveObjects(dir, data) {
	return {
		type: RECEIVE_OBJECTS,
		dir,
		files: data.Contents.filter(c => c.Key !== dir && c.Key.toLowerCase().endsWith('jpg')).map(c => {
			return {
				file: c.Key,
				thumbnailUrl: null
			};
		}),
		dirs: [
			`${dir}${UP_DIR}`,
			...data.CommonPrefixes.map(cp => cp.Prefix)// .filter(s => !s.Prefix.endsWith('resized/'))
		]
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
			}
		);
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
