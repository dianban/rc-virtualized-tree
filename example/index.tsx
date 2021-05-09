import * as React from "react";
import classNames from "classnames";
import { Default } from "./default";
import { Search } from "./search";
import { LargeAmountData } from "./large-amount-data";
import { Dnd } from "./dnd";

enum Types {
  Default = "Default",
  Search = "Search",
  LargeAmountData = "LargeAmountData",
  Dnd = "Dnd",
}

interface IState {
  readonly selected: Types | null;
  readonly types: ReadonlyArray<Types>;
}

export class Index extends React.Component<{}, IState> {
  public constructor(props) {
    super(props);
    const types = [];
    for (const i in Types) {
      types.push(i);
    }
    this.state = {
      selected: types[0],
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
