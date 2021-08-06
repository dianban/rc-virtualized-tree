import { ITreeDataItem } from "./virtualized-tree";

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
