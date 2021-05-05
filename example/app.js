import React from "react";
import ReactDom from "react-dom";
import "./test.scss";
import { VirtualizedTree } from "../src";

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
      {
        key: "2-2",
        name: "2-2",
        isLeaf: true,
        children: [],
      },
      {
        key: "2-3",
        name: "2-3",
        isLeaf: true,
        children: [],
      },
      {
        key: "2-4",
        name: "2-4",
        isLeaf: true,
        children: [],
      },
      {
        key: "2-5",
        name: "2-5",
        isLeaf: true,
        children: [],
      },
      {
        key: "2-6",
        name: "2-6",
        isLeaf: true,
        children: [],
      },
      {
        key: "2-7",
        name: "2-7",
        isLeaf: true,
        children: [],
      },
      {
        key: "2-8",
        name: "2-8",
        isLeaf: true,
        children: [],
      },
      {
        key: "2-9",
        name: "2-9",
        isLeaf: true,
        children: [],
      },
      {
        key: "2-10",
        name: "2-10",
        isLeaf: true,
        children: [],
      },
      {
        key: "2-11",
        name: "2-11",
        isLeaf: true,
        children: [],
      },
    ],
  },
  {
    key: "3",
    name: "3",
    isLeaf: false,
    children: [
      {
        key: "3-1",
        name: "3-1",
        isLeaf: true,
        children: [],
      },
    ],
  },
];
let keywords = "";

const rowRender = (item) => {
  return <div>{item.name}</div>;
};

const itemClick = (item) => {
  console.log("click", item);
};

const itemDoubleClick = (item) => {
  console.log("double", item);
};

const onContextMenu = (item) => {
  console.log("onContextMenu", item);
};

ReactDom.render(
  <div className="test">
    <VirtualizedTree
      treeData={tree}
      rowRender={rowRender}
      onItemClick={itemClick}
      onItemDoubleClick={itemDoubleClick}
      onContextMenu={onContextMenu}
    />
  </div>,
  document.getElementById("app")
);
