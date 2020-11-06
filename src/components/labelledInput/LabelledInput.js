import React, { Component } from "react";
import PropTypes from "prop-types";
import CheckboxInput from "../inputs/checkbox/Checkbox";
import CheckboxGroup from "../inputs/checkboxGroup/CheckboxGroup";
import TextInput from "../inputs/text/Text";
import TextareaInput from "../inputs/textarea/Textarea";
import FileInput from "../inputs/file/File";
import SelectInput from "../inputs/select/Select";
import LabelInput from "../inputs/label/Label";
import { hasData, alt } from "../../utils/utils";
import { FormGroup } from "react-bootstrap";
import "./LabelledInput.css";
import ReactDateTimePicker from "../inputs/dateTimePicker/DateTimePicker";

const textTypes = ["text", "number", "password", "email", "search", "tel"];
const boolTypes = ["radio", "checkbox", "toggle"];
const selectType = ["select", "multiSelect"];
const checkboxGroup = "checkboxGroup";
const textareaType = "textarea";
const fileType = "file";
const REQUIRED = "required";
const dateTime = "dateTime";

// TODO - refac as a passthru hook!!!
// Pass props through directly, remove all awareness of specific child types
// remove all proptypes not related to the label or form group
class LabelledInput extends Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.onChangeArray = this.onChangeArray.bind(this);
    this.onMultiSelectChange = this.onMultiSelectChange.bind(this);
    this.onChangeDatePicker = this.onChangeDatePicker.bind(this);

    const textlabelStyle = this.props.inputType === "multiSelect" ? "" : "txtlabel";
    const lbl = <label className={textlabelStyle}>{alt(props.labelText)}</label>;

    this.state = {
      isValid: true,
      // labelText: alt(props.labelText),
      label: lbl,
      inputVal: alt(props.inputVal),
      options: props.options,
      placeholder: alt(props.placeholder),
      required: alt(props.required),
      visibleStyle: alt(props.isVisible)
    };
  }

  onChange(e) {
    const value = e.target.value;

    this.setState({
      inputVal: value,
      selected: value,
      isValid: hasData(value) || this.props.required !== REQUIRED
    });

    if (e.target.name === "showDateTimePicker") {
      this.props.toggleDateTimePicker(e.target.value);
    }
    this.props.callback(e.target);
    if (hasData(this.props.onChange)) {
      this.props.onChange(e.target);
    }
  }

  onChangeArray(e, label) {
    this.setState({
      inputVal: e.value,
      isValid: hasData(e) || this.props.required !== REQUIRED
    });

    this.props.callback(e);
  }

  onMultiSelectChange(e) {
    this.setState({
      inputVal: e,
      isValid: hasData(e) || this.props.required !== REQUIRED
    });

    this.props.callback({ value: e, name: this.props.name });
  }

  onChangeDatePicker(e) {
    this.setState({
      inputVal: e,
      isValid: hasData(e) || this.props.required !== REQUIRED
    });
    this.props.callback({ value: e, name: this.props.name });
  }

  //APB - REFACTOR
  getInputByType() {
    const type = this.props.inputType;
    const inputStyle = `${alt(type)} ${alt(this.props.className)}`;

    if (type === textareaType) {
      return (
        <>
          {this.state.label}
          <TextareaInput
            className={inputStyle}
            alt={this.props.alt}
            name={this.props.name}
            inputType={this.props.inputType}
            inputVal={alt(this.state.inputVal)}
            callback={this.onChange}
            required={this.state.required}
            placeholder={this.state.placeholder}
            readOnly={this.props.readOnly}
          />
        </>
      );
    }

    if (type === "label") {
      return (
        <>
          {this.state.label}
          <LabelInput
            className={this.props.inputStyle}
            alt={this.props.alt}
            name={this.props.name}
            inputVal={this.props.inputVal}
            inline={this.props.inline}
          />
        </>
      );
    }

    if (textTypes.includes(type)) {
      return (
        <>
          {this.state.label}
          <TextInput
            autoFocus={this.props.autoFocus}
            pattern={this.props.pattern}
            className={this.props.className}
            alt={this.props.alt}
            name={this.props.name}
            inputType={this.props.inputType}
            inputVal={alt(this.state.inputVal)}
            required={this.state.required}
            placeholder={this.state.placeholder}
            maxlength={this.props.maxlength}
            readOnly={this.props.readOnly}
            callback={this.onChange}
          />
        </>
      );
    }
    if (selectType.includes(type)) {
      return (
        <>
          {this.state.label}
          <SelectInput
            autoFocus={this.props.autoFocus}
            className={inputStyle}
            alt={this.props.alt}
            name={this.props.name}
            inputType={this.props.inputType}
            selected={this.props.inputVal}
            callback={type === "select" ? this.onChange : this.onMultiSelectChange}
            required={this.state.required}
            placeholder={this.state.placeholder}
            options={this.state.options}
            readOnly={this.props.readOnly}
          />
        </>
      );
    }
    if (boolTypes.includes(type)) {
      return (
        <>
          <CheckboxInput
            className={inputStyle}
            name={this.props.name}
            key={this.props.name}
            inputType={this.props.inputType}
            inputVal={this.props.inputVal}
            callback={this.onChange}
            required={this.state.required}
            selected={this.props.selected}
            placeholder={this.state.placeholder}
            alt={this.props.alt}
            readOnly={this.props.readOnly}
          />
          {this.state.label}
        </>
      );
    }
    if (checkboxGroup === type) {
      return (
        <>
          {this.props.labelText && <br />}
          <CheckboxGroup
            collection={this.props.collection}
            className={inputStyle}
            name={this.props.name}
            label={this.props.labelText}
            key={this.props.name}
            inputType="checkbox"
            inputVal={this.props.inputVal}
            callback={this.onChangeArray}
            required={this.state.required}
            selected={this.props.selected}
            placeholder={this.state.placeholder}
            alt={this.props.alt}
            readOnly={this.props.readOnly}
          />
        </>
      );
    }
    if (type === fileType) {
      return (
        <FileInput
          className={inputStyle}
          name={this.props.name}
          inputType={this.props.inputType}
          inputVal={this.props.inputVal}
          options={this.state.options}
          callback={this.onChange}
          required={this.state.required}
          placeholder={this.state.placeholder}
          alt={this.props.alt}
        />
      );
    }

    if (type === dateTime) {
      return (
        <>
          {this.state.label}
          <ReactDateTimePicker
            className={inputStyle}
            name={this.props.name}
            inputVal={this.props.inputVal}
            callback={this.onChangeDatePicker}
            required={this.state.required}
            readOnly={this.props.readOnly}
          />
        </>
      );
    }

    return null;
  }

  render() {
    const cls = !!this.props.spacebetween ? " space-between" : "";
    const inline = !!this.props.inline ? " input-group-append" : "";
    const ckb = this.props.inputType === "checkbox" ? " funkyradio" : "";

    return (
      <FormGroup className={`${this.state.visibleStyle}${cls}${inline}${ckb}`}>
        {this.getInputByType()}
      </FormGroup>
    );
  }
}

LabelledInput.propTypes = {
  name: PropTypes.string,
  autoFocus: PropTypes.oneOf([true, ""]),
  labelText: PropTypes.oneOf([PropTypes.string, PropTypes.object]),
  inputType: PropTypes.oneOf([
    "text",
    "textarea",
    "number",
    "password",
    "select",
    "radio",
    "checkbox",
    "checkboxGroup",
    "toggle",
    "email",
    "search",
    "tel",
    "label",
    "file",
    "multiSelect",
    "dateTime"
  ]).isRequired,
  callback: PropTypes.func,
  inputVal: PropTypes.any,
  selected: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
  options: PropTypes.array,
  placeholder: PropTypes.string,
  required: PropTypes.oneOf([REQUIRED, "", true]),
  isVisible: PropTypes.bool,
  readOnly: PropTypes.bool,
  onChange: PropTypes.func,
  toggleDateTimePicker: PropTypes.func
};

export default LabelledInput;
