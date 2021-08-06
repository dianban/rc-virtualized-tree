import * as React from "react";
import VirtualizedTree, { ITreeDataItem } from "../src";
import { IListItem, listToTree } from "./lib";

interface ITreeItem extends ITreeDataItem<ITreeItem> {}

interface IProps {}

interface IState {
  readonly treeData: ReadonlyArray<ITreeItem>;
}

export class Dnd extends React.Component<IProps, IState> {
  private data: Array<IListItem> = [
    {
      id: 1,
      key: "1",
      name: "1",
      isLeaf: false,
      parentID: 0,
    },
    {
      id: 2,
      key: "2",
      name: "2",
      isLeaf: false,
      parentID: 0,
    },
    {
      id: 3,
      key: "3",
      name: "3",
      isLeaf: true,
      parentID: 0,
    },
    {
      id: 4,
      key: "4",
      name: "4",
      isLeaf: true,
      parentID: 1,
    },
    {
      id: 5,
      key: "5",
      name: "5",
      isLeaf: true,
      parentID: 4,
    },
    {
      id: 6,
      key: "6",
      name: "6",
      isLeaf: true,
      parentID: 2,
    },
    {
      id: 7,
      key: "7",
      name: "7",
      isLeaf: false,
      parentID: 2,
    },
  ];

  public constructor(props: IProps) {
    super(props);
    this.state = {
      treeData: [],
    };
  }

  public componentDidMount(): void {
    this.updateTreeData();
  }

  private updateTreeData = () => {
    const tree = listToTree(this.data);
    this.setState({ treeData: tree });
  };

  private onDragAndDrop = (drag: IListItem, drop: IListItem) => {
    if (drop.isLeaf) {
      return;
    }
    let idMap = {};
    for (const item of this.data) {
      idMap[item.id] = item.parentID;
    }
    let parentID = drop.id;
    while (parentID) {
      if (parentID === drag.id) {
        console.log("不可移动到子目录");
        return;
      }
      parentID = idMap[parentID];
    }
    const item = this.data.find((i) => i.id === drag.id);
    if (item.parentID !== drop.id) {
      item.parentID = drop.id;
      this.updateTreeData();
    }
  };

  public render() {
    return (
      <div id="example-dnd">
        <VirtualizedTree
          treeData={this.state.treeData}
          defaultExpandAll={true}
          draggable={true}
          onDragAndDrop={this.onDragAndDrop}
        />
      </div>
    );
  }
}
