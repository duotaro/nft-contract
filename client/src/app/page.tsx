"use client";
import { ethers } from "ethers";
import React, { useState, useEffect } from "react";
import { FB_CONTRACT_ADDRESS } from "../../constants"
import abi from "@/lib/FruitsBox.abi.json"
import { useStateContext } from '@/app/provider/StateContextProvider';
import { initState } from '@/app/provider/StateContextProvider'
import { IState } from '@/app/type/Contract'

/* ボタンのスタイルをまとめた変数 */
const buttonStyle = "flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

var beforeAccount:(string | null) = null
var tmpState:IState = initState

export default function Home() {
  
  const { state, updateState } = useStateContext();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const contractAddress = FB_CONTRACT_ADDRESS
  const contractABI = abi

  tmpState = state

  

  const setList = (list:string[]) => {
    console.log("setList:", list)
    tmpState = { ...tmpState, list: list }
    updateState(tmpState)
  }

  const setLoading = (loading:boolean) => {
    console.log("setLoading:", loading)
    tmpState = { ...tmpState, loading: loading }
    updateState(tmpState)
  }

  const setMessageValue = (message:string) => {
    console.log("setMessageValue:", message)
    tmpState = { ...tmpState, messageValue: message }
    updateState(tmpState)
  }
  const getList = async () => {
    console.log("start get LIst")
    if(state.loading){
      return
    }
    console.log("start get LIst 2")
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
    if(state.loading){
      return
    }
    try {
      const { ethereum } = window as any;
      if (ethereum) {

        if(!state.messageValue){
          setErrorMessage("登録したい文字列を入力してください")
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
        const echoTxn = await ethEchoContract.AddFruits(state.messageValue, {
          gasLimit: 300000,
        });
        console.log("Mining...", echoTxn.hash);
        await echoTxn.wait();
        setLoading(false)
        getList()
      } else {
        setLoading(false)

        console.log("Ethereum object doesn't exist!");
      }
      setMessageValue("")
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log('Component re-rendered!', state);
    if(beforeAccount != state.currentAccount){
      getList()
      beforeAccount = state.currentAccount
    }
  }, [state]);

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
    {/* メッセージボックス */}
    {state.currentAccount && (
      <div className="sm:mx-auto sm:w-full sm:max-w-lg space-y-6">      
        <div>
            <input
              placeholder="追加する文字列"
              name="messageArea"
              id="message"
              value={state.messageValue}
              onChange={(e) => setMessageValue(e.target.value)}
              className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
            {errorMessage && (
              <p className="text-red-400">{errorMessage}</p>
            )}
        </div>
          <button
            className={`${buttonStyle} bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline-indigo-600`}
            onClick={writeEcho}
          >
            Add item
          </button>
        {state.list && (
          <div className="py-3 px-4 block w-full border-gray-200 rounded-lg dark:bg-slate-900 dark:border-gray-700 dark:text-gray-100">
            <div>
            <ul className="divide-y divide-gray-200">
              {state.list.map((fruit, index) => (
                <li key={index} className="py-4">
                  {fruit}
                </li>
              ))}
            </ul>
            </div>
          </div>
        )}
      </div>
    )}
    {!state.currentAccount && (
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 "> 
          <h1 className="content-center text-center text-stone-800">ウォレットに接続してください</h1>
        </div>
    )}
    </div>
  );
}