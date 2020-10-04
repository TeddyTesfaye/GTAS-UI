import React from "react";
import { settingsinfo } from "../../../services/serviceWrapper";
import Form from "../../../components/form/Form";
import LabelledInput from "../../../components/labelledInput/LabelledInput";
import { Container, Col } from "react-bootstrap";
import Title from "../../../components/title/Title";
import Xl8 from "../../../components/xl8/Xl8";

const Settings = ({ name }) => {
  const onChange = (status, result) => {};
  const cb = function() {};

  return (
    <Container fluid>
      <Title title={<Xl8 xid="set001">Settings</Xl8>}></Title>
      <br></br>
      <Container>
        <Col lg={{ span: 4, offset: 4 }}>
          <Form
            getService={settingsinfo.get}
            submitService={settingsinfo.put}
            callback={onChange}
            title=""
            action="edit"
            shouldConfirm={true}
          >
            <LabelledInput
              datafield
              labelText={<Xl8 xid="set002">Matching Threshold</Xl8>}
              inputType="number"
              name="matchingThreshold"
              callback={cb}
              alt={<Xl8 xid="7">Matching Threshold</Xl8>}
            />
            <LabelledInput
              datafield
              labelText={<Xl8 xid="set001">Maximum Passenger Query Results: </Xl8>}
              inputType="number"
              name="maxPassengerQueryResult"
              callback={cb}
              alt="nothing"
            />
            <LabelledInput
              datafield
              labelText={<Xl8 xid="set001">Maximum Flight Query Results: </Xl8>}
              inputType="number"
              name="maxFlightQueryResult"
              callback={cb}
              alt="nothing"
            />
            <LabelledInput
              datafield
              labelText={
                <Xl8 xid="set001">Maximum Rule Hits Allowed Per Run on Rule: </Xl8>
              }
              inputType="number"
              name="maxRuleHit"
              callback={cb}
              alt="nothing"
            />
            <LabelledInput
              datafield
              labelText={<Xl8 xid="set001">APIS Only Flag:</Xl8>}
              inputType="select"
              options={[
                { value: "TRUE", label: "TRUE" },
                { value: "FALSE", label: "FALSE" }
              ]}
              name="apisOnlyFlag"
              callback={cb}
              alt="nothing"
            />
          </Form>
        </Col>
      </Container>
    </Container>
  );
};

export default Settings;
