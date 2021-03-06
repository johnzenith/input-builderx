import * as React from 'react';
import { PropType } from './../types';

type StateType = { value: any; hasFocus: boolean };

class InputX extends React.Component<
  PropType & React.HTMLProps<HTMLInputElement> & { innerRef?: any },
  StateType
> {
  constructor(props: PropType) {
    super(props);
    let value = props.value;
    if (props.inputProcessor) {
      value = props.inputProcessor({ target: { value } });
    }
    this.state = { value, hasFocus: false };
  }

  static getDerivedStateFromProps(props: PropType, state: StateType) {
    if (!state.hasFocus) {
      let value = props.value;
      if (props.inputProcessor) {
        value = props.inputProcessor({ target: { value } });
      }
      return { value };
    }
    return {};
  }
  onChange = (e: any) => {
    let value: any = e.target.value;
    if (
      (this.props.validator && this.props.validator(e)) ||
      !this.props.validator
    ) {
      let newEv = { ...e };
      if (this.props.outputProcessor) {
        newEv['target']['value'] = this.props.outputProcessor(e);
      }
      if (this.props.onChange) {
        this.props.onChange(newEv);
      }
    }
    this.setState({ value });
  };

  render() {
    const {
      value,
      onChange,
      validator,
      inputProcessor,
      outputProcessor,
      innerRef,
      ...inputProps
    } = this.props;
    return (
      <input
        {...inputProps}
        ref={innerRef}
        type={this.props.type || 'text'}
        value={this.state.value}
        onFocus={(e: any) => {
          if (this.props.onFocus) {
            this.props.onFocus(e);
          }
          this.setState({ hasFocus: true });
        }}
        onBlur={(e: any) => {
          if (this.props.onBlur) {
            this.props.onBlur(e);
          }
          this.setState({ hasFocus: false });
        }}
        onChange={(e: any) => this.onChange(e)}
      />
    );
  }
}

export default React.forwardRef(
  (props: PropType & React.HTMLProps<HTMLInputElement>, ref) => (
    <InputX innerRef={ref} {...props} ref={null} />
  )
);
