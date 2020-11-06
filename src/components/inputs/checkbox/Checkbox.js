import React, { useState } from "react";
import PropTypes from "prop-types";

/**
 * **Checkbox and Radio input component.**
 */
const CheckboxInput = props => {
  const [selected, setSelected] = useState(props.selected);

  const onChange = () => {
    setSelected(!selected);
    const filterFormUpdate = {
      name: props.name,
      value: !selected
    };
    props.callback({ target: filterFormUpdate });
  };
  const style = (props.className || "undefined").replace("undefined");
  const divstyle = style.replace("checkbox");

  return (
    // <div className={divstyle}>
    <input
      name={props.name}
      id={props.name}
      onChange={onChange}
      className={style}
      type={props.inputType}
      value={props.inputVal}
      checked={selected}
      disabled={props.disabled || props.readOnly}
    />
    // </div>
  );
};

CheckboxInput.propTypes = {
  inputType: PropTypes.oneOf(["checkbox", "radio", "toggle"]),
  inputVal: PropTypes.any,
  name: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  // options: PropTypes.array.isRequired,
  required: PropTypes.oneOf(["required", true, ""]),
  selected: PropTypes.oneOf(["true", "", undefined, true, false]),
  callback: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  className: PropTypes.bool
};
export default CheckboxInput;
