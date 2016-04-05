import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reducer from './reducers';
import App from './containers/App';
import createLogger from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import config from './config';

const loggerMiddleware = createLogger();

const store = createStore(
	reducer,
	{
		selectedDir: '',
		accessKeyId: config.accessKeyId,
		secretAccessKey: config.secretAccessKey,
		bucketName: config.bucketName
	},
	applyMiddleware(
		thunkMiddleware,
		loggerMiddleware
	)
);

render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById('content')
);
