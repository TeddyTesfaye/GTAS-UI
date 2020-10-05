import React, { useState, useEffect, useContext } from "react";
import Form from "../../components/form/Form";
import LabelledInput from "../../components/labelledInput/LabelledInput";
import Xl8 from "../../components/xl8/Xl8";
import { ROLE } from "../../utils/constants";
import { login } from "../../services/serviceWrapper";
import { Alert, Card, Button } from "react-bootstrap";
import { navigate, Link } from "@reach/router";
import { UserContext } from "../../context/user/UserContext";
import { LiveEditContext } from "../../context/translation/LiveEditContext";
import "./Login.scss";
import Logo from "../../images/WCO_GTAS_logo.svg";

const Login = () => {
  const [stopEdit, setStopEdit] = useState(false);
  const ctx = useContext(UserContext);
  const { getLiveEditState, action } = useContext(LiveEditContext);
  const editstate = getLiveEditState();

  const [alertVis, setAlertVis] = useState(false);
  const [showDangerModal, setShowDangerModal] = useState(false);

  useEffect(() => {
    const user = ctx.getUserState() || {};
    if (editstate.isEdit && user.userRoles?.includes(ROLE.ADMIN)) {
      setStopEdit(true);
    } else {
      if (editstate.isEdit) {
        setStopEdit(true);
      }
      ctx.userAction({ type: "logoff" });
    }
  }, []);

  useEffect(() => {
    action({ type: "read" });
    if (stopEdit) window.location.reload();
  }, [stopEdit]);

  const loginHandler = (status, res) => {
    if (res?.userId) {
      const newuser = {
        authenticated: true,
        fullName: `${res.lastName}, ${res.firstName}`,
        userId: res.userId,
        userRoles: res.roles.map(item => item.roleDescription),
        // userToken: Cookies.get("JSESSIONID"),
        queryPageSize: 25,
        userPageSize: 25,
        landingPage: undefined,
        emailEnabled: res.emailEnabled,
        highPriorityEmail: res.highPriorityEmail
      };

      ctx.userAction({ user: newuser, type: "login" });
      navigate("/gtas/flights");
    }

    setAlertVis(true);
  };

  return (
    <div className="login-page-container">
      <Card className="transparent-white-card">
        <Card.Img variant="top" src={Logo} className="logo" />
        <div className="placeholder"></div>
        <Card.Body className="login-card-body">
          <Link to="/forgot-password">
            <Xl8 xid="login001">Forgot my password</Xl8>
          </Link>
          <br />
          <Form
            title=""
            submitText={<Xl8 xid="login002">Login</Xl8>}
            submitService={login.post}
            callback={loginHandler}
            id="loginform"
          >
            <LabelledInput
              inputType="text"
              alt="Enter the user name"
              name="username"
              labelText=""
              placeholder="Username"
              datafield="username"
              required="required"
              inputVal=""
              autofocus="true"
              className="login-labeled-input"
            />
            <LabelledInput
              inputType="password"
              alt="Enter the password"
              name="password"
              labelText=""
              placeholder="Password"
              datafield="password"
              required="required"
              inputVal=""
              className="login-labeled-input"
            />
          </Form>
          <div>
            {alertVis ? (
              <Alert variant="danger" dismissible onClose={() => setAlertVis(false)}>
                <Xl8 xid="login003">Login Failed</Xl8>
              </Alert>
            ) : (
              <Button variant="outline-info" onClick={() => navigate("/signup")}>
                <Xl8 xid="login004">Sign Up</Xl8>
              </Button>
            )}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Login;
