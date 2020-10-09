import React, { useState, useEffect } from "react";
import Table from "../../components/table/Table";
import Title from "../../components/title/Title";
import { Link } from "@reach/router";
import LabelledInput from "../../components/labelledInput/LabelledInput";
import FilterForm from "../../components/filterForm2/FilterForm";
import Main from "../../components/main/Main";
import SidenavContainer from "../../components/sidenavContainer/SidenavContainer";
import CountdownBadge from "../../components/countdownBadge/CountdownBadge";

import { Col, Tabs, Tab } from "react-bootstrap";
import { hasData, alt, localeDate, asArray } from "../../utils/utils";
import { TIME } from "../../utils/constants";

import { flights } from "../../services/serviceWrapper";
import "./Flights.css";
import Xl8 from "../../components/xl8/Xl8";

const Flights = props => {
  const cb = () => {};
  const initTableState = {
    pageIndex: 0,
    pageSize: 50,
    sortBy: [{ id: "timer", desc: false }]
  };

  const [data, setData] = useState();
  const [hitData, setHitData] = useState();
  const [allData, setAllData] = useState();
  const [tab, setTab] = useState("all");
  const [tablekey, setTablekey] = useState(0);
  const [tableState, setTableState] = useState(initTableState);

  const setDataWrapper = (data, retainState) => {
    if (!retainState) setTableState(initTableState);

    const parsedAll = asArray(data).map(item => {
      const future = item.direction === "O" ? item.etd : item.eta;
      item.timer = future;
      item.sendRowToLink = `/gtas/flightpax/${item.id}`;

      const severity = alt(item.ruleHitCount, 0) + alt(item.listHitCount, 0);
      item.severity = severity > 0 ? severity : "";

      return item;
    });

    const parsedHits = parsedAll.filter(item => {
      return item.severity > 0;
    });

    setAllData(alt(parsedAll, []));
    setHitData(alt(parsedHits, []));

    const newkey = tablekey + 1;
    setTablekey(newkey);
  };

  //TODO: refactor
  const preFetchCallback = fields => {
    const range = +fields["hourRange"] || 96; // default to 96 hours

    let etaEnd = new Date();
    etaEnd.setHours(etaEnd.getHours() + range);

    const fieldscopy = Object.assign([], fields);
    delete fieldscopy["hourRange"]; // hourRange is not passed directly to the backend

    const oneHourAgo = new Date().setHours(new Date().getHours() - 1);
    let paramObject = { etaStart: oneHourAgo, etaEnd: etaEnd };

    const fieldNames = Object.keys(fieldscopy);
    fieldNames.forEach(name => {
      if (hasData(fieldscopy[name])) {
        if (name === "destinationAirports" || name === "originAirports") {
          // retrieve raw comma- or whitespace-separated text, convert to array, remove empties.
          const airports = fieldscopy[name]
            .replace(",", " ")
            .split(" ")
            .filter(Boolean);
          paramObject[name] = [...new Set(airports)]; // scrub duplicate vals
        } else paramObject[name] = fieldscopy[name];
      }
    });

    return "?request=" + encodeURIComponent(JSON.stringify(paramObject));
  };

  const now = new Date();

  const Headers = [
    {
      Accessor: "timer",
      Xl8: true,
      Header: ["fl009", "Timer"],
      Cell: ({ row }) => (
        <CountdownBadge future={row.original.timer} baseline={now}></CountdownBadge>
      )
    },
    {
      Accessor: "eta",
      Xl8: true,
      Header: ["fl010", "Arrival"],
      Cell: ({ row }) => localeDate(row.original.eta)
    },
    {
      Accessor: "etd",
      Xl8: true,
      Header: ["fl011", "Departure"],
      Cell: ({ row }) => localeDate(row.original.etd)
    },
    {
      Accessor: "passengerCount",
      Xl8: true,
      Header: ["fl012", "Passengers"],
      Cell: ({ row }) => (
        <Link to={"../flightpax/" + row.original.id}>{row.original.passengerCount}</Link>
      )
    },
    { Accessor: "fullFlightNumber", Xl8: true, Header: ["fl013", "Flight"] },
    { Accessor: "origin", Xl8: true, Header: ["fl014", "Origin"] },
    { Accessor: "destination", Xl8: true, Header: ["fl015", "Destination"] },
    { Accessor: "direction", Xl8: true, Header: ["fl016", "Direction"] },
    { Accessor: "severity", Xl8: true, Header: ["fl017", "Severity"] }
    // TODO: how to summarize hits??
    // { Accessor: "ruleHitCount" },
    // { Accessor: "listHitCount" },
    // { Accessor: "graphHitCount" }
  ];

  useEffect(() => {
    if (tab === "hits") setData(hitData);
    else setData(allData);

    const newkey = tablekey + 1;
    setTablekey(newkey);
  }, [hitData, tab]);

  const directions = [
    { value: "A", label: "All" },
    { value: "I", label: "Inbound" },
    { value: "O", label: "Outbound" }
  ];

  const stateCallback = latestState => {
    if (
      alt(latestState.pageSize) !== alt(tableState.pageSize) ||
      alt(latestState.pageIndex) !== alt(tableState.pageIndex) ||
      alt(latestState.sortBy) !== alt(tableState.sortBy)
    ) {
      setTableState(latestState);
    }
  };

  const getTableState = () => {
    return tableState;
  };

  const tabs = (
    <Tabs defaultActiveKey="all" id="flightTabs">
      <Tab
        eventKey="all"
        title={
          <Xl8 xid="fl001" id="flightTabs-tab-all">
            All
          </Xl8>
        }
      ></Tab>
      <Tab
        eventKey="hits"
        title={
          <Xl8 xid="fl002" id="flightTabs-tab-hits">
            Hits
          </Xl8>
        }
      ></Tab>
    </Tabs>
  );

  const titleTabCallback = ev => {
    const id = ev.split("-")[2];

    if (id) setTab(id);
  };

  return (
    <>
      <SidenavContainer>
        <Col>
          <FilterForm
            service={flights.get}
            paramCallback={preFetchCallback}
            callback={setDataWrapper}
            interval={TIME.MINUTE}
          >
            <br />
            <LabelledInput
              labelText={<Xl8 xid="fl003"> Origin Airports</Xl8>}
              datafield="originAirports"
              name="originAirports"
              inputType="text"
              callback={cb}
              alt={<Xl8 xid="0">Origin Airports</Xl8>}
            />
            <LabelledInput
              labelText={<Xl8 xid="fl004"> Destination Airports</Xl8>}
              datafield="destinationAirports"
              name="destinationAirports"
              inputType="text"
              callback={cb}
              alt={<Xl8 xid="1"> Destination Airports</Xl8>}
            />
            <LabelledInput
              datafield="flightNumber"
              labelText={<Xl8 xid="fl005">Flight Number</Xl8>}
              inputType="text"
              name="flightNumber"
              callback={cb}
              alt={<Xl8 xid="7">Flight Number</Xl8>}
            />
            <LabelledInput
              datafield="direction"
              inputType="select"
              labelText={<Xl8 xid="fl006">Direction</Xl8>}
              inputStyle="form-select"
              callback={cb}
              name="direction"
              options={directions}
              alt={<Xl8 xid="7">Flight Direction</Xl8>}
            />
            <LabelledInput
              labelText={<Xl8 xid="fl007">Hour Range</Xl8>}
              inputType="select"
              name="hourRange"
              inputVal="96"
              inputStyle="form-select"
              datafield="hourRange"
              options={[
                { value: "6", label: "+6 hours" },
                { value: "12", label: "+12 hours" },
                { value: "24", label: "+24 hours" },
                { value: "48", label: "+48 hours" },
                { value: "96", label: "+96 hours" }
              ]}
              callback={cb}
              alt=""
            />
          </FilterForm>
        </Col>
      </SidenavContainer>
      <Main>
        <Title
          title={<Xl8 xid="fl008">Flights</Xl8>}
          uri={props.uri}
          leftChild={tabs}
          leftCb={titleTabCallback}
        />
        <Table
          data={data}
          key={tablekey}
          header={Headers}
          callback={cb}
          stateVals={getTableState}
          stateCb={stateCallback}
        />
      </Main>
    </>
  );
};

export default Flights;
