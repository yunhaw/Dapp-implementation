# Web3 + Smart contract 實作 DAPP (React.js + Solidity)

###### tags: `Notes`
###### Title: Web3 + Smart contract 實作 DAPP (React.js + Solidity)
###### Date: 2022.06.18
###### Update: 2022.06.20
###### Link: https://hackmd.io/@Raheem/ry5dimsY9
###### GitHub: https://github.com/yunhaw/Dapp-implementation
###### Author: Raheem
---

## Outline
> Reference
> 實作環境 
> 1. 創建環境
> 2. 實作
> - 2-1. 連接區塊鏈錢包
> - 2-2. 查詢錢包餘額
> - 2-3. 部署智能合約
> - 2-4. 網頁前端與智能合約互動
> - 2-5. 跟 React 的結合與狀態管理
> 3. 完整 App.js 程式碼

## Reference
- [React.js 開發入門手冊](https://zh-hant.reactjs.org/tutorial/tutorial.html)
    - 理解如何建置環境和基礎語法即可
    - 其餘內容和本次要實作的 web3.0 方法不太相關
## 實作環境
> 開發套件：web3modal、ethers、useEffect、useState
> 套件安裝工具：Homebrew、Yarn、npm
> 測試區塊鏈：Rinkeby
> 虛擬錢包：Metamask
> 區塊鏈瀏覽器：Etherscan
> 智能合約開發環境：RemixIDE
> 文字編輯器：Visual Studio Code
> 瀏覽器：Google Chrome 102.0.5005.61 (正式版本) (arm64)
> 作業系統：macOs Monterey 12.3（Macbook air M1 2020）

## 1. 創建環境
- Create React App: https://create-react-app.dev/
- 首先要建立 React 環境
    - 在終端機輸入以下指令
```shell=
npx create-react-app my-first-dapp
cd my-first-dapp
npm start
```

- 建置過程

![](https://i.imgur.com/tvbZUfc.png)
![](https://i.imgur.com/tGVlS69.png)
- 在終端機 my-first-dapp 資料夾底下 輸入 npm start
![](https://i.imgur.com/8qr4SgT.png)

- 若環境建置成功，瀏覽器會出現以下頁面

![](https://i.imgur.com/BZGu79X.png)

- 在 VSCode 執行以下操作，使得可以在某路徑透過終端機直接用 VSCode 開啟該專案
    - 此步驟若以前做過，可以跳過
    - 或是手動在 VSCode 開啟 my-first-dapp

```shell=
# Open in VSCode, press CMD+Shift+P to install code package 這行是註解，不要輸入
code .
```

- 設定好環境變數

![](https://i.imgur.com/po2qmaV.png)

- 在 my-first-dapp 底下輸入 code .

![](https://i.imgur.com/bc0qHJb.png)
![](https://i.imgur.com/laQHlLS.png)

- my first dapp 資料夾內容

![](https://i.imgur.com/ZugxI1A.png)

- 在終端機輸入以下指令安裝開發套件
    - 記得要先安裝 yarn 這個拉套件的工具
    - 注意是裝在 my-first-dapp 這個資料夾底下
```shell=
# Install packages 這是註解，不要輸入
yarn add ethers web3modal
```

- 安裝過程

![](https://i.imgur.com/5ZJLu0h.png)
![](https://i.imgur.com/OO2Ri3F.png)


- 裝好 web3modal 套件後，再重新啟動 React
    - 記得先 control + C 中斷 npm
```shell=
npm start
```

![](https://i.imgur.com/tIXV23n.png)

## 2. 實作

## 2-1. 連接區塊鏈錢包

- 透過以下程式碼連接區塊鏈錢包
    - 在 my-first-dapp 資料夾底下的 src 資料夾內的 App.js 內

- App.js 裡加入以下程式碼
```javascript=
import Web3Modal from "web3modal";

const web3Modal = new Web3Modal({
  network: "rinkeby", // 主網就改成 mainnet
  providerOptions: {} // 額外設定，可以在 web3 npm 官方文件找到相關用法
});
```
- function app() 裡加入以下程式碼
    - 這邊會用到 useEffect 與 async
    - 記得要 import { useEffect }，否則 useEffect 會 undefined
    - [useEffect bug 解決辦法](https://bobbyhadz.com/blog/react-referenceerror-useeffect-is-not-defined) 
```javascript=
import { useEffect } from 'react'; // 沒有這行底下 useEffect 會出錯
useEffect(() => {
    async function init() {
        const instance = await web3Modal.connect(); 
        // 自動連接錢包，不需要使用者主動觸發連接 
        // 在其他網站要小心此段指令，開啟網頁後會直接連接錢包
        console.log(instance); 
        //檢查有無成功
        // 此 log 會顯示在瀏覽器
    }
    init();  
}, []); // [] 空陣列表示只會執行一次
```

![](https://i.imgur.com/8qfQmYC.png)

- 程式碼存擋後，若 npm 還開著，會自動編譯
- 接著查看網頁有無成功

## 2-2. 查詢錢包餘額

- 繼續在 App.js 加入以下程式碼
    - 寫在剛剛的 useEffect 裡
- npm 記得先停止，否則會一直自動編譯
- 記得 import { ethers } 

```javascript=
import { ethers } from "ethers";

const provider = new ethers.providers.Web3Provider(instance); // 一定要 provider 才能 get data
const signer = provider.getSigner();                      // 取得簽署交易的人
const address = await signer.getAddress();                // 取得錢包地址
const balance = await provider.getBalance(address);       // 取得錢包餘額
const ensAddress = await provider.lookupAddress(address); // 取得該地址註冊過的以太坊域名

console.log(ethers.utils.formatEther(balance) + " ETH"); // this is big number
console.log(ensAddress); // only available in mainnet

```

![](https://i.imgur.com/mw3wMma.png)

- 重新 npm start 後，到網頁頁面查看結果
    - 按 F12 打開開發者模式
    - chrome 記得下載 React 開發者插件，才能看到下圖右手邊的狀態列

![](https://i.imgur.com/QNGUCZ7.png)

## 2-3. 部署智能合約

- 將以下合約內容透過 [RemixIDE](https://remix.ethereum.org/) 部署
- RemixIDE 的操作和合約的互動這邊就不多作說明
- 合約地址:
https://rinkeby.etherscan.io/address/0xbff04b3069c67b84eee7e77dd428b1d5f31243a3
    - 合約程式碼已上傳 Etherscan
    - 0.0001 ether = 100000 Gwei

```solidity=
// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract Storage {
    string public message;
    string paidMessage;
    
    // 免費寫訊息
    function store(string memory str) public {
        message = str;
    }
    // 付費寫訊息
    function storePaidMsg(string memory str) public payable { 
        require(msg.value == 0.0001 ether, "Not enough fund");
        paidMessage = str;
    }
    function retrievePaidMsg() public view returns (string memory){
        return paidMessage;
    }
}
```

- 編譯合約

![](https://i.imgur.com/JX2JKGA.png)

- 部署合約

![](https://i.imgur.com/6iwBh7Q.png)

- 部署成功

![](https://i.imgur.com/9BY5OB7.png)
    
## 2-4. 網頁前端與智能合約互動
> 透過 React.js 串接 Smart contract

- 串接的三個要素
    - Contract address
    - ABI
    - Signer

- 將以下程式碼貼到 App.js 內的 useEffect 
```javascript=
const contract = new ethers.Contract(contractAddr, abi, signer);
let tx = await contract.store("Free fish!")
await tx.wait() // 等待礦工確認
// do more thing and play with fish

let msg = await contract.message(); // 檢查訊息
console.log(msg);
```

- signer 已經有了，接著要取得 contract address 和 abi
    - abi 可以去剛剛的 RemixIDE 上複製，在 compiler 頁面的編譯按鈕底下
    - abi 是一個紀錄 json 的陣列
- 回到 App.js 宣告如以下
```javascript=
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
```

![](https://i.imgur.com/4QAoS6o.png)

- npm start 回網頁查看一下結果
    - 若程式碼沒有錯誤，回到網頁頁面會自動觸動合約
    - 執行合約的 store function，寫入訊息

![](https://i.imgur.com/hdz5Glt.png)

- 查看 console 有無成功

![](https://i.imgur.com/pnrgeXU.png)

- 在 RemixIDE 上呼叫 message 查看有無成功寫入

![](https://i.imgur.com/HmjMLDa.png)

- 在 Etherscan 上呼叫 message 查看有無成功寫入

![](https://i.imgur.com/gDaqSRC.png)

- 再來加入以下程式碼，調用合約的 payable function
    - https://docs.ethers.io/v5/api/utils/display-logic/#utils-formatEther
- 記得把前一步的寫入訊息註解掉，才不會再寫一次
- 記得把 npm 中斷
```javascript=
let payEtherAmount = ethers.utils.parseEther("0.0001");
let tx = await contract.storePaidMsg(
  "This is a Fish!",
  {value: payEtherAmount}
)
let response = await tx.wait()
// 用 function 讀取 private 變數的資料
let paidMsg = await contract.retrievePaidMsg()
console.log(paidMsg);
```
![](https://i.imgur.com/gKyzTvx.png)

- npm start 回網頁查看結果

![](https://i.imgur.com/VRbKWVe.png)
![](https://i.imgur.com/lMt4JWA.png)

- 在 RemixIDE 上呼叫 RetreivePaidMsg 查看有無成功寫入

![](https://i.imgur.com/13KhwlJ.png)

- 在 Etherscan 上呼叫 RetreivePaidMsg 查看有無成功寫入

![](https://i.imgur.com/F7S5VlZ.png)

## 2-5. 跟 React 的結合與狀態管理
> 透過 React.js 讓網頁有前端介面
> 製作有 button 與 input 的簡易介面
> Contract function 需要非同步 async / await

- 在 App.js 的 App() 內，useEffect function 前面加入以下
    - 記得前面的 import 加入 { useSate }，如以下
- 記得寫入訊息的 function 要註解掉，才不會再寫一次
```javascript=
import { useEffect, useState } from 'react';
```
```javascript=
const [contract, setContract] = useState(null);
const [address, setAddress] = useState('0x0');
const [balance, setBalance] = useState("0");
const [ensAddress, setEnsAdress] = useState("0");
const [message, setMessage] = useState("");
const [paidMsg, setPaidMsg] = useState("");
```

![](https://i.imgur.com/mNphL8Q.png)

- 接著開始製作前端 UI
    - 對 App.js 的 body 進行修改，如以下
```javascript=
<p>
  Hi {address}! Your balance is {balance} ETH.
</p>
```
![](https://i.imgur.com/7Pkx20x.png)

- npm start 到網頁頁面查看結果
    - 會發現 set 參數都是0

![](https://i.imgur.com/8i6T2Lb.png)

- 修改參數
- 在 App.js 內加入以下程式碼
```javascript=
setAddress(address);
setBalance(ethers.utils.formatEther(balance));
setContract(contract);
```

![](https://i.imgur.com/zkGZuQG.png)

- 再回到網頁頁面，並 refresh
    - 會發現剛剛 set 的變數有值了

![](https://i.imgur.com/0p4a3Y8.png)

- 開始製作前端介面，並加入按鈕與輸入
    - 接下來要加入的程式碼較多
        - 若看不清楚可以直接查看最終的程式碼

- 再設定以下兩個變數
```javascript=
setMessage(msg);
setPaidMsg(paidMsg);
```

- 在 App.js 的 body 加入以下
```javascript=
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
<button 
  onClick={() => { 
    async function storeFunction(){
      let tx = await contract.store("Hello world!");
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
      let tx = await contract.storePaidMsg("Paid message", {value: payEtherAmount});
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
```

- 回到網頁頁面查看結果

![](https://i.imgur.com/LuUoRQW.png)

- 加入input 
    - 加入一行宣告如下
```javascript=
const [InputMsg, setInputMsg] = useState("");
```
- 在 button 上方加入以下
    - 其他 button 顯示的字串要改成 InputMsg 變數
```javascript=
<input
  value = {InputMsg}
  onChange = {(e) => setInputMsg(e.target.value)}
>
</input> 
```

- 回到網頁頁面查看結果
    - 區塊鏈更新會比較慢，按鈕按下後大概要 1-3 分鐘頁面才會更新

![](https://i.imgur.com/hlWL1pT.png)

- input 輸入後，頁面的文字會變更
![](https://i.imgur.com/J0K2WaF.png)


## 3. 完整 App.js 程式碼
> 最終版
```javascript=
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

```
