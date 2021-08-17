import * as React from "react";
import classNames from "classnames";
import { Default } from "./default";
import { Search } from "./search";
import { LargeAmountData } from "./large-amount-data";
import { Dnd } from "./dnd";
import { Checkbox } from "./checkbox";

enum Types {
  Default = "默认",
  Search = "搜索",
  LargeAmountData = "数据量较大测试",
  Dnd = "拖拽",
  Checkable = "选择",
}

interface IProps {}

interface IState {
  readonly selected: Types | null;
  readonly types: ReadonlyArray<Types>;
}

export class Index extends React.Component<IProps, IState> {
  public constructor(props: IProps) {
    super(props);

    const types = [
      Types.Default,
      Types.Search,
      Types.LargeAmountData,
      Types.Dnd,
      Types.Checkable,
    ];
    this.state = {
      selected: types[2],
      types: types,
    };
  }

  private renderView = () => {
    let content = null;
    switch (this.state.selected) {
      case Types.Default:
        content = <Default />;
        break;
      case Types.Search:
        content = <Search />;
        break;
      case Types.LargeAmountData:
        content = <LargeAmountData />;
        break;
      case Types.Dnd:
        content = <Dnd />;
        break;
      case Types.Checkable:
        content = <Checkbox />;
        break;
    }

    return <div className="example-view">{content}</div>;
  };

  public render() {
    return (
      <div className="example">
        <div className="example-list">
          <ul>
            {this.state.types.map((type, index) => {
              const changeType = () => {
                if (this.state.selected !== type) {
                  this.setState({ selected: type });
                }
              };
              return (
                <li
                  key={index}
                  className={classNames({
                    active: this.state.selected === type,
                  })}
                  onClick={changeType}
                >
                  {type}
                </li>
              );
            })}
          </ul>
        </div>
        {this.renderView()}
      </div>
    );
  }
}
