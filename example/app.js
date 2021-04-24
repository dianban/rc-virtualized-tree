import React from "react";
import ReactDom from "react-dom";
import "./test.scss";
import VirtualizedTree from "../src";

const tree = [
  {
    key: "1",
    name: "1",
    isLeaf: false,
    children: [
      {
        key: "1-1",
        name: "1-1",
        isLeaf: true,
        children: [],
      },
    ],
  },
  {
    key: "2",
    name: "2",
    isLeaf: false,
    children: [
      {
        key: "2-1",
        name: "2-1",
        isLeaf: true,
        children: [],
      },
    ],
  },
];

ReactDom.render(
  <div className="test">
    <VirtualizedTree treeData={tree} />
  </div>,
  document.getElementById("app")
);
