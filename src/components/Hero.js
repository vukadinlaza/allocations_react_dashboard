import React from "react";

import logo from "../assets/logo.svg";

const Hero = () => (
  <div className="text-center hero my-5">
    <img className="mb-3 app-logo" src={logo} alt="React logo" width="120" />
    <h1 className="mb-4">Admin Dashboard</h1>

    <p className="lead">
      View all investors, all deals and all investor documents from the admin dashboard


    </p>
  </div>
);

export default Hero;
