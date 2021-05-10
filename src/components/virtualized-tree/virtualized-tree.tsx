import * as React from "react";
import { ReactNode } from "react";
import classNames from "classnames";
import { arrayEquals, Debounce, shallowEquals, Throttled } from "../../lib";
import { List } from "../list";
import { Icon, Symbol } from "../icon";
import { Highlight } from "../highlight.tsx/highlight";

const DefaultSearchKey = "name";
const IconExpandWidth = 16;
const TreePaddingLeft = 10;

export interface ITreeDataItem<T> {
  readonly key: string;
  readonly name: string;
  readonly isLeaf: boolean;
  readonly children?: ReadonlyArray<T>;
}

interface ITreeListItem<T extends ITreeDataItem<T>> {
  readonly level: number;
  readonly item: T;
}

interface IProps<T> {
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
  readonly rowRender?: (item: T) => ReactNode | null;
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

interface IState<T extends ITreeDataItem<T>> {
  readonly treeList: ReadonlyArray<ITreeListItem<T>>;
  readonly sExpandedKeys: ReadonlyArray<string>;
  readonly dragSelectedItem: T | null;
  readonly dropSelectedItem: T | null;
}

export class VirtualizedTree<
  T extends ITreeDataItem<T>
> extends React.Component<IProps<T>, IState<T>> {
  private readonly updateListThrottled = new Throttled(200);
  private readonly updateListDebounce = new Debounce(250);
  private readonly clickDebounce = new Debounce(250);

  public static defaultProps = {
    expandedKeys: [],
    rowHeight: 22,
    defaultExpandAll: false,
    showLevelLine: true,
    selectedKeys: [],
    defaultFolderIcon: <Icon symbol={Symbol.folder} />,
    defaultLeafIcon: <Icon symbol={Symbol.file} />,
    forSearchKey: DefaultSearchKey,
    draggable: false,
    searchOnlyShowMatch: true,
  };

  public constructor(props: IProps<T>) {
    super(props);
    this.state = {
      treeList: [],
      sExpandedKeys: [],
      dragSelectedItem: null,
      dropSelectedItem: null,
    };
  }

  public componentDidMount(): void {
    // 初始化，判断是否默认全部展开
    if (this.props.searchKeywords) {
      this.updateListDebounce.queue(() => {
        this.updateTreeListAndKeys(
          this.props.treeData,
          this.props.searchKeywords?.toLowerCase()
        );
      });
    } else if (this.props.defaultExpandAll) {
      this.updateListThrottled.queue(() => {
        this.updateTreeListAndKeys(this.props.treeData);
      });
    } else {
      this.updateListThrottled.queue(() => {
        this.updateTreeList(this.props.treeData, this.state.sExpandedKeys);
      });
    }
  }

  public componentDidUpdate(
    prevProps: Readonly<IProps<T>>,
    prevState: Readonly<IState<T>>,
    snapshot?: any
  ): void {
    // 传入的searchKeywords更新时，重置列表
    if (
      prevProps.searchKeywords !== this.props.searchKeywords ||
      prevProps.searchOnlyShowMatch !== this.props.searchOnlyShowMatch
    ) {
      // 有符合条件的节点展开，没有的节点收起，使用forSearchKey过滤，没有该字段的默认使用name进行过滤
      this.updateListDebounce.queue(() => {
        this.updateTreeListAndKeys(
          this.props.treeData,
          this.props.searchKeywords?.toLowerCase()
        );
      });
      return;
    }

    // 传入的expandedKeys更新时，重置列表
    if (!arrayEquals(prevProps.expandedKeys, this.props.expandedKeys)) {
      this.setState({ sExpandedKeys: this.props.expandedKeys });
      this.updateListThrottled.queue(() => {
        this.updateTreeList(this.props.treeData, this.props.expandedKeys);
      });
      return;
    }

    // 传入的treeData更新时，重置列表
    if (!shallowEquals(prevProps.treeData, this.props.treeData)) {
      this.updateListThrottled.queue(() => {
        this.updateTreeList(this.props.treeData, this.state.sExpandedKeys);
      });
    }
  }

  private updateTreeListAndKeys = (
    data: ReadonlyArray<T>,
    keywords?: string
  ) => {
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

  private updateTreeList = (
    treeData: ReadonlyArray<T>,
    expandedKeys: ReadonlyArray<string>
  ) => {
    // 根据 treeData 和 expandedKeys 计算展示节点
    const keywords = this.props.searchKeywords?.toLowerCase();
    const list = this.getList(
      treeData,
      0,
      expandedKeys,
      keywords,
      this.props.forSearchKey || DefaultSearchKey
    );
    this.setState({ treeList: list });
  };

  private getList = (
    tree: ReadonlyArray<T>,
    level: number,
    expandedKeys: ReadonlyArray<string>,
    keywords?: string,
    searchKey: string = DefaultSearchKey
  ): ReadonlyArray<ITreeListItem<T>> => {
    if (keywords && this.props.searchOnlyShowMatch) {
      let res: ITreeListItem<T>[] = [];
      for (const item of tree) {
        if (!item.isLeaf) {
          let subList: ReadonlyArray<ITreeListItem<T>> = [];
          if (item.children?.length) {
            subList = this.getList(
              item.children,
              level + 1,
              expandedKeys,
              keywords,
              searchKey
            );
          }
          if (
            subList.length ||
            (typeof (item as any)[searchKey] === "string" &&
              (item as any)[searchKey].toLowerCase().includes(keywords))
          ) {
            res.push({
              item: {
                ...item,
                children: undefined,
              },
              level,
            });
            if (expandedKeys.includes(item.key)) {
              res = res.concat(subList);
            }
          }
        } else {
          if (
            typeof (item as any)[searchKey] === "string" &&
            (item as any)[searchKey].toLowerCase().includes(keywords)
          ) {
            res.push({
              item: {
                ...item,
                children: undefined,
              },
              level,
            });
          }
        }
      }
      return res;
    } else {
      let res: ITreeListItem<T>[] = [];
      for (const item of tree) {
        res.push({
          item: {
            ...item,
            children: undefined,
          },
          level,
        });
        if (
          !item.isLeaf &&
          item.children?.length &&
          expandedKeys.includes(item.key)
        ) {
          res = res.concat(
            this.getList(
              item.children,
              level + 1,
              expandedKeys,
              keywords,
              searchKey
            )
          );
        }
      }
      return res;
    }
  };

  public rowRenderer = (row: number) => {
    const {
      selectedKeys,
      showLevelLine,
      searchKeywords,
      rowRender,
      draggable,
      loadingKeys,
      defaultFolderIcon,
      defaultLeafIcon,
    } = this.props;

    const {
      treeList,
      sExpandedKeys,
      dragSelectedItem,
      dropSelectedItem,
    } = this.state;

    const { item, level } = treeList[row];
    // 展开、收起
    const onExpand = (event: React.MouseEvent<HTMLDivElement>) => {
      event.stopPropagation();
      const index = sExpandedKeys.indexOf(item.key);
      if (this.props.onExpand) {
        // 传入了onExpand方法时不自动更新sExpandedKeys，需手动修改传入的expandedKeys控制显示
        this.props.onExpand(item.key, index === -1);
      } else {
        const newKeys = sExpandedKeys.slice();
        if (index > -1) {
          newKeys.splice(index, 1);
        } else {
          newKeys.push(item.key);
        }
        this.setState({ sExpandedKeys: newKeys });
        this.updateTreeList(this.props.treeData, newKeys);
      }
    };

    // 是否可拖拽
    const itemDraggable = (() => {
      if (typeof draggable === "boolean") {
        return draggable;
      } else {
        return draggable(item);
      }
    })();

    const rowClassName = () => {
      if (!this.props.rowClassName) {
        return "";
      }
      return this.props.rowClassName(item);
    };

    const onClick = (event: React.MouseEvent<HTMLDivElement>) => {
      event.stopPropagation();
      const onItemClick = this.props.onItemClick;
      if (onItemClick) {
        this.clickDebounce.queue(() => {
          onItemClick(item);
        });
      }
    };

    const onDoubleClick = (event: React.MouseEvent<HTMLDivElement>) => {
      event.stopPropagation();
      if (this.props.onItemDoubleClick) {
        this.clickDebounce.clear();
        this.props.onItemDoubleClick(item);
      }
    };

    const onContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
      event.stopPropagation();
      if (this.props.onContextMenu) {
        this.props.onContextMenu(item);
      }
    };

    let onDragStart = undefined;
    let onDragEnd = undefined;
    let onDragEnter = undefined;
    let onDragOver = undefined;
    let onDrop = undefined;

    if (itemDraggable) {
      onDragStart = (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
        setTimeout(() => {
          this.setState({ dragSelectedItem: item });
        });
      };

      onDragEnd = (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
        this.setState({ dragSelectedItem: null, dropSelectedItem: null });
      };

      onDragEnter = (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
        this.setState({ dropSelectedItem: item });
      };

      onDragOver = (event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault();
      };

      onDrop = (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
        if (this.props.onDragAndDrop) {
          const { dragSelectedItem, dropSelectedItem } = this.state;
          if (dragSelectedItem !== null && dropSelectedItem !== null) {
            this.props.onDragAndDrop(dragSelectedItem, dropSelectedItem);
          }
        }
      };
    }

    let paddingLeft = level * IconExpandWidth;
    if (item.isLeaf) {
      paddingLeft += IconExpandWidth;
    }

    const lineArray = showLevelLine ? new Array(level).fill(1) : [];
    const isActive = selectedKeys && selectedKeys.includes(item.key);

    return (
      <div
        className={classNames("virtualized-tree-item", rowClassName(), {
          active: isActive,
          "virtualized-tree-item-close":
            !item.isLeaf && !sExpandedKeys.includes(item.key),
          "virtualized-tree-item-open":
            !item.isLeaf && sExpandedKeys.includes(item.key),
          "is-drag": dragSelectedItem && dragSelectedItem.key === item.key,
          "is-drop-not-leaf":
            !item.isLeaf &&
            dropSelectedItem &&
            dropSelectedItem.key === item.key,
        })}
        style={{ paddingLeft: paddingLeft + TreePaddingLeft + "px" }}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
        onContextMenu={onContextMenu}
        draggable={itemDraggable}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragEnter={onDragEnter}
        onDragOver={onDragOver}
        onDrop={onDrop}
      >
        {lineArray.length ? (
          <div
            className="level-line"
            style={{ paddingLeft: TreePaddingLeft + "px" }}
          >
            {lineArray.map((item, index) => (
              <div key={index} className="level-line-item" />
            ))}
          </div>
        ) : null}

        {!item.isLeaf ? (
          loadingKeys && loadingKeys.has(item.key) ? (
            <div className="loading-rotate">
              <Icon symbol={Symbol.loading} />
            </div>
          ) : (
            <div onClick={onExpand} className={classNames("icon-expand")} />
          )
        ) : null}

        {item.isLeaf && defaultLeafIcon ? (
          <span className="row-icon">
            {typeof defaultLeafIcon === "function"
              ? defaultLeafIcon(item)
              : defaultLeafIcon}
          </span>
        ) : null}

        {!item.isLeaf && defaultFolderIcon ? (
          <span className="row-icon">
            {typeof defaultFolderIcon === "function"
              ? defaultFolderIcon(item)
              : defaultFolderIcon}
          </span>
        ) : null}

        <div className="content">
          {rowRender ? (
            rowRender(item)
          ) : (
            <Highlight
              key={item.key}
              text={item.name}
              keywords={searchKeywords}
            />
          )}
        </div>
      </div>
    );
  };

  private onDragToRoot = () => {
    if (this.props.onDragToRoot && this.state.dragSelectedItem !== null) {
      this.props.onDragToRoot(this.state.dragSelectedItem);
    }
  };

  public render() {
    const { selectedKeys, loadingKeys } = this.props;
    const { treeList, dragSelectedItem, dropSelectedItem } = this.state;
    return (
      <div
        className={classNames("virtualized-tree", this.props.className)}
        onDrop={this.onDragToRoot}
      >
        <List
          selectedRows={[]}
          rowCount={treeList.length}
          rowRenderer={this.rowRenderer}
          rowHeight={this.props.rowHeight}
          invalidationProps={{
            treeList,
            selectedKeys,
            loadingKeys,
            dragSelectedItem,
            dropSelectedItem,
            ...this.props.invalidationProps,
          }}
        />
      </div>
    );
  }
}
