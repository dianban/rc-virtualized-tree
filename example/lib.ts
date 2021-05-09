export interface IListItem {
  readonly id: number;
  readonly key: string;
  readonly name: string;
  readonly isLeaf: boolean;
  parentID: number;
}

export function initTreeData(layer: number, count: number, folder: number) {
  const data = [];
  for (let i = 0; i < folder; i++) {
    data.push({
      key: `${i}`,
      name: `${i}`,
      isLeaf: false,
      children: setFolder(layer, count, `${i}-1`),
    });
  }
  return data;
}

function setFolder(layer: number, count: number, key: string) {
  if (layer === 0) {
    return [];
  }

  return [
    {
      key: key,
      name: key,
      isLeaf: false,
      children: setFolder(layer - 1, count, `${key}-1`),
    },
    ...setFiles(key, count),
  ];
}

function setFiles(key: string, count: number) {
  const files = [];
  for (let i = 0; i < count; i++) {
    files.push({
      key: `file-${key}-${i}`,
      name: `${i}.txt`,
      isLeaf: true,
    });
  }
  return files;
}

export function listToTree(list: Array<IListItem>) {
  const newList = JSON.parse(JSON.stringify(list));
  newList.sort((a, b) => {
    if (a.isLeaf !== b.isLeaf) {
      return a.isLeaf ? 1 : -1;
    } else {
      return 0;
    }
  });
  const tree = [];
  let map = {};
  for (const item of newList) {
    map[item.id] = item;
  }

  for (const item of newList) {
    if (map[item.parentID]) {
      map[item.parentID].children = map[item.parentID].children || [];
      map[item.parentID].children.push(item);
    } else {
      tree.push(item);
    }
  }
  console.log(tree);
  return tree;
}
