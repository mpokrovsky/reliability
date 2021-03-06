import React, { FC, useEffect } from "react";
import mx from '../mxgraph';
import { mxGraph, mxToolbar } from 'mxgraph';

import "../helpers/graph/style.css";
import setGraphConfig from "../helpers/graph/setGraphConfig";
import { getJsonModel } from "../helpers/graph/jsonCodec";

interface GraphContainerProps {
  setGraphNodes: () => void;
}

const GraphContainer: FC<GraphContainerProps> = ({ setGraphNodes }) => {

  useEffect(() => {
    loadGraph();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      const window = document.querySelector(".mxWindow");
      if (window) {
        window.remove();
      }
    };
  }, []);

  const loadGraph = () => {
    /** получение div-элементов из DOM */
    const container = document.getElementById("container");
    const tbContainer = document.getElementById("tbContainer");
    const outlineContainer = document.getElementById("outlineContainer");
    const sbContainer = document.getElementById("sbContainer");

    /** инициализация графа */
    const graph: mxGraph = new mx.mxGraph(container);
    const sidebar: mxToolbar = new mx.mxToolbar(sbContainer);

    /** сеттинг конфигурации графа */
    setGraphConfig(graph, tbContainer, sidebar, setGraphNodes);

    new mx.mxOutline(graph, outlineContainer);

    /** при изменении графа происходит его сохранение в graphNodes */
    graph.model.addListener(mx.mxEvent.CHANGE, () => {
      const jsonNodes = getJsonModel(graph);
      setGraphNodes(jsonNodes);
    });
  };
  /** структура основного контейнера, внутри которого элементы 
   * тулбара, сайдбара, поля редактора */
  return (
    <div id="graphContainer">
      <div className="container" id="container" />
      <div className="tbContainer" id="tbContainer" />
      <div className="sbContainer" id="sbContainer" />
      <div className="outlineContainer" id="outlineContainer" />
    </div>
  );
};

export default GraphContainer;
