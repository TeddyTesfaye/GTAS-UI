import React from "react";
import { localeMonthDayTime, hasData, alt } from "../../utils/utils";
import { Row } from "react-bootstrap";
import "./HitsBadge.css";

const HitsBadge = props => {
  return (
    <span className="hits-table">
      <span className="hits-cell">
        {props.high > 0 && (
          <>
            <i className="fa fa-flag hits-flag high" title="top severity"></i>
            {props.high}
          </>
        )}
      </span>
      <span className="hits-cell">
        {props.med > 0 && (
          <>
            <i className="fa fa-flag hits-flag med" title="high severity"></i>
            {props.med}
          </>
        )}
      </span>
      <span className="hits-cell">
        {props.low > 0 && (
          <>
            <i className="fa fa-flag hits-flag low" title="normal severity"></i>
            {props.low}
          </>
        )}
      </span>
    </span>
  );
};

export default HitsBadge;
