import * as React from "react";
import TextField from "material-ui/TextField";

interface Props {
  submit: (text: string) => any;
}

class Form extends React.Component<Props> {
  state = {
    text: ""
  };

  handleChange = (e: any) => {
    const { name, value }: any = e.target;
    this.setState({
      [name]: value
    });
  };

  onKeyDown = (e: any) => {
    if (e.key === "Enter") {
      this.setState({ text: "" });
      this.props.submit(this.state.text);
    }
  };

  render() {
    return (
      <TextField
        name="text"
        hintText="text"
        onChange={this.handleChange}
        onKeyDown={this.onKeyDown}
        value={this.state.text}
        fullWidth={true}
      />
    );
  }
}

export default Form;
