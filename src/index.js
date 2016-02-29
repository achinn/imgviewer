import React from 'react';
import ReactDOM from 'react-dom';
import AWS from 'aws-sdk-promise';
import Item from './item';
import config from './config';

const
	FILE = Symbol('file'),
	DIR = Symbol('dir');

class ItemList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			files: [],
			dirs: [],
			currentDir: '',
			accessKeyId: config.accessKeyId,
			secretAccessKey: config.secretAccessKey,
			bucketName: config.bucketName,
			selectedImageUrl: null
		};
		this.setCreds = this.setCreds.bind(this);
		this.setAccessKeyId = this.setAccessKeyId.bind(this);
		this.setSecretAccessKey = this.setSecretAccessKey.bind(this);
		this.setBucketName = this.setBucketName.bind(this);
		this.getObjects = this.getObjects.bind(this);
		this.handleItemClicked = this.handleItemClicked.bind(this);
		this.getObject = this.getObject.bind(this);

		this.setCreds();
	}

	getObject(key) {
		const args = {
			Bucket: this.state.bucketName,
			Key: key,
			Expires: 30
		};

		const s3 = new AWS.S3();
		return s3.getSignedUrl('getObject', args);
	}

	getObjects() {
		if (this.state.accessKeyId === null
				|| this.state.secretAccessKey === null
				|| this.state.bucketName === null) {
			return;
		}

		let currDir = this.state.currentDir;
		const args = {
			Bucket: this.state.bucketName,
			Delimiter: '/',
			Prefix: currDir
		};

		const s3 = new AWS.S3();
		s3.listObjects(args).promise().then(
			res => {
				this.setState({
					files: res.data.Contents.filter(c => c.Key !== currDir),
					dirs: res.data.CommonPrefixes
				});
			},
			error => {
				console.log(error);
			});
	}

	setCreds() {
		AWS.config.update({
			accessKeyId: this.state.accessKeyId,
			secretAccessKey: this.state.secretAccessKey
		});
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

	handleItemClicked(item) {
		switch (item.type) {
		case FILE:
			this.setState({ selectedImageUrl: this.getObject(item.name) });
			break;
		case DIR:
			this.setState({ currentDir: item.name }, this.getObjects);
			break;
		default:
		}
	}

	render() {
		const files = this.state.files.map(file => {
			return (
				<Item key={file.Key} name={file.Key} type={FILE} onItemClicked={this.handleItemClicked}/>
			);
		});

		const dirs = this.state.dirs.map(dir => {
			return (
				<Item key={dir.Prefix} name={dir.Prefix} type={DIR} onItemClicked={this.handleItemClicked}/>
			);
		});

		const imgStyle = {
			maxWidth: '100%'
		};

		return (
			<div>
				<div>
					<label>
						{'Access Key ID:'}
						<input type="text" onChange={this.setAccessKeyId} value={this.state.accessKeyId}/>
					</label>
					<label>
						{'Secret Access Key:'}
						<input type="text" onChange={this.setSecretAccessKey} value={this.state.secretAccessKey}/>
					</label>
					<label>
						{'Bucket name:'}
						<input type="text" onChange={this.setBucketName} value={this.state.bucketName}/>
					</label>
					<button onClick={this.setCreds}>
						{"Set Creds"}
					</button>
				</div>
				<div>
					<button onClick={this.getObjects}>
						{"Refresh"}
					</button>
				</div>
				<div>
					<span>{"Directories"}</span>
					<ul>
						{dirs}
					</ul>
				</div>
				<div>
					<span>{"Files"}</span>
					<ul>
						{files}
					</ul>
				</div>
				<div>
					<img src={this.state.selectedImageUrl} style={imgStyle}/>
				</div>
			</div>
		);
	}
}

ReactDOM.render(
	<ItemList/>,
	document.getElementById('content')
);
