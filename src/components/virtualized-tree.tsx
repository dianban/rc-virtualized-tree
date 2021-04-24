import * as React from "react";
import { ReactNode } from "react";
import { List } from "./list";

const defaultSearchKey = "name";

export interface ITreeDataItem<T> {
  readonly key: string;
  readonly name: string;
  readonly isLeaf: boolean;
  readonly children: ReadonlyArray<T>;
}

interface ITreeListItem<T extends ITreeDataItem<T>> {
  readonly level: number;
  readonly item: T;
}

interface IVirtualizedTreeProps<T> {
  readonly treeData: ReadonlyArray<T>;
  readonly expandedKeys: ReadonlyArray<string>;
  /** Row height, default 22px */
  readonly rowHeight: number;
  /** Expand all node, default false */
  readonly defaultExpandAll: boolean;
  /** Show level line, default true */
  readonly showLevelLine: boolean;
  /** Selected keys, add background color */
  readonly selectedKeys: ReadonlyArray<string>;
  /** Default folder icon */
  readonly defaultFolderIcon: ReactNode | ((item: T) => ReactNode);
  /** Default leaf icon */
  readonly defaultLeafIcon: ReactNode | ((item: T) => ReactNode);
  /** Search keywords */
  readonly searchKeywords?: string;
  /** Default true */
  readonly searchOnlyShowMatch: boolean;
  /** Default 'name' */
  readonly forSearchKey: string;
  readonly rowRender?: (item: T) => JSX.Element | null;
  readonly className?: string;
  readonly rowClassName?: (item: T) => string;
  readonly loadingKeys?: Set<string>;
  readonly invalidationProps?: any;
  readonly onItemClick?: (item: T) => void;
  readonly onItemDoubleClick?: (item: T) => void;
  readonly onContextMenu?: (item: T) => void;
  /** If it's not undefined, need set 'expandedKeys' self */
  readonly onExpand?: (key: string, open: boolean) => void;
  readonly draggable: ((item: T) => boolean) | boolean;
  readonly onDragAndDrop?: (dragItem: T, dropItem: T) => void;
  readonly onDragToRoot?: (dragItem: T) => void;
}

interface IVirtualizedTreeState<T extends ITreeDataItem<T>> {
  readonly treeList: ReadonlyArray<ITreeListItem<T>>;
  readonly sExpandedKeys: ReadonlyArray<string>;
}

export class VirtualizedTree<
  T extends ITreeDataItem<T>
> extends React.Component<IVirtualizedTreeProps<T>, IVirtualizedTreeState<T>> {
  public static defaultProps = {
    expandedKeys: [],
    rowHeight: 22,
    defaultExpandAll: false,
    showLevelLine: true,
    selectedKeys: [],
    defaultFolderIcon: <i className="icon-folder" />,
    defaultLeafIcon: <i className="icon-file-line" />,
    forSearchKey: defaultSearchKey,
    draggable: false,
    searchOnlyShowMatch: true,
  };

  public constructor(props: IVirtualizedTreeProps<T>) {
    super(props);
    this.state = {
      treeList: [],
      sExpandedKeys: [],
    };
  }

  public componentDidMount(): void {
    this.updateTreeListAndKeys(this.props.treeData);
  }

  private updateTreeListAndKeys = (
    data: ReadonlyArray<T>,
    keywords?: string
  ) => {
    console.time("updateTreeListAndKeys");
    const { keys, list } = this.getTreeListAndKeys(
      data,
      0,
      {},
      keywords,
      this.props.forSearchKey
    );
    if (list.length) {
      this.setState({ sExpandedKeys: keys, treeList: list });
    } else {
      this.setState({
        sExpandedKeys: [],
        treeList: data.map((item) => {
          return {
            item,
            level: 0,
          };
        }),
      });
    }
    console.timeEnd("updateTreeListAndKeys");
  };

  private getTreeListAndKeys = (
    data: ReadonlyArray<T>,
    level: number,
    parentKeys: { [key: string]: string[] },
    keywords?: string,
    filterKey?: string
  ) => {
    let keys: string[] = [];
    let list: ITreeListItem<T>[] = [];
    if (!keywords) {
      for (const item of data) {
        list.push({
          item: {
            ...item,
            children: undefined,
          },
          level,
        });
        if (!item.isLeaf) {
          keys.push(item.key);
          if (item.children?.length) {
            const { list: subList, keys: subKeys } = this.getTreeListAndKeys(
              item.children,
              level + 1,
              parentKeys,
              keywords,
              filterKey
            );
            keys = keys.concat(subKeys);
            list = list.concat(subList);
          }
        }
      }
    } else if (this.props.searchOnlyShowMatch) {
      for (const item of data) {
        if (!item.isLeaf) {
          const { list: subList, keys: subKeys } = this.getTreeListAndKeys(
            item.children || [],
            level + 1,
            parentKeys,
            keywords,
            filterKey
          );
          keys = keys.concat(subKeys);
          if (subList.length) {
            keys.push(item.key);
            list.push({
              item: {
                ...item,
                children: undefined,
              },
              level,
            });
            list = list.concat(subList);
            continue;
          }
        }
        if (
          filterKey &&
          typeof (item as any)[filterKey] === "string" &&
          (item as any)[filterKey].toLowerCase().includes(keywords)
        ) {
          list.push({
            item: {
              ...item,
              children: undefined,
            },
            level,
          });
        }
      }
    } else {
      let flag = false;
      const preChild: ITreeListItem<T>[] = [];
      for (const item of data) {
        if (!item.isLeaf) {
          const { list: subList, keys: subKeys } = this.getTreeListAndKeys(
            item.children || [],
            level + 1,
            parentKeys,
            keywords,
            filterKey
          );
          keys = keys.concat(subKeys);
          if (subList.length) {
            keys.push(item.key);
            if (!flag) {
              flag = true;
              list = list.concat(preChild);
            }
            list.push({
              item: {
                ...item,
                children: undefined,
              },
              level,
            });
            list = list.concat(subList);
            continue;
          }
        }
        if (
          filterKey &&
          typeof (item as any)[filterKey] === "string" &&
          (item as any)[filterKey].toLowerCase().includes(keywords)
        ) {
          if (!flag) {
            flag = true;
            list = list.concat(preChild);
          }
          list.push({
            item: {
              ...item,
              children: undefined,
            },
            level,
          });
        } else {
          if (flag) {
            list.push({
              item: {
                ...item,
                children: undefined,
              },
              level,
            });
          } else {
            preChild.push({
              item: {
                ...item,
                children: undefined,
              },
              level,
            });
          }
        }
      }
    }
    return {
      list,
      keys,
    };
  };

  private rowRenderer = (item: ITreeListItem<T>, row: number) => {
    const rowItem = item.item;
    return <div className="virtualized-tree-item">{rowItem.name}</div>;
  };

  public render() {
    return (
      <div className="virtualized-tree">
        <List
          list={this.state.treeList}
          rowRenderer={this.rowRenderer}
          rowHeight={this.props.rowHeight}
        />
      </div>
    );
  }
}
