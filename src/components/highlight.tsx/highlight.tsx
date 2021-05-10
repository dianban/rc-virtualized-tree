import * as React from "react";

interface IProps {
  readonly text: string;
  readonly keywords?: string;
}

interface IState {
  readonly start: number | null;
  readonly end: number | null;
}

export class Highlight extends React.Component<IProps, IState> {
  public constructor(props: IProps) {
    super(props);
    this.state = {
      start: null,
      end: null,
    };
  }

  public componentDidMount(): void {
    this.updateStartEnd();
  }

  public componentDidUpdate(
    prevProps: Readonly<IProps>,
    prevState: Readonly<IState>,
    snapshot?: any
  ): void {
    if (
      prevProps.text !== this.props.text ||
      prevProps.keywords !== this.props.keywords
    ) {
      this.updateStartEnd();
    }
  }

  private updateStartEnd = () => {
    const { keywords, text } = this.props;
    if (keywords && text) {
      const index = text.indexOf(keywords);
      if (index > -1) {
        this.setState({
          start: index,
          end: index + keywords.length,
        });
        return;
      }
    }
    this.setState({ start: null, end: null });
  };

  public render() {
    const { text, keywords } = this.props;
    const { start, end } = this.state;

    if (start === null || end === null) {
      return text;
    }

    return (
      <span>
        {text.slice(0, start)}
        <mark>{keywords}</mark>
        {text.slice(end)}
      </span>
    );
  }
}
