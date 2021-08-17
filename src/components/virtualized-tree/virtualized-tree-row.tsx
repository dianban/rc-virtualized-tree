import * as React from "react";
import { ITreeDataItem, ITreeListItem } from "./model";

const TreePaddingLeft = 10;

interface IProps<T extends ITreeDataItem<T>> {
  readonly data: ITreeListItem<T>;
  readonly onExpanded: (data: ITreeListItem<T>) => void;
}

export class VirtualizedTreeRow<
  T extends ITreeDataItem<T>
> extends React.Component<IProps<T>, any> {
  private onExpanded = () => {
    this.props.onExpanded(this.props.data);
  };

  public render() {
    const { level, item } = this.props.data;
    const style = {
      paddingLeft: level * TreePaddingLeft + "px",
    };

    return (
      <div className="rc-virtualized-tree-item" style={style}>
        <div onClick={this.onExpanded}>➡️</div>
        {item.key}
      </div>
    );
  }
}
