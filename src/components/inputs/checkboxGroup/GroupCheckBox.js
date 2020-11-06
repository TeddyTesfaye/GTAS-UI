/*
 *
 *  * All Application code is Copyright 2016, The Department of Homeland Security (DHS), U.S. Customs and Border Protection (CBP).
 *  *
 *  * Please see LICENSE.txt for details.
 *
 */

import React from "react";

const GroupCheckBox = ({ value, onChange, id, name, disabled }) => {
  const handleChange = event => {
    const text = event.target.value;
    onChange(id, text);
  };

  return (
    <div className="gtas-checkbox-style">
      <input
        id={id}
        type="checkbox"
        disabled={disabled}
        onChange={handleChange}
        checked={value}
        value={value}
      />
      <label for={id}>{name}</label>
    </div>
  );
};

export default GroupCheckBox;
