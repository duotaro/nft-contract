"use client";
import { ethers } from "ethers";
import React, { useState, useEffect, Suspense } from "react";
import { FB_CONTRACT_ADDRESS } from "../../constants"
import abi from "@/lib/FruitsBox.abi.json"
import LoadingModal from '@/app//components/LoadingModal';
  
/* ボタンのスタイルをまとめた変数 */
const buttonStyle =
  "flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

export default function Home() {
  /* ユーザーのパブリックウォレットを保存するために使用する状態変数 */
  const [currentAccount, setCurrentAccount] = useState<string>("");
  console.log("currentAccount: ", currentAccount);
  /* ユーザーのメッセージを保存するために使用する状態変数 */
  const [messageValue, setMessageValue] = useState<string>("");
  const [list, setList] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const contractAddress = FB_CONTRACT_ADDRESS
  const contractABI = abi

  const checkIfWalletIsConnected = async () => {
    /* window.ethereumにアクセスできることを確認する */
    /* 'ethereum' プロパティの型情報がないため any を使用する */
    const { ethereum } = window as any;
    if (!ethereum) {
      console.log("Make sure you have MetaMask!");
    } else {
      console.log("We have the ethereum object", ethereum);
    }
    /* ユーザーのウォレットへのアクセスが許可されているかどうかを確認します */
    const accounts = await ethereum.request({ method: "eth_accounts" });
    if (accounts.length !== 0) {
      const account = accounts[0];
      setCurrentAccount(account);
    } else {
    }
  };

  const connectWallet = async () => {
    try {
      /* ユーザーが認証可能なウォレットアドレスを持っているか確認する */
      const { ethereum } = window as any;
      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }
      /* 持っている場合は、ユーザーに対してウォレットへのアクセス許可を求める
       * 許可されれば、ユーザーの最初のウォレットアドレスを currentAccount に格納する */
      const accounts = (await ethereum.request({
        method: "eth_requestAccounts",
      })) as string[];
      console.log("Connected: ", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };


  const getList = async () => {
    if(loading){
      return
    }
    try {
      const { ethereum } = window as any;
      if (ethereum) {

        const provider = new ethers.BrowserProvider(ethereum);
        const signer = await provider.getSigner();
        /* ABIを参照する */
        const ethEchoContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        setLoading(true)
        let list = await ethEchoContract.getAllFruits();
        console.log("Retrieved total echo count...", list);
        console.log("Signer:", signer);
        setList(list)
        setLoading(false)
      }
    }catch (error) {
      console.log(error);
    }
  }

  /* ABIを読み込み、コントラクトにEchoを書き込む */
  const writeEcho = async () => {
    if(loading){
      return
    }
    try {
      const { ethereum } = window as any;
      if (ethereum) {

        if(!messageValue){
          alert("何か入力して")
          return
        }
        const provider = new ethers.BrowserProvider(ethereum);
        const signer = await provider.getSigner();
        /* ABIを参照する */
        const ethEchoContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
         setLoading(true)
        const echoTxn = await ethEchoContract.AddFruits(messageValue, {
          gasLimit: 300000,
        });
        console.log("Mining...", echoTxn.hash);
        await echoTxn.wait();
        setLoading(false)
        getList()
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
    getList()
  }, []);

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      {/* ヘッダー */}
      <div className="sm:mx-auto sm:w-full sm:max-w-lg">
        <h1 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white-900">
          初めてのDApp
        </h1>
        <div className="bio mt-2 mb-8">
          remixを使ってスマコンをデプロイして、Next.jsを使ってスマコンを呼び出す。
        </div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-lg space-y-6">
        <div>
          {/* メッセージボックス */}
          {currentAccount && (
            <textarea
              placeholder="メッセージはこちら"
              name="messageArea"
              id="message"
              value={messageValue}
              onChange={(e) => setMessageValue(e.target.value)}
              className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 dark:focus:ring-gray-600"
            />
          )}
        </div>

        {/* ウォレットを接続するボタン */}
        {!currentAccount && (
          <button
            onClick={connectWallet}
            type="button"
            className={`${buttonStyle} bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline-indigo-600`}
          >
            Connect Wallet
          </button>
        )}
        {/* ウォレット接続済みのボタン */}
        {currentAccount && (
          <button
            disabled={true}
            title="Wallet Connected"
            className={`${buttonStyle} bg-indigo-900 text-white cursor-not-allowed`}
          >
            Wallet Connected
          </button>
        )}
        {/* コントラクトに書き込むボタン */}
        {currentAccount && (
          <button
            className={`${buttonStyle} bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline-indigo-600`}
            onClick={writeEcho}
          >
            Add item
          </button>
        )}
        {/* 最新の書き込みを読み込むボタン */}
        {currentAccount && (
          <button
            className={`${buttonStyle} bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline-indigo-600 mt-6`}
            onClick={() => getList()}
          >
            Load List
          </button>
        )}
        {/* 履歴を表示する */}
        {currentAccount && list && (
          /*displayedEcho &&*/ <div className="py-3 px-4 block w-full border-gray-200 rounded-lg dark:bg-slate-900 dark:border-gray-700 dark:text-gray-100">
            <div>
            <ul className="divide-y divide-gray-200">
              {list.map((fruit, index) => (
                <li key={index} className="py-4">
                  {fruit}
                </li>
              ))}
            </ul>
            </div>
          </div>
        )}
      </div>
      {currentAccount && loading && <LoadingModal />}
    </div>
  );
}