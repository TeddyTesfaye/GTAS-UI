import React from "react";
import Title from "../../components/title/Title";
import Xl8 from "../../components/xl8/Xl8";
import Main from "../../components/main/Main";
import ExternalLink from "../../components/externalLink/ExternalLink";
import { Card, CardDeck, Container } from "react-bootstrap";
import { hasData, getEndpoint } from "../../utils/utils";
import { Link } from "@reach/router";
import "./Admin.css";

const Admin = props => {
  const children = props.children?.props?.children;

  if (getEndpoint(props.location?.pathname) === "admin")
    return (
      <Main className="full-cards">
        <Title title={<Xl8 xid="adm001">Admin</Xl8>} />
        <CardDeck className="page-deck">
          {children.map(info => {
            const data = info.props;
            return (
              <Card className="page-tiles card-shadow" key={data.path}>
                {data.hasExternalLink ? (
                  <ExternalLink to={data.path} className="card-link">
                    <Card.Body>
                      <Card.Title className="nowrap">
                        <i className={`fa fa-3x ${data.icon}`}></i>
                      </Card.Title>
                      <div className="card-overlay">{data.name}</div>
                      <div className="card-description">
                        <Card.Text>{data.desc}</Card.Text>
                      </div>
                    </Card.Body>
                  </ExternalLink>
                ) : (
                  <Link to={data.path} className="card-link">
                    <Card.Body>
                      <Card.Title className="nowrap">
                        <i className={`fa fa-3x ${data.icon}`}></i>
                      </Card.Title>
                      <div className="card-overlay">{data.name}</div>
                      <div className="card-description">
                        <Card.Text>{data.desc}</Card.Text>
                      </div>
                    </Card.Body>
                  </Link>
                )}
              </Card>
            );
          })}
        </CardDeck>
      </Main>
    );

  return <>{props.children}</>;
};

export default Admin;
