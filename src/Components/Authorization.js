import React, { useState, useEffect } from 'react';
import Web3Connect from "./Web3Connect";
import '../css/Authorization.css';
import WalletPanel from './WalletPanel';

const Authorization = () => {
  const { web3, contract } = Web3Connect();

  const [seedPhrase, setSeedPhrase] = useState('');
  const [authorized, setAuthorized] = useState(false);
  const [walletAddress,  setWalletAddress] = useState('');
  const [balance, setBalance] = useState(0);
  const [tokenBalance, setTokenBalance] = useState(0);

  const handleSeedPhraseChange = (e) => {
    setSeedPhrase(e.target.value);
  };

  const handleAuthorization = () => {
    setAuthorized(true);
  };

  const getAddressByPrivateKey = () => {
    const privateKey = document.getElementById("data-field").value;

    if (!privateKey || privateKey.length !== 66) {
      console.error('Invalid private key');
      return;
    }

    const account = web3.eth.accounts.privateKeyToAccount(privateKey);

    console.log(account.address);
    setWalletAddress(account.address);

    return account.address;
  }

  // Запрашиваем баланс при авторизации и при изменении адреса кошелька
  useEffect(() => {
    if (authorized) {
      web3.eth.getBalance(walletAddress)
        .then(balance => {
          // Баланс в wei
          setBalance(web3.utils.fromWei(balance, 'ether'));
        })
        .catch(error => {
          console.error('Error fetching balance:', error);
        });

      try {
        web3.eth.getAccounts()
          .then(accounts => {
            if (accounts.length === 0) {
              console.error("No account connected.");
              return;
            }

            contract.methods
              .balanceOf(walletAddress)
              .call({ from: accounts[0] })
              .then(result => {
                const tokenBalance = web3.utils.fromWei(result.toString(), 'ether');
                setTokenBalance(tokenBalance);
                console.log(tokenBalance);
              })
              .catch(error => {
                console.error("Error getting token balance:", error);
              });
          });
      } catch (error) {
        console.error("Error getting token balance:", error);
      }
    }
  }, [authorized, walletAddress]);

  return (
    <div className="authorization-container">
      <h2>Кошелёк UniBlockchain (demo)</h2>
      {!authorized ? (
        <form className="authorization-form" onSubmit={handleAuthorization}>
          <label>
            Пожалуйста, введите приватный ключ для авторизации в кошельке:
            <input 
              id="data-field"
              type="text"
              value={seedPhrase}
              onChange={handleSeedPhraseChange}
              required
            />
          </label>
          <button onClick={getAddressByPrivateKey} type="submit">Авторизоваться</button>
        </form>
      ) : (
        <div>
          <p>Успешная авторизация!</p>
          <WalletPanel walletAddress={walletAddress} tokenBalanceObj={tokenBalance} />
          <p>Баланс ETH: {balance}</p> 
        </div>
      )}
    </div>
  );
};

export default Authorization;
