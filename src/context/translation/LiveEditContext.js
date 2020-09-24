import React, { createContext, useReducer, createRef, useState } from "react";
import LangModal from "../../pages/home/LangModal";
import { hasData } from "../../utils/utils";

export const LiveEditContext = createContext();
const modalRef = createRef();

const LiveEditProvider = ({ children }) => {
  const [showModal, setShowModal] = useState();
  const { Provider } = LiveEditContext;

  const LiveEditReducer = (state, action) => {
    let updatedState = JSON.parse(sessionStorage.getItem("liveEditState")) || {};
    switch (action.type) {
      case "show": {
        // updatedState.show = true;
        updatedState.data = action.data;
        sessionStorage.setItem("liveEditState", JSON.stringify(updatedState));

        return updatedState;
      }
      case "hide": {
        // updatedState.show = false;
        // sessionStorage.setItem("liveEditState", JSON.stringify(updatedState));
        setShowModal(false);
        return updatedState;
      }
      case "edit": {
        updatedState.isEdit = true;
        sessionStorage.setItem("liveEditState", JSON.stringify(updatedState));
        return updatedState;
      }
      case "read": {
        updatedState.isEdit = false;
        updatedState.data = null;
        sessionStorage.setItem("liveEditState", JSON.stringify(updatedState));
        return updatedState;
      }
      default: {
        return updatedState;
      }
    }
  };

  const initContext = {
    hideModal: () => null,
    show: false,
    showModal: () => null,
    isEdit: false,
    data: null
  };
  const [editState, action] = useReducer(LiveEditReducer, initContext);

  const getLiveEditState = () => {
    const stored = JSON.parse(sessionStorage.getItem("liveEditState"));

    return stored || editState;
  };

  const onHide = () => {
    setShowModal(false);
  };

  return (
    <Provider value={{ getLiveEditState, action, setShowModal }}>
      <>
        {children}
        <LangModal
          show={showModal}
          elem={editState.data}
          ref={modalRef}
          onHide={onHide}
        ></LangModal>
      </>
    </Provider>
  );
};

export default LiveEditProvider;
