import React, { PropTypes } from 'react';
import Item from './Item';

const ItemList = ({ dirs, files, onClickedDir, onClickedFile }) => {
	const fileComponents = files.map(file => {
		return (
			<Item key={file.file} name={file.file} onClick={() => onClickedFile(file.file)}/>
		);
	});

	const dirComponents = dirs.map(dir => {
		return (
			<Item key={dir} name={dir} onClick={() => onClickedDir(dir)}/>
		);
	});

	return (
		<div>
			<div>
				<span>{'Directories'}</span>
				<ul>
					{dirComponents}
				</ul>
			</div>
			<div>
				<span>{'Files'}</span>
				<ul>
					{fileComponents}
				</ul>
			</div>
		</div>
	);
};

ItemList.propTypes = {
	dirs: PropTypes.arrayOf(PropTypes.string).isRequired,
	files: PropTypes.arrayOf(PropTypes.shape({
		file: PropTypes.string.isRequired,
		thumbnailUrl: PropTypes.string
	})).isRequired,
	onClickedDir: PropTypes.func.isRequired,
	onClickedFile: PropTypes.func.isRequired
};

export default ItemList;
