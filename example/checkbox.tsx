import * as React from "react";
import { VirtualizedTree } from "../src/components/virtualized-tree";

interface IState {
  readonly checkedKeys: string[];
}

export class Checkbox extends React.Component<{}, IState> {
  public constructor(props: {}) {
    super(props);
    this.state = {
      checkedKeys: [],
    };
  }

  private treeData = [
    {
      key: "1",
      name: "1",
      isLeaf: false,
      children: [
        {
          key: "1-1",
          name: "1-1",
          isLeaf: false,
          children: [
            {
              key: "1-1-1",
              name: "1-1-1",
              isLeaf: true,
            },
            {
              key: "1-1-2",
              name: "1-1-2",
              isLeaf: false,
            },
          ],
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

  private onChecked = (keys: string[]) => {
    this.setState({ checkedKeys: keys });
  };

  public render() {
    return (
      <VirtualizedTree
        treeData={this.treeData}
        checkable={true}
        checkedKeys={this.state.checkedKeys}
        onChecked={this.onChecked}
      />
    );
  }
}
