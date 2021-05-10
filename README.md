## Virtualized Tree

### Getting Started

Install `rc-virtualized-tree` using npm

```
npm install rc-virtualized-tree --save
```

import style

```
import 'rc-virtualized-tree/styles.css'
```

### Prop Types

| Property            | Type                                      | Required? | Description                                          | Default |
| :------------------ | :---------------------------------------- | :-------: | :--------------------------------------------------- | :------ |
| treeData            | Array                                     |     ✓     |                                                      |         |
| expandedKeys        | Array<string>                             |           | 展开节点的 key                                       |         |
| rowHeight           | Number                                    |           | 行高                                                 | 22px    |
| defaultExpandAll    | Boolean                                   |           | 是否展开所有节点，只在初始化时有效                   | false   |
| showLevelLine       | Boolean                                   |           | 节点前方是否展示虚线                                 | true    |
| selectedKeys        | Array<string>                             |           | 选中节点，会加背景颜色                               |         |
| defaultFolderIcon   | ReactNode &#124; ((item: T) => ReactNode) |           | 非叶子节点图标，设为 null 时不展示图标               | 文件夹  |
| defaultLeafIcon     | ReactNode &#124; ((item: T) => ReactNode) |           | 叶子节点图标，设为 null 时不展示图标                 | 文件    |
| searchKeywords      | String                                    |           | 过滤关键字                                           |         |
| searchOnlyShowMatch | Boolean                                   |           | 过滤时是否只展示匹配的节点                           | true    |
| forSearchKey        | String                                    |           | 过滤时使用哪个字段匹配，默认'name'                   | 'name'  |
| rowRender           | (item: T) => ReactNode &#124; null        |           | 自定义每项展示内容，默认展示'name'的值               | 'name'  |
| className           | String                                    |           | 给组件添加 class                                     |         |
| rowClassName        | (item: T) => string                       |           | 给每项添加 class                                     |         |
| loadingKeys         | Array<string>                             |           | 展开/收起按钮显示 loading 状态                       |         |
| invalidationProps   | Object                                    |           | 值发生变化时触发 render                              |         |
| onItemClick         | (item: T) => void                         |           | 鼠标单击事件                                         |         |
| onItemDoubleClick   | (item: T) => void                         |           | 鼠标双击事件                                         |         |
| onContextMenu       | (item: T) => void                         |           | 鼠标右键事件                                         |         |
| onExpand            | (key: string, open: boolean) => void      |           | 点击展开/收起，设置该属性后需要自行设置 expandedKeys |         |
| draggable           | ((item: T) => boolean) &#124; boolean     |           | 是否可拖拽                                           | false   |
| onDragAndDrop       | (dragItem: T, dropItem: T) => void        |           | 拖放                                                 |         |
| onDragToRoot        | (dragItem: T) => void                     |           |                                                      |         |

### Demo

```javascript
import { VirtualizedTree } from "rc-virtualized-tree";
import "rc-virtualized-tree/styles.css";

export default class Demo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      treeData: [
        {
          key: "1",
          name: "1",
          isLeaf: false,
          children: [
            {
              key: "1-1",
              name: "1-1",
              isLeaf: false,
              children: [
                {
                  key: "1-1-1",
                  name: "1-1-1",
                  isLeaf: true,
                },
                {
                  key: "1-1-2",
                  name: "1-1-2",
                  isLeaf: false,
                },
              ],
            },
          ],
        },
        {
          key: "2",
          name: "2",
          isLeaf: false,
          children: [
            {
              key: "2-1",
              name: "2-1",
              isLeaf: true,
            },
            {
              key: "2-2",
              name: "2-2",
              isLeaf: true,
            },
            {
              key: "2-3",
              name: "2-3",
              isLeaf: true,
            },
          ],
        },
        {
          key: "3",
          name: "3",
          isLeaf: false,
          children: [
            {
              key: "3-1",
              name: "3-1",
              isLeaf: true,
            },
          ],
        },
      ],
    };
  }

  itemClick = (item) => {
    console.log("click", item);
  };

  render() {
    return (
      <VirtualizedTree
        treeData={this.statetreeData}
        onItemClick={this.itemClick}
      />
    );
  }
}
```
