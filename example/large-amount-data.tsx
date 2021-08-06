import * as React from "react";
import VirtualizedTree, { ITreeDataItem } from "../src";
import { initTreeData } from "./lib";

interface ITreeItem extends ITreeDataItem<ITreeItem> {}

interface IProps {}

interface IState {
  readonly keywords: string;
  readonly treeData: ReadonlyArray<ITreeItem>;
}

export class LargeAmountData extends React.Component<IProps, IState> {
  public constructor(props: IProps) {
    super(props);
    this.state = {
      keywords: "",
      treeData: initTreeData(5, 10000, 6),
    };
  }

  private onChange = (event) => {
    this.setState({ keywords: event.currentTarget.value });
  };

  public render() {
    return (
      <div id="example-large-amount-data">
        <div className="search-input">
          <input type="text" onChange={this.onChange} />
        </div>
        <VirtualizedTree
          treeData={this.state.treeData}
          searchKeywords={this.state.keywords}
        />
      </div>
    );
  }
}
