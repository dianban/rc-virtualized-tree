import * as React from "react";
import { List as VList, AutoSizer } from "react-virtualized";

interface IListProps<T> {
  readonly list: ReadonlyArray<T>;
  readonly rowRenderer: (item: T, row: number) => JSX.Element | null;
  readonly rowHeight: number | ((index: number) => void);
}

interface IListState<T> {}

export class List<T> extends React.Component<IListProps<T>, IListState<T>> {
  public constructor(props) {
    super(props);
    this.state = {
      list: [],
    };
  }

  public componentDidMount(): void {}

  private rowRenderer = ({ key, index, isScrolling, isVisible, style }) => {
    const item = this.props.list[index];
    return (
      <div key={key} style={style}>
        {this.props.rowRenderer(item, index)}
      </div>
    );
  };

  private noRowsRenderer = () => {
    return <div className="no-rows-renderer">No rows</div>;
  };

  public render() {
    const { list, rowHeight } = this.props;

    return (
      <div className="list">
        <AutoSizer>
          {({ width, height }) => (
            <VList
              ref="List"
              className={""}
              height={height}
              overscanRowCount={4}
              noRowsRenderer={this.noRowsRenderer}
              rowCount={list.length}
              rowHeight={rowHeight}
              rowRenderer={this.rowRenderer}
              width={width}
            />
          )}
        </AutoSizer>
      </div>
    );
  }
}
