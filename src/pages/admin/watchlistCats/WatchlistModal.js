import React, { useState } from "react";
import { Modal, Button, Container, Alert } from "react-bootstrap";
import Form from "../../../components/form/Form";
import Xid from "../../../components/xid/Xid";
import { watchlistcatspost } from "../../../services/serviceWrapper";
import LabelledInput from "../../../components/labelledInput/LabelledInput";
import { ACTION } from "../../../utils/constants";

const WatchlistModal = props => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertContent, setAlertContent] = useState("");
  const [variant, setVariant] = useState("");
  const cb = function(result) {};
  const severityLevels = [
    { value: "Top", label: "Top" },
    { value: "High", label: "High" },
    { value: "Normal", label: "Normal" }
  ];

  const postSubmit = (status, res) => {
    props.onHide();

    if (status !== ACTION.CANCEL) props.refresh();
  };

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <Xid xid="2">Add Watchlist Category</Xid>
        </Modal.Title>
      </Modal.Header>
      <Alert show={showAlert} variant={variant}>
        {alertContent}
        <hr />
        <Xid xid="7">
          <Button onClick={() => setShowAlert(false)} variant="outline-success">
            Confirm
          </Button>
        </Xid>
      </Alert>
      <Modal.Body>
        <Container fluid>
          <Form
            submitService={watchlistcatspost.post}
            callback={postSubmit}
            action="add"
            cancellable
            afterProcessed={props.onHide}
          >
            <LabelledInput
              datafield
              labelText={<Xid xid="2">Watchlist Category Name:</Xid>}
              inputType="text"
              name="label"
              required={true}
              alt="nothing"
              callback={cb}
            />
            <LabelledInput
              datafield
              labelText={<Xid xid="2">Watchlist Category Description:</Xid>}
              inputType="textarea"
              name="description"
              required={true}
              alt="nothing"
              callback={cb}
            />
            <LabelledInput
              datafield
              labelText="Watchlist Severity Level:"
              inputType="select"
              name="severity"
              placeholder="Choose Severity Level..."
              options={severityLevels}
              required={true}
              alt="nothing"
              callback={cb}
            />
          </Form>
        </Container>
      </Modal.Body>
    </Modal>
  );
};

export default WatchlistModal;
