import React, {useEffect, useState} from "react";
import {Alert, Button, Container, Modal} from "react-bootstrap";
import {attachment, paxEventNotesHistory, users} from "../../../services/serviceWrapper";
import "./UploadAttachment.scss";
import LabelledInput from "../../../components/labelledInput/LabelledInput";
import Form from "../../../components/form/Form";
import {ACTION} from "../../../utils/constants";

const AttachmentModal = props => {
    const cb = function(result) {};
    const [selectedFiles,setSelectedFiles] = useState([]);
    const [filesForDisplay, setFilesForDisplay] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [alertContent, setAlertContent] = useState("");
    const [variant, setVariant] = useState("");
    const paxId = props.paxId;

    const handleClose = (status, res) => {
        setShowAlert(false);
        setSelectedFiles([]);
        props.onHide();
        props.callback(status, res);
    };

    const postSubmit = (status, resp) => {
        if(status === ACTION.CANCEL){
            handleClose();
        } else {
            if(resp.status === "SUCCESS"){
                handleClose(status,resp);
            } else {
                setVariant("danger");
                (typeof resp.message != "undefined" && resp.message != null) ? setAlertContent(resp.message) : setAlertContent("There was an issue with the server for that request.");
                setShowAlert(true);
                setSelectedFiles([]);
            }
        }
    };

    const onChangeCb = ev => {
        console.log(ev.target.files);
        if(maxFileSelect(ev) && maxFileSize) {
            setSelectedFiles(ev.target.files);
        }
    };

    const maxFileSelect= ev =>{
        let files = ev.target.files // create file object
        if (files.length > 4) {
            const msg = 'Only 4 files may be uploaded at a time';
            ev.target.value = null // discard selected file
            console.log(msg)
            return false;
        }
        return true;
    };

    const maxFileSize= ev =>{
        let files = ev.target.files
        let size = 15000
        let err = "";
        for(var x = 0; x<files.length; x++) {
            if (files[x].size > size) {
                err += files[x].type+' exceeds file size limit \n';
            }
        };
        if (err !== '') {
            ev.target.value = null
            console.log(err)
            return false
        }
        return true;
    };

    const preSubmit = fields => {
        let res = { ...fields[0] };
        if (typeof selectedFiles != "undefined" && selectedFiles != null) {
            let desc = [];
            const formData = new FormData();
            for (let x = 0; x < selectedFiles.length; x++) {
                formData.append("file", selectedFiles[x]);
                desc.push(res.description);
            }
            formData.append("descriptions", desc);
            formData.append("paxId", paxId);
            return [formData];
        }
    };

    useEffect(() => {
        const listItems = [];
        if (selectedFiles != null && typeof selectedFiles != "undefined") {
            for (let x = 0; x < selectedFiles.length; x++) {
                listItems.push(selectedFiles[x]);
            }
        } else { setFilesForDisplay(null);}
        setFilesForDisplay(listItems);
    }, [selectedFiles]);

    return (
        <>
        <Modal
            show={props.show}
            onHide={handleClose}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>Attachments</Modal.Title>
            </Modal.Header>
            <Alert show={showAlert} variant={variant}>
                {alertContent}
                <hr />
                <Button onClick={() => setShowAlert(false)} variant="outline-success">
                    Confirm
                </Button>
            </Alert>
            <Modal.Body>
                <div className="container">
                    <div className="files">
                        <input type="file" multiple onChange={onChangeCb}/>
                    </div>
                </div>
                {filesForDisplay != null && !filesForDisplay.empty && filesForDisplay.length > 0? (
                    <div className="container">
                        Files To Be Uploaded:
                        <ul>
                            {filesForDisplay.map((data,index) =>{
                                return  <li key={index}><u>File Name:</u> {data.name} <br></br> <u>File Size: </u>{data.size} kbs</li>;
                            })}
                        </ul>
                    </div>
                ) : ( <div></div>) }
                <Form
                    submitService={attachment.post}
                    title=""
                    callback={postSubmit}
                    action="add"
                    submitText="Upload"
                    paramCallback={preSubmit}
                    cancellable
                >
                    <LabelledInput
                        datafield="description"
                        inputType="textarea"
                        labelText=""
                        placeholder="Add description for entire upload here..."
                        name="description"
                        required={true}
                        alt="nothing"
                        callback={cb}
                    />
                </Form>
            </Modal.Body>
        </Modal>
        </>
    );
};

export default AttachmentModal;
