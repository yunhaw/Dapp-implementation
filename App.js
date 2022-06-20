import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';
import Web3Modal from "web3modal";
import { ethers } from 'ethers';

const web3Modal = new Web3Modal({
  network: "rinkeby", // 主網就改成 mainnet
  providerOptions: {} // 額外設定，可以在 web3 npm 官方文件找到相關用法
});

function App() {
  const [contract, setContract] = useState(null);
  const [address, setAddress] = useState('0x0');
  const [balance, setBalance] = useState("0");
  const [ensAddress, setEnsAdress] = useState("0");
  const [message, setMessage] = useState("");
  const [paidMsg, setPaidMsg] = useState("");
  const [InputMsg, setInputMsg] = useState("");

  useEffect(() => {
    async function init() {
        const instance = await web3Modal.connect(); 
        // 自動連接錢包，不需要使用者主動觸發連接 
        // 在其他網站要小心此段指令，開啟網頁後會直接連接錢包

        const provider = new ethers.providers.Web3Provider(instance); // 一定要 provider 才能 get data
        const signer = provider.getSigner();                      // 取得簽署交易的人
        const address = await signer.getAddress();                // 取得錢包地址
        const balance = await provider.getBalance(address);       // 取得錢包餘額
        const ensAddress = await provider.lookupAddress(address); // 取得該地址註冊過的以太坊域名

        const contractAddr = '0xbff04b3069c67b84eee7e77dd428b1d5f31243a3';
        const abi = [
          {
            "inputs": [
              {
                "internalType": "string",
                "name": "str",
                "type": "string"
              }
            ],
            "name": "store",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "string",
                "name": "str",
                "type": "string"
              }
            ],
            "name": "storePaidMsg",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
          },
          {
            "inputs": [],
            "name": "message",
            "outputs": [
              {
                "internalType": "string",
                "name": "",
                "type": "string"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },
          {
            "inputs": [],
            "name": "retrievePaidMsg",
            "outputs": [
              {
                "internalType": "string",
                "name": "",
                "type": "string"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          }
        ];

        const contract = new ethers.Contract(contractAddr, abi, signer); // 串接智能合約
/* 寫過一次了所以先註解掉
        let tx = await contract.store("Free fish!")
        await tx.wait() // 等待礦工確認
*/
        let msg = await contract.message(); // 檢查訊息
        console.log(msg);
/*
        let payEtherAmount = ethers.utils.parseEther("0.0001");
        let tx = await contract.storePaidMsg(
          "This is a Fish!",
          {value: payEtherAmount}
        )
        let response = await tx.wait()
        // 用 function 讀取 private 變數的資料
*/
        let paidMsg = await contract.retrievePaidMsg()
/*      
        console.log(paidMsg);  
        console.log(ethers.utils.formatEther(balance) + " ETH"); // this is big number
        console.log(ensAddress); // only available in mainnet

        console.log(instance);   
        //檢查有無成功
        // 此 log 會顯示在瀏覽器
*/
        setAddress(address);
        setBalance(ethers.utils.formatEther(balance));
        setContract(contract);
        setMessage(msg);
        setPaidMsg(paidMsg);
    }
    init();  
}, []); // [] 空陣列表示只會執行一次 

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Hi {address}! Your balance is {balance} ETH.
        </p>
        <p>
          Your address is {address}.
        </p>
        <p>
          Your message is {message}.
        </p>
        <p>
          Your paid message is {paidMsg}.
        </p>        
        <input
          value = {InputMsg}
          onChange = {(e) => setInputMsg(e.target.value)}
        >
        </input>        
        <button 
          onClick={() => { 
            async function storeFunction(){
              let tx = await contract.store(InputMsg);
              await tx.wait();
              
              let _msg = await contract.message(); // 要重新提取
              setMessage(_msg);
            }
            storeFunction();
            }
          }
        >
          store msg
        </button>
        <button 
          onClick={() => { 
            async function storePaidFunction(){
              let payEtherAmount = ethers.utils.parseEther("0.0001");
              let tx = await contract.storePaidMsg(InputMsg, {value: payEtherAmount});
              await tx.wait();
              
              let _paidMsg = await contract.retrievePaidMsg(); // 要重新提取
              setPaidMsg(_paidMsg);
            }
            storePaidFunction();
            }
          }
        >
          store paid msg
        </button>        
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
