import React, { useRef, useState, useEffect } from "react";
import Form from "../../../../components/form/Form";
import { changePassword } from "../../../../services/serviceWrapper";
import LabelledInput from "../../../../components/labelledInput/LabelledInput";
import { Container, Alert } from "react-bootstrap";
import Title from "../../../../components/title/Title";
import "./ChangePassword.scss";
import { hasData } from "../../../../utils/utils";
import { navigate, useParams } from "@reach/router";

const ChangePassword = props => {
  const [oldPassword, setOldPassword] = useState();
  const [newPassword, setNewPassword] = useState();
  const [confirmedPassword, setConfirmedPassword] = useState();
  const [style, setStyle] = useState("passwords-do-not-match");
  const [displaySuccessMsg, setDisplaySuccessMsg] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [displayErrorMsg, setDisplayErrorMsg] = useState(false);

  const params = useParams();
  const chagneByAdmin = hasData(props.userId);

  const service = chagneByAdmin ? changePassword.byAdmin : changePassword.byloggedInUser;

  const recordId = props.userId || "";

  const checkPasswordMatch = () => {
    if (confirmedPassword === newPassword) {
      setStyle("passwords-match");
    } else setStyle("passwords-do-not-match");
  };

  const changeInput = input => {
    if (input.name === "oldPassword") {
      setOldPassword(input.value);
    }
    if (input.name === "newPassword") {
      setNewPassword(input.value);
    }
    if (input.name === "confirmPassword") {
      setConfirmedPassword(input.value);
    }
  };

  useEffect(() => {
    if (confirmedPassword?.length >= 10 && confirmedPassword === newPassword) {
      setStyle("passwords-match");
    } else {
      setStyle("passwords-do-not-match");
    }
  }, [oldPassword, newPassword, confirmedPassword]);

  const cb = () => {};
  const passwordChangeCallback = (status, res) => {
    if (hasData(props.callback)) {
      props.callback(status, res);
    } else if (status === "Cancel") navigate(-1);
    else {
      const responseStatus = hasData(res) ? res.status : "";
      const message = hasData(res) ? res.message : "";

      if (responseStatus === "SUCCESS") {
        setDisplayErrorMsg(false);
        setDisplaySuccessMsg(true);
      } else {
        setErrorMessage(message);
        setDisplayErrorMsg(true);
      }
    }
  };

  return (
    <Container className="change-password-container">
      <Title title="Change Password" uri={props.uri} />
      {displayErrorMsg && (
        <Alert variant="danger" dismissible onClose={() => setDisplayErrorMsg(false)}>
          {errorMessage}
        </Alert>
      )}

      {displaySuccessMsg ? (
        <Alert variant="success">Your password has been changed successfully!!</Alert>
      ) : (
        <Form
          submitService={service}
          title=""
          callback={passwordChangeCallback}
          action="add"
          submitText="Submit"
          cancellable
          key={style}
          recordId={recordId}
        >
          {chagneByAdmin ? (
            <></>
          ) : (
            <LabelledInput
              datafield
              labelText="Old Password"
              inputType="password"
              name="oldPassword"
              required={true}
              inputVal={oldPassword}
              alt="nothing"
              callback={cb}
              onChange={changeInput}
              spacebetween
            />
          )}
          <LabelledInput
            datafield
            labelText="New Password"
            inputType="password"
            name="newPassword"
            required={true}
            inputVal={newPassword}
            alt="nothing"
            callback={cb}
            onChange={changeInput}
            spacebetween
          />
          <LabelledInput
            datafield
            labelText="Confirm Password"
            inputType="password"
            name="confirmPassword"
            required={true}
            inputVal={confirmedPassword}
            alt="nothing"
            callback={cb}
            onChange={changeInput}
            className={style}
            spacebetween
          />
        </Form>
      )}
    </Container>
  );
};

ChangePassword.propTypes = {};

export default ChangePassword;
