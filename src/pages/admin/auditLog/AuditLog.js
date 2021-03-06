import React, {useEffect, useState} from "react";
import Table from "../../../components/table/Table";
import { auditlog } from "../../../services/serviceWrapper";
import Title from "../../../components/title/Title";
import Xl8 from "../../../components/xl8/Xl8";
import { Col } from "react-bootstrap";
import SidenavContainer from "../../../components/sidenavContainer/SidenavContainer";
import FilterForm from "../../../components/filterForm2/FilterForm";
import LabelledInput from "../../../components/labelledInput/LabelledInput";
import Main from "../../../components/main/Main";
import {asArray, localeDate} from "../../../utils/utils";

const AuditLog = ({ name }) => {
  const cb = function(result) {};
  const [data, setData] = useState();
  const [refreshKey, setRefreshKey] = useState(1);
  const [filterKey, setFilterKey] = useState(0);
  const [auditActions, setAuditActions] = useState([]);
  const selectAllActions = "Select All Actions";
  let startDate = new Date();
  let endDate = new Date();
  endDate.setDate(endDate.getDate() + 1);
  startDate.setDate(startDate.getDate() - 1);

  const initialParamState = () => {
    return {
      startDate: startDate,
      endDate: endDate
    };
  };

   useEffect(() => {
     auditlog.get.actions().then(res =>{
       let acts = [{label:selectAllActions, value:selectAllActions}]; //Always top dummy value
       acts = acts.concat(asArray(res).map(action => {
         return {
           label: action,
           value: action,
         };
       }));
       setAuditActions(acts);
       setFilterKey(filterKey+1);
     });
   }, []);

  const preFetchCallback = params => {
    let parsedParams = "?";
    if (params) {
      if (params.startDate) {
        parsedParams += "startDate=" + params.startDate.toISOString();
      }
      if (params.endDate) {
        parsedParams += "&endDate=" + params.endDate.toISOString();
      }
      if (params.actionType != selectAllActions) {
        parsedParams += "&actionType=" + params.actionType;
      }
      if (params.user) {
        parsedParams += "&user=" + params.user;
      }
    }
    return parsedParams;
  };

  const headers = [
    {
      Accessor: "actionType",
      Xl8: true,
      Header: ["al005", "Action Type"]
    },
    {
      Accessor: "status",
      Xl8: true,
      Header: ["al006", "Status"]
    },
    {
      Accessor: "message",
      Xl8: true,
      Header: ["al007", "Message"]
    },
    {
      Accessor: "user",
      Xl8: true,
      Header: ["al008", "User"]
    },
    {
      Accessor: "timestamp",
      Xl8: true,
      Header: ["al009", "Timestamp"],
      Cell: ({ row }) => localeDate(row.original.timestampInMilli)
    }
  ];

  const setDataWrapper = res => {
    setData(res);
    setRefreshKey(refreshKey + 1);
  };

  return (
    <>
      <SidenavContainer>
        <Col className="notopmargin">
          <FilterForm
            service={auditlog.get.logs}
            paramCallback={preFetchCallback}
            callback={setDataWrapper}
            getInitialState={initialParamState}
            key={filterKey}
          >
            <LabelledInput
              labelText={<Xl8 xid="al001">User</Xl8>}
              datafield="user"
              name="user"
              inputType="text"
              callback={cb}
              alt="User"
            />
            <LabelledInput
              labelText={<Xl8 xid="al002">Actions</Xl8>}
              datafield="actionType"
              inputType="select"
              name="actionType"
              inputVal={selectAllActions}
              options={auditActions}
              required={true}
              alt="nothing"
              callback={cb}
            />
            <LabelledInput
              datafield
              inputType="dateTime"
              inputVal={startDate}
              labelText={<Xl8 xid="al003">Start Date</Xl8>}
              name="startDate"
              callback={cb}
              required={true}
              alt="Start Date"
            />
            <LabelledInput
              datafield
              inputType="dateTime"
              inputVal={endDate}
              labelText={<Xl8 xid="al004">End Date</Xl8>}
              name="endDate"
              callback={cb}
              required={true}
              alt="End Date"
            />
          </FilterForm>
        </Col>
      </SidenavContainer>
      <Main>
        <Title title={name}></Title>
        <Table
          data={data}
          key={refreshKey}
          id="Audit Log"
          callback={cb}
          header={headers}
        ></Table>
      </Main>
    </>
  );
};

export default AuditLog;
