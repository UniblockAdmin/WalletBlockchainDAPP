import React, { useState, useEffect } from "react";
import Web3Connect from "./Web3Connect";
import UBToken from "../contracts/UBToken.json";
import CryptoJS from 'crypto-js';
import "../App.css";

const WalletPanel = ({ walletAddress, tokenBalanceObj }) => {
  const { web3, contract } = Web3Connect();
  const [selectedTab, setSelectedTab] = useState('assets');
  const [ucpRecords, setUcpRecords] = useState([]);
  const [showTransferForm, setShowTransferForm] = useState(false);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
  };

  const tabs = ['Главная', 'Расширения', 'Журнал', 'Транзакции', 'Настройки'];

  const tabButtonStyle = {
    padding: '10px 15px',
    borderRadius: '5px',
    margin: '0 5px',
    cursor: 'pointer',
    backgroundColor: '#0366d6',
    color: '#fff',
    border: 'none',
    outline: 'none',
  };

  const contentStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
    border: '2px solid #0366d6',
    borderRadius: '10px',
    backgroundColor: '#f6f6f6',
  };

  const balanceStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '20px 0',
  };

  const tokenListStyle = {
    textAlign: 'left',
    marginTop: '20px',
  };

  const tokenItemStyle = {
    border: '1px solid #ccc',
    borderRadius: '5px',
    padding: '20px',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
  };

  const getData = async () => {
    try {
      const ucpRecords = await contract.methods.getUCPs(walletAddress).call();
      setUcpRecords(ucpRecords);
    } catch (error) {
      console.error('Произошла ошибка:', error);
    }
  };

  const renderTokens = (tokenList, contractAddress) => {
    return tokenList.map((token, index) => {
      const stringValue = `${contractAddress}${token.ucpName}${token.ucpDescription}`;
      const ucpHashValue = CryptoJS.SHA256(stringValue).toString(CryptoJS.enc.Hex).slice(0, 38);

      return (
        <div key={index} style={tokenItemStyle}>
          <img
            src="/images/ub_logo.PNG"
            alt="Token Image"
            style={{ width: '50px', height: '50px', borderRadius: '50%', marginRight: '20px' }}
          />
          <div>
            <div><b>Адрес контракта:</b> {contractAddress}</div>
            <div><b>Хэш-идентификатор токена:</b> {"0x" + ucpHashValue}</div>
            <br/>
            <div><b>Наименование токена:</b> {token.ucpName}</div>
            <div><b>Описание токена:</b> {token.ucpDescription}</div>
            <div><b>Подтверждение:</b> {token.confirmed ? 'Подтверждено' : 'Ожидает подтверждения'}</div>
            <br/>
            <button>Детали токена</button>
            <button>Посмотреть код смарт-контракта</button>
            <button>Заключить смарт-контракт на данный токен</button>
          </div>
        </div>
      );
    });
  };

  const handleNFTButtonClick = async () => {
    setSelectedTab('Токен');
    setShowTransferForm(false);
    await getData();
  };

  const handleTokenButtonClick = async () => {
    setSelectedTab('tokens');
    setShowTransferForm(false);
    await getData();
  };

  const handleTransferTokenETH = async () => {
    setSelectedTab('assets');
    setShowTransferForm(false);
    alert("In development");
  }

  const handleTransferTokenUBT = () => {
    setSelectedTab('assets');
    setShowTransferForm(true);
  }

  const handleTransferUBT = async () => {
    try {
      // Вызовите метод контракта для перевода UBT, используя recipient и amount
      // Обработайте успешный перевод и обновите баланс
      // Закройте форму для перевода
      setShowTransferForm(false);
    } catch (error) {
      console.error('Ошибка при переводе UBT:', error);
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '20px' }}>
      <div style={{ width: '800px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', backgroundColor: '#f6f6f6', padding: '10px', borderRadius: '10px 10px 0 0' }}>
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              style={{
                ...tabButtonStyle,
                backgroundColor: selectedTab === tab ? '#0366d6' : '#ccc',
              }}
            >
              {tab}
            </button>
          ))}
        </div>
        <div style={contentStyle}>
          <h2>Здесь будет {selectedTab === 'assets' ? 'assets' : selectedTab} </h2>
          <h3>Адрес кошелька: {walletAddress}</h3>

          <div style={balanceStyle}>
            Баланс: {tokenBalanceObj} UBT
          </div>
          {selectedTab === 'Токен' && (
            <div style={tokenListStyle}>
              <h2>Мои токены</h2>
              {renderTokens(ucpRecords, contract._address)}
            </div>
          )}
          {selectedTab === 'tokens' && (
            <div>
              <h3>Мои ЦФА-токены</h3>
            </div>
          )}
          {showTransferForm && (
            <div>
            <h3>Перевод UBT</h3>
            <div>
              <label>Адрес получателя: </label>
              <input type="text" value={recipient} onChange={(e) => setRecipient(e.target.value)} />
            </div>
            <div style={{ marginTop: '10px' }}>
              <label>Количество UBT: </label>
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </div>
            <br></br>
            <button onClick={handleTransferUBT}>Отправить</button>
          </div>
          
          )}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <button onClick={handleNFTButtonClick} style={tabButtonStyle}>Мои токены</button>
            <button onClick={handleTokenButtonClick} style={tabButtonStyle}>Прочие активы</button>
            <button onClick={handleTransferTokenETH} style={tabButtonStyle}>Перевести ETH</button>
            <button onClick={handleTransferTokenUBT} style={tabButtonStyle}>Перевести UBT</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletPanel;
