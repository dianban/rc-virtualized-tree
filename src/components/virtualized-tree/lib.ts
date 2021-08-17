import {
  ITrackItem,
  ITreeCacheData,
  ITreeData,
  ITreeDataItem,
  ITreeListItem,
} from "./model";

interface IKeysMap {
  parents: string[];
  childKeys: string[];
}

export type KeysMapItem = {
  [key: string]: IKeysMap;
};

export function getKeysMap<T extends ITreeDataItem<T>>(
  treeData: ReadonlyArray<T>
) {
  const map: KeysMapItem = {};
  for (const item of treeData) {
    subGetKeysMap(item, map, []);
  }
  return map;
}

function subGetKeysMap<T extends ITreeDataItem<T>>(
  data: T,
  map: KeysMapItem,
  parents: string[]
): string[] {
  let children: string[] = [];
  if (!data.isLeaf && data.children) {
    const newParents = parents.concat(data.key);
    children = data.children.reduce((prev: string[], cur) => {
      const a = subGetKeysMap(cur, map, newParents);
      return prev.concat(a);
    }, []);
  }
  map[data.key] = {
    parents,
    childKeys: children,
  };
  return [data.key, ...children];
}

function dfsData<T extends ITreeDataItem<T>>(
  data: ReadonlyArray<T>,
  level: number,
  parentKeys: string[],
  dataList: Array<string>,
  dataMap: { [key: string]: ITreeListItem<T> },
  dataParentKeys: { [key: string]: Array<string> },
  dataChildrenKeys: { [key: string]: Array<string> }
) {
  for (const item of data) {
    dataList.push(item.key);
    dataMap[item.key] = {
      item,
      level,
    };
    dataParentKeys[item.key] = parentKeys;
    if (item.children) {
      dfsData(
        item.children,
        level + 1,
        parentKeys.concat([item.key]),
        dataList,
        dataMap,
        dataParentKeys,
        dataChildrenKeys
      );
    }
  }
}

export function getInitData<T extends ITreeDataItem<T>>(
  treeData: ReadonlyArray<T>
): ITreeCacheData<T> {
  let dataList: Array<string> = [];
  let dataMap: { [key: string]: ITreeListItem<T> } = {};
  let dataParentKeys: { [key: string]: Array<string> } = {};
  let dataChildrenKeys: { [key: string]: Array<string> } = {};

  dfsData(treeData, 0, [], dataList, dataMap, dataParentKeys, dataChildrenKeys);
  return {
    dataList,
    dataMap,
    dataParentKeys,
    dataChildrenKeys,
  };
}

export function getInitData1<T extends ITreeDataItem<T>>(
  treeData: ReadonlyArray<T>
): ITreeCacheData<T> {
  let dataList: Array<string> = [];
  let dataMap: { [key: string]: ITreeListItem<T> } = {};
  let dataParentKeys: { [key: string]: Array<string> } = {};
  let dataChildrenKeys: { [key: string]: Array<string> } = {};

  let track: Array<ITrackItem<T>> = treeData.map((i) => ({
    data: i,
    level: 0,
    parentKeys: [],
  }));

  while (track.length) {
    const item = track.shift();
    if (item) {
      const { data, level, parentKeys } = item;
      if (data.children) {
        const child: Array<string> = [];
        track = data.children
          .map((i) => {
            child.push(i.key);
            return {
              data: i,
              level: level + 1,
              parentKeys: parentKeys.concat(data.key),
            };
          })
          .concat(track);
        dataChildrenKeys[data.key] = child;
      }
      dataList.push(data.key);
      dataMap[data.key] = {
        item: data,
        level,
      };
      dataParentKeys[data.key] = parentKeys;
    }
  }

  return {
    dataList,
    dataMap,
    dataParentKeys,
    dataChildrenKeys,
  };
}

export function getTreeList<T extends ITreeDataItem<T>>(
  topKeys: string[],
  cacheData: ITreeCacheData<T>,
  keywords: string = "",
  expandedKeys?: Array<string>
): ITreeData {
  if (expandedKeys !== undefined) {
    return getTreeListByKeywordsAndExpandedKeys(
      topKeys,
      cacheData,
      keywords,
      expandedKeys
    );
  } else {
    return getTreeListByKeywords(cacheData, keywords);
  }
}

function getTreeListByKeywords<T extends ITreeDataItem<T>>(
  cacheData: ITreeCacheData<T>,
  keywords: string
): ITreeData {
  keywords = keywords.trim();
  const { dataList, dataParentKeys, dataMap } = cacheData;
  let treeList: Array<string> = [];
  let map: { [key: string]: number } = {};
  if (!keywords) {
    treeList = dataList.slice();
  } else {
    for (const key of dataList) {
      if (key.includes(keywords)) {
        const keys = dataParentKeys[key].concat(key);
        for (const k of keys) {
          if (!map[k]) {
            map[k] = 1;
            treeList.push(k);
          }
        }
      }
    }
  }

  return {
    treeList,
    expanded: treeList.filter((key) => !dataMap[key].item.isLeaf),
  };
}

function getTreeListByKeywordsAndExpandedKeys<
  T extends ITreeDataItem<T>
>(
  topKeys: string[],
  cacheData: ITreeCacheData<T>,
  keywords: string,
  expanded: Array<string>
): ITreeData {
  keywords = keywords.trim();
  const { dataList, dataParentKeys } = cacheData;
  let treeList: Array<string> = [];
  let map: { [key: string]: number } = {};

  for (const key of dataList) {
    let flag = true;
    if (!keywords || key.includes(keywords)) {
      const keys = dataParentKeys[key];
      for (const k of keys) {
        if (expanded.includes(k)) {
          if (!map[k]) {
            map[k] = 1;
            treeList.push(k);
          }
        } else {
          flag = false;
          break;
        }
      }
      if (flag && !map[key]) {
        map[key] = 1;
        treeList.push(key);
      }
    }
  }

  return {
    treeList,
    expanded,
  };
}
