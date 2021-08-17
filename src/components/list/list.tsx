import * as React from "react";
import { Grid, AutoSizer } from "react-virtualized";
import { shallowEquals, arrayEquals } from "../../lib";
import { ListRow } from "./list-row";

interface IMouseClickSource {
  readonly kind: "mouseclick";
  readonly event: React.MouseEvent<any>;
}

interface IKeyboardSource {
  readonly kind: "keyboard";
  readonly event: React.KeyboardEvent<any>;
}

export interface IRowRendererParams {
  readonly columnIndex: number;
  readonly isScrolling: boolean;
  readonly key: React.Key;
  readonly rowIndex: number;
  readonly style: React.CSSProperties;
}

export type ClickSource = IMouseClickSource | IKeyboardSource;

interface IProps {
  readonly rowRenderer: (row: number) => JSX.Element | null;
  readonly rowCount: number;
  readonly rowHeight: number | ((info: { index: number }) => number);
  readonly selectedRows: ReadonlyArray<number>;
  readonly onRowClick?: (row: number, source: ClickSource) => void;
  readonly invalidationProps?: any;
  readonly id?: string;
  readonly scrollToRow?: number;
  readonly setScrollTop?: number;
}

interface IState {}

export class List extends React.Component<IProps, IState> {
  private gridStyle: React.CSSProperties = { overflowX: "hidden" };
  private grid: Grid | null = null;
  public constructor(props: IProps) {
    super(props);
    this.state = {};
  }

  public componentDidMount() {
    const { props, grid } = this;
    const { selectedRows, scrollToRow, setScrollTop } = props;

    if (grid !== null && setScrollTop === undefined) {
      if (scrollToRow !== undefined) {
        grid.scrollToCell({ rowIndex: scrollToRow, columnIndex: 0 });
      } else if (selectedRows.length > 0) {
        grid.scrollToCell({ rowIndex: selectedRows[0], columnIndex: 0 });
      }
    }
  }

  public componentDidUpdate(prevProps: IProps, prevState: IState) {
    if (this.grid) {
      const gridHasUpdatedAlready = this.props.rowCount !== prevProps.rowCount;

      if (!gridHasUpdatedAlready) {
        const selectedRowChanged = !arrayEquals(
          prevProps.selectedRows,
          this.props.selectedRows
        );

        const invalidationPropsChanged = !shallowEquals(
          prevProps.invalidationProps,
          this.props.invalidationProps
        );

        if (selectedRowChanged || invalidationPropsChanged) {
          this.grid.forceUpdate();
        }
      }
    }
  }

  private renderRow = (params: IRowRendererParams) => {
    const rowIndex = params.rowIndex;
    const selectable = true;
    const selected = this.props.selectedRows.indexOf(rowIndex) !== -1;

    let tabIndex: number | undefined = undefined;
    if (selectable) {
      tabIndex = selected && this.props.selectedRows[0] === rowIndex ? 0 : -1;
    }
    // const element = this.props.rowRenderer(params.rowIndex);
    // const id = this.props.id ? `${this.props.id}-${rowIndex}` : undefined;

    return (
        <div>123</div>
      // <ListRow
      //   key={params.key}
      //   id={id}
      //   rowCount={this.props.rowCount}
      //   rowIndex={rowIndex}
      //   selected={selected}
      //   onRowClick={this.onRowClick}
      //   style={params.style}
      //   tabIndex={tabIndex}
      //   children={element}
      //   selectable={selectable}
      // />
    );
  };

  public render() {
    let content: JSX.Element[] | JSX.Element | null;
    content = (
      <AutoSizer>
        {({ width, height }: { width: number; height: number }) =>
          this.renderGrid(width, height)
        }
      </AutoSizer>
    );

    return (
      <div id={this.props.id} className="rc-virtualized-list">
        {content}
      </div>
    );
  }

  private onGridRef = (ref: Grid | null) => {
    this.grid = ref;
  };

  private renderGrid(width: number, height: number) {
    return (
      <Grid
        className="rc-virtualized-list-grid"
        ref={this.onGridRef}
        autoContainerWidth={true}
        width={width}
        height={height}
        columnWidth={width}
        columnCount={1}
        rowCount={this.props.rowCount}
        rowHeight={this.props.rowHeight}
        cellRenderer={this.renderRow}
        scrollTop={this.props.setScrollTop}
        overscanRowCount={4}
        style={this.gridStyle}
      />
    );
  }

  // private onRowClick = (row: number, event: React.MouseEvent<any>) => {
  //   if (this.props.onRowClick) {
  //     const rowCount = this.props.rowCount;
  //     if (row < 0 || row >= rowCount) {
  //       return;
  //     }
  //     this.props.onRowClick(row, { kind: "mouseclick", event });
  //   }
  // };
}
