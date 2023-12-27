import React, { useState, useEffect } from "react";

import Web3Connect from "./Components/Web3Connect";
import WalletPanel from "./Components/WalletPanel";
import Authorization from "./Components/Authorization";

import "./App.css";

const App = () => {

  const { web3, contract } = Web3Connect();

  return (
    <div>
      <Authorization />
    </div>
  );
};

export default App;
