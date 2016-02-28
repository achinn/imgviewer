import React from 'react';
import ReactDOM from 'react-dom';
import AWS from 'aws-sdk-promise';
import S3Object from './s3object';

const s3 = new AWS.S3();

class S3ObjectList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			objects: [],
			accessKeyId: null,
			secretAccessKey: null,
			bucketName: null
		};
		this.setCreds = () => this.setCreds();
		this.setAccessKeyId = (event) => this.setAccessKeyId(event);
		this.setSecretAccessKey = (event) => this.setSecretAccessKey(event);
		this.setBucketName = (event) => this.setBucketName(event);
	}

	componentDidMount() {
		if (this.state.accessKeyId === null
				|| this.state.secretAccessKey === null
				|| this.state.bucketName === null) {
			return;
		}
		const args = {
			Bucket: this.state.bucketName
		};
		s3.listObjects(args).promise().then((res) => {
			this.setState({ objects: res.data.Contents });
		});
	}

	setCreds() {
		AWS.config.update({
			accessKeyId: this.state.accessKeyId,
			secretAccessKey: this.state.secretAccessKey
		});
		this.forceUpdate();
	}

	setAccessKeyId(event) {
		this.setState({
			accessKeyId: event.target.value
		});
	}

	setSecretAccessKey(event) {
		this.setState({
			secretAccessKey: event.target.value
		});
	}

	setBucketName(event) {
		this.setState({
			bucketName: event.target.value
		});
	}

	render() {
		const objects = this.state.objects.map((object) => {
			return (
				<S3Object key={object.Key} name={object.Key}/>
			);
		});

		return (
			<div>
				<label>
					{'Access Key ID:'}
					<input type="text" onChange={this.setAccessKeyId}/>
				</label>
				<label>
					{'Secret Access Key:'}
					<input type="text" onChange={this.setSecretAccessKey}/>
				</label>
				<label>
					{'Bucket name:'}
					<input type="text" onChange={this.setBucketName}/>
				</label>
				<button onClick={this.setCreds}>
					{"Set Creds"}
				</button>
				<ul>
					{objects}
				</ul>
			</div>
		);
	}
}

ReactDOM.render(
	<S3ObjectList />,
	document.getElementById('example')
);
