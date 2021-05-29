import * as React from "react";
import classNames from "classnames";

interface IProps {
  readonly checked: boolean;
  readonly halfChecked?: boolean;
  readonly label?: string;
  readonly className?: string;
  readonly onChanged: (checked: boolean) => void;
}

export class Checkbox extends React.Component<IProps, {}> {
  private onClick = (event: React.MouseEvent<HTMLInputElement>) => {
    const checked = event.currentTarget.checked;
    this.props.onChanged(checked);
  };

  private onChange = () => {};

  public render() {
    const { className, checked, halfChecked, label } = this.props;

    const rcClass = classNames("rc-checkbox", className);
    const boxClass = classNames("rc-checkbox-box", {
      "rc-checkbox-checked": checked,
      "rc-checkbox-half-checked": !checked && halfChecked,
    });

    return (
      <div className={rcClass}>
        <span className={boxClass}>
          <input
            className="rc-checkbox-input"
            type="checkbox"
            onClick={this.onClick}
            onChange={this.onChange}
            checked={checked}
          />
          <span className="rc-checkbox-inner" />
        </span>
        {label ? <span>{label}</span> : null}
      </div>
    );
  }
}
