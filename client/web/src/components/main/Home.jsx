import React from "react";
import HomeMapSearch from './HomeMapSearch';

const Home = ({
  map,
}) => {
  return (
    <div className="hero-wrapper" role="banner">
      <div className="cloud-background" />
      <div className="hero-text-wrapper">
        <h2>Find your <br /> drop off locations</h2>
        <h3>Find safe, secure, in-person locations to drop off your mail-in or absentee ballot</h3>
      </div>
      <HomeMapSearch map={map} />
    </div>
  );
}

export default Home;