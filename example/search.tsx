import * as React from "react";
import {
  VirtualizedTree,
  ITreeDataItem,
} from "../src/components/virtualized-tree";

interface ITreeItem extends ITreeDataItem<ITreeItem> {}

interface IProps {}

interface IState {
  readonly keywords: string;
  readonly searchOnlyShowMatch: boolean;
}

export class Search extends React.Component<IProps, IState> {
  public constructor(props: IProps) {
    super(props);
    this.state = {
      keywords: "",
      searchOnlyShowMatch: true,
    };
  }

  private treeData: ReadonlyArray<ITreeItem> = [
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

  private onChange = (event) => {
    this.setState({ keywords: event.currentTarget.value });
  };

  private onMatchChange = (event) => {
    this.setState({ searchOnlyShowMatch: event.currentTarget.checked });
  };

  public render() {
    return (
      <div id="example-search">
        <div className="search-checkbox">
          <input
            id="checkbox"
            type="checkbox"
            onChange={this.onMatchChange}
            checked={this.state.searchOnlyShowMatch}
          />
          <label htmlFor="checkbox">仅展示匹配的项</label>
        </div>
        <div className="search-input">
          <input type="text" onChange={this.onChange} />
        </div>
        <VirtualizedTree
          treeData={this.treeData}
          searchKeywords={this.state.keywords}
          searchOnlyShowMatch={this.state.searchOnlyShowMatch}
        />
      </div>
    );
  }
}
