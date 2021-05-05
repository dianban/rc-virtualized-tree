## Virtualized Tree

### Prop Types

| Property            | Type                                      | Required? | Description                                          |
| :------------------ | :---------------------------------------- | :-------: | :--------------------------------------------------- |
| treeData            | Array                                     |     ✓     |                                                      |
| expandedKeys        | Array<string>                             |           | 展开节点的 key                                       |
| rowHeight           | Number                                    |           | 行高，默认 22px                                      |
| defaultExpandAll    | Boolean                                   |           | 是否展开所有节点，只在初始化时有效，默认 false       |
| showLevelLine       | Boolean                                   |           | 节点前方是否展示虚线，默认 true                      |
| selectedKeys        | Array<string>                             |           | 选中节点，会加背景颜色                               |
| defaultFolderIcon   | ReactNode &#124; ((item: T) => ReactNode) |           | 非叶子节点图标，设为 null 时不展示图标               |
| defaultLeafIcon     | ReactNode &#124; ((item: T) => ReactNode) |           | 叶子节点图标，设为 null 时不展示图标                 |
| searchKeywords      | String                                    |           | 过滤关键字                                           |
| searchOnlyShowMatch | Boolean                                   |           | 过滤时是否只展示匹配的节点，默认 true                |
| forSearchKey        | String                                    |           | 过滤时使用哪个字段匹配，默认'name'                   |
| rowRender           | (item: T) => ReactNode &#124; null        |           | 自定义每项展示内容，默认展示'name'的值               |
| className           | String                                    |           | 给组件添加 class                                     |
| rowClassName        | (item: T) => string                       |           | 给每项添加 class                                     |
| loadingKeys         | Array<string>                             |           | 展开/收起按钮显示 loading 状态                       |
| invalidationProps   | Object                                    |           | 值发生变化时触发显示更新                             |
| onItemClick         | (item: T) => void                         |           | 鼠标单击事件                                         |
| onItemDoubleClick   | (item: T) => void                         |           | 鼠标双击事件                                         |
| onContextMenu       | (item: T) => void                         |           | 鼠标右键事件                                         |
| onExpand            | (key: string, open: boolean) => void      |           | 点击展开/收起，设置该属性后需要自行设置 expandedKeys |
| draggable           | Boolean                                   |           | 是否可拖拽                                           |
| onDragAndDrop       | (dragItem: T, dropItem: T) => void        |           |                                                      |
| onDragToRoot        | (dragItem: T) => void                     |           |                                                      |
