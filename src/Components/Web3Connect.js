import React, { useState, useEffect } from "react";
import UBToken from "../contracts/UBToken.json";
import Web3 from "web3";
import "../App.css";

const Web3Connect = () => { 
    const [state, setState] = useState({
        web3: null,
        contract: null,
        newAccount: null,
        tokenBalance: 0
      });
      
      useEffect(() => {
        const provider = new Web3.providers.HttpProvider(
          "http://194.87.147.75:8545/"
        );
        
        async function initializeWeb3() {
          const web3 = new Web3(provider);
          const networkId = await web3.eth.net.getId();
          const deployedNetwork = UBToken.networks[networkId];
          
          const contract = new web3.eth.Contract(
            UBToken.abi,
            deployedNetwork.address
          );
          
          setState({ web3, contract });
        }
    
        provider && initializeWeb3();
      }, []);

    return state;
}

export default Web3Connect