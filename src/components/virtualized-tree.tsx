import * as React from "react";
import List from "./list";

class VirtualizedTree extends React.Component<any, any> {
  public render() {
    return (
      <div className="virtualized-tree">
        tree
        <List />
      </div>
    );
  }
}
export default VirtualizedTree;
