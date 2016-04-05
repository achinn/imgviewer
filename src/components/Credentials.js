import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { setAccessKeyId, setSecretAccessKey, setBucketName } from '../actions';

const Credentials = ({
	accessKeyId,
	secretAccessKey,
	bucketName,
	onChangeAccessKeyId,
	onChangeSecretAccessKey,
	onChangeBucketName
	}) => (
	<div>
		<label>
			{'Access Key ID:'}
			<input type="text" onChange={(event) => onChangeAccessKeyId(event.target.value)} value={accessKeyId}/>
		</label>
		<label>
			{'Secret Access Key:'}
			<input type="text" onChange={(event) => onChangeSecretAccessKey(event.target.value)} value={secretAccessKey}/>
		</label>
		<label>
			{'Bucket name:'}
			<input type="text" onChange={(event) => onChangeBucketName(event.target.value)} value={bucketName}/>
		</label>
	</div>
);

Credentials.propTypes = {
	accessKeyId: PropTypes.string,
	setSecretAccessKey: PropTypes.string,
	bucketName: PropTypes.string,
	onChangeAccessKeyId: PropTypes.func.isRequired,
	onChangeSecretAccessKey: PropTypes.func.isRequired,
	onChangeBucketName: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
	return {
		accessKeyId: state.accessKeyId,
		secretAccessKey: state.secretAccessKey,
		bucketName: state.bucketName
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onChangeAccessKeyId: (accessKeyId) => {
			dispatch(setAccessKeyId(accessKeyId));
		},
		onChangeSecretAccessKey: (secretAccessKey) => {
			dispatch(setSecretAccessKey(secretAccessKey));
		},
		onChangeBucketName: (bucketName) => {
			dispatch(setBucketName(bucketName));
		}
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Credentials);
