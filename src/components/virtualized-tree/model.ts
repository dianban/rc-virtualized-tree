export interface ITreeDataItem<T> {
  readonly key: string;
  readonly name: string;
  readonly isLeaf: boolean;
  readonly children?: ReadonlyArray<T>;
}

export interface ITreeListItem<T extends ITreeDataItem<T>> {
  readonly level: number;
  readonly item: T;
}

export interface ITrackItem<T> {
  readonly data: T;
  readonly level: number;
  readonly parentKeys: Array<string>;
}

export interface ITreeCacheData<T extends ITreeDataItem<T>> {
  readonly dataMap: { [key: string]: ITreeListItem<T> };
  readonly dataList: Array<string>;
  readonly dataParentKeys: { [key: string]: Array<string> };
  readonly dataChildrenKeys: { [key: string]: Array<string> };
}

export interface ITreeData {
  readonly treeList: Array<string>;
  readonly expanded: Array<string>;
}
