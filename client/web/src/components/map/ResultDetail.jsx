import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock } from '@fortawesome/free-solid-svg-icons'
import { Drawer, Dropdown } from 'rsuite';
import Moment from 'react-moment';

import pinIcon from '../../assets/pin-icon.svg';
import backArrow from '../../assets/back-arrow-icon.svg';
import infoIcon from '../../assets/info-icon-red.svg';
import phoneIcon from '../../assets/phone-icon.svg';

const ResultDetail = ({
  location,
  data,
  open,
  close,
}) => {
  const renderHours = () => location.hours.map(hour => {
    return Object.keys(hour).map((key) => {
      const dateToFormat = new Date(hour[key][0].date);
      const openingTime = new Date(hour[key][0].openTimeStamp);
      const closingTime = new Date(hour[key][0].closeTimeStamp);

      const today = new Date()
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)

      if (dateToFormat >= yesterday) return (
        <Dropdown.Item>
          <b><Moment date={dateToFormat} format={'MMM Do'} />:</b>&nbsp;
          <Moment date={openingTime} format={'LT'} />&nbsp;-&nbsp;
          <Moment date={closingTime} format={'LT'} />
        </Dropdown.Item>
      );
    });
  });

  const renderLinks = () => data.jurisdictionData.urls.map(link => (
    <div className="info-link">
      <a href={link['url']} target="_blank">{link['name']}</a>
    </div>
  ));
  

  return (
    <Drawer
      show={open}
      onHide={close}
      placement="bottom"
      size="md"
      className="result-detail-drawer"
    >
      <Drawer.Header>
        <div className="back-to-list">
          <img id="back-arrow" src={backArrow} alt="Back arrow" />
          <a>All drop offs</a>
        </div>
      </Drawer.Header>
      <Drawer.Body>
        <h1>{location.name}</h1>
        <div className="result-card-content-wrapper">
          <img className="address-icon" src={pinIcon} alt="Address icon" />
          <h4>{location.address1.substring(0, location.address1.length - 1)}, {location.address2}</h4>
          <br />
          <h4 className="second-line">{location.address3}</h4>
        </div>
        <div className="hours-dropdown">
          <span class="icon is-small">
            <FontAwesomeIcon icon={faClock} />
          </span>
          <Dropdown 
            title="Hours"
          >
            {renderHours()}
          </Dropdown>
        </div>
        <div className="info-links-header">
          <img className="info-icon" src={infoIcon} alt="Information icon"/>
          <h3 className="info-links-header">Official election information</h3>
        </div>
        <div className="info-links">
          {renderLinks()}
        </div>
      </Drawer.Body>
      <Drawer.Footer
        className="result-detail-footer"
      >
        <h3><b>Location and hours are subject to change</b></h3>
        <div className="to-verify">
          <p id="important">TO VERIFY</p>
          <img className="phone-icon" src={phoneIcon} alt="Phone icon" />
          <p>{location.contactPhone}</p>
        </div>
      </Drawer.Footer>
    </Drawer>
  );
};

export default ResultDetail;