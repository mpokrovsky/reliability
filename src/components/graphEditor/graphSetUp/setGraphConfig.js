import {
	setGraphStyle,
	setVertexStyles,
	setDefaultCellsStyle,
} from './setStyles';
import {
	mxGraph,
	mxEvent,
	mxEdgeHandler,
	mxConstants,
	mxUndoManager,
} from 'mxgraph-js';
import executeLayout from '../utils/layout';
import createPopupMenu from '../PopupMenu';
import addVertex from './addVertex';
import addToolbarButton from './addToolbar';
import undo from '../../../assets/images/undo.png';
import redo from '../../../assets/images/redo.png';
import zoom_in from '../../../assets/images/zoomin.png';
import zoom_out from '../../../assets/images/zoomout.png';
import del from '../../../assets/images/delete.png';
import actual from '../../../assets/images/actual.png';
import rectangle from '../../../assets/images/rectangle.png';
import output from '../../../assets/images/output.png';
import mOfn from '../../../assets/images/mofn.png';
import input from '../../../assets/images/input.png';
import loaded from '../../../assets/images/loaded.png';
import joint from '../../../assets/images/joint.png';
import save from '../../../assets/images/save.png';
import { getJsonModel } from '../utils/jsonCodec';

const setGraphConfig = (graph, tbContainer, sidebar, layout) => {
	const undoManager = new mxUndoManager();
	const listener = (sender, evt) => {
		undoManager.undoableEditHappened(evt.getProperty('edit'));
	};
	graph.getModel().addListener(mxEvent.UNDO, listener);
	graph.getView().addListener(mxEvent.UNDO, listener);

	setGraphStyle(graph, undoManager);

	addToolbarButton(null, graph, tbContainer, 'delete', del);
	addToolbarButton(null, graph, tbContainer, 'zoomIn', zoom_in);
	addToolbarButton(null, graph, tbContainer, 'zoomOut', zoom_out);
	addToolbarButton(null, graph, tbContainer, 'zoomActual', actual);
	addToolbarButton(undoManager, graph, tbContainer, 'undo', undo);
	addToolbarButton(undoManager, graph, tbContainer, 'redo', redo);
	addToolbarButton(null, graph, tbContainer, 'save', save);

	setDefaultCellsStyle(graph);
	setVertexStyles(graph);

	addVertex(graph, sidebar, rectangle, 55, 40, 'rectangle', 'rectangle');
	addVertex(graph, sidebar, joint, 10, 10, 'joint', 'joint');
	addVertex(graph, sidebar, mOfn, 35, 35, 'mOfn', 'mOfn');
	addVertex(graph, sidebar, input, 30, 30, 'input');
	addVertex(graph, sidebar, output, 30, 30, 'output');
	addVertex(graph, sidebar, loaded, 55, 42, 'loaded', 'loaded');

	mxConstants.ENTITY_SEGMENT = 20;

	graph.popupMenuHandler.factoryMethod = (menu, cell, evt) => {
		if (cell && cell.style === 'rectangle') {
			return createPopupMenu(graph, menu, cell, evt);
		}
	};

	/////////////////////////////////////////////////////
	const edgeHandleConnect = mxEdgeHandler.prototype.connect;
	mxEdgeHandler.prototype.connect = function (
		edge,
		terminal,
		isSource,
		isClone,
		me,
	) {
		edgeHandleConnect.apply(this, arguments);
		executeLayout(graph, layout);
	};

	graph.resizeCell = function () {
		mxGraph.prototype.resizeCell.apply(this, arguments);
		executeLayout(graph, layout);
	};

	graph.connectionHandler.addListener(mxEvent.CONNECT, () => {
		executeLayout(graph, layout);
	});
};

export default setGraphConfig;