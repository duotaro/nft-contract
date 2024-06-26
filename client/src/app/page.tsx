"use client";
import { ethers } from "ethers";
import React, { useState, useEffect } from "react";
import { CONTRACT_ADDRESS, TOKEN_URI, TARGET_CHAIN_ID_LIST, NotificationType } from "../../constants"
import abi from "@/lib/MyNFT.abi.json"
import { useStateContext, initState } from '@/app/provider/StateContextProvider';
import { IState } from '@/app/type/Contract'
import { formatUnits } from "@ethersproject/units";
import { isNumberObject } from "util/types";
import NotificationParam from "./type/NotificationParam";
/* ボタンのスタイルをまとめた変数 */
const buttonStyle = "flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

var beforeAccount:(string | null) = null
var tmpState:IState = initState

export default function Home() {
  
  const { state, updateState } = useStateContext();
  const [limit, setLimit] = useState<string>('');
  const [error, setError] = useState<string>('');

  const contractAddress = CONTRACT_ADDRESS
  const contractABI = abi

  tmpState = state

  async function switchNetwork(ethereum:any, chainId:number) {
    await ethereum.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: chainId }],    // chainId must be in HEX with 0x in front
    });
 }

  const setBalance = (balance:number) => {
    tmpState = { ...tmpState, nftBalance: balance }
    updateState(tmpState)
  }

  const setLoading = (loading:boolean) => {
    tmpState = { ...tmpState, loading: loading }
    updateState(tmpState)
  }

  const setNotification = (param:NotificationParam) => {
    tmpState = { ...tmpState, showNotification: true, notificationParam: param }
    updateState(tmpState)
  }
  const loadBalance = async () => {
    if(state.loading){
      return
    }
    try {
      const { ethereum } = window as any;
      if (ethereum && state.currentAccount) {

        const provider = new ethers.BrowserProvider(ethereum);
        const signer = await provider.getSigner();

        const network = await provider.getNetwork();
        if(!TARGET_CHAIN_ID_LIST.includes(Number(network.chainId))){
          await switchNetwork(ethereum, TARGET_CHAIN_ID_LIST[0])
        }
        // /* ABIを参照する */
        const ethEchoContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        
        setLoading(true)
        let balance = await ethEchoContract.balanceOf(state.currentAccount)
        formatUnits(balance, "ether");
        console.log("balance:", balance)
        setBalance(Number(balance))
        // balancenによって制御できるかも？
        setLoading(false)
      }
    }catch (error) {
      console.log(error);
      setLoading(false)
    }
  }

  /* ABIを読み込み、コントラクトにEchoを書き込む */
  const mintNFT = async () => {
    setError("")
    if(state.loading){
      return
    }

    const numberValue: number = Number(limit);
    if (isNaN(numberValue)) {
      setLimit('')
      setError("数値を入力してください。")
      return
    }
    if(state.nftBalance >= numberValue){
      alert(`mint可能数は${limit}つです。`)
      return
    }
    try {
      const { ethereum } = window as any;
      if (ethereum) {

        const provider = new ethers.BrowserProvider(ethereum);
        const signer = await provider.getSigner();

        const network = await provider.getNetwork();
        if(!TARGET_CHAIN_ID_LIST.includes(Number(network.chainId))){
          await  switchNetwork(ethereum, TARGET_CHAIN_ID_LIST[0])
        }


        /* ABIを参照する */
        const ethEchoContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        setLoading(true)
        // 本来はTOKEN_URIはmintごとに変更すべきなのかな？もの次第か？
        const echoTxn = await ethEchoContract.create(state.currentAccount, TOKEN_URI);
        console.log("Mining...", echoTxn.hash);
        await echoTxn.wait();
        setLoading(false)

        var param = new NotificationParam('completed', 'Minting process completed successfully.', '', false, 'Close', true, NotificationType.INFO, () => {}, () => {})
        setNotification(param)
        loadBalance()
      } else {
        setLoading(false)

        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
      setLoading(false)
    }
  };

  useEffect(() => {
    console.log('Component re-rendered!', state);
    if(beforeAccount != state.currentAccount){
      loadBalance()
      beforeAccount = state.currentAccount
    }
  }, [state]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("")

    const inputValue: number = parseInt(e.target.value, 10)
    if (!isNaN(inputValue)) {
      // 数値に変換できた場合の処理
      setLimit(inputValue.toString())
    } else {
      // 数値に変換できない場合の処理
      setLimit('')
      setError("数値を入力してください。")
    }
  
  };
  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
    {/* メッセージボックス */}
    {state.currentAccount && (
      <div className="sm:mx-auto sm:w-full sm:max-w-lg space-y-6">
        <div className="sm:col-span-4">
          <label htmlFor="mintLimit" className="block text-sm font-medium leading-6 text-gray-900">mint上限数</label>
          <div className="mt-2">
            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
              <input type="text" name="mintLimit" id="username" autoComplete="mintLimit" className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" placeholder="5" value={limit} onChange={handleChange}/>
            </div>
            {error && (
              <p className="text-red-400">{error}</p>
            )}
          </div>
        </div>
          <div className="py-3 px-4 block w-full rounded-lg">
            <div><img className="mx-auto border" src={TOKEN_URI} alt="" width="384" height="512"></img></div>
          </div>
          <button
            className={`${buttonStyle} bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline-indigo-600 ${state.nftBalance >= Number(limit) ? 'cursor-not-allowed' : ''}`}
            onClick={mintNFT}
            disabled={state.nftBalance >= Number(limit)}
          >
            Free Mint
          </button>
          <div className="py-3 px-4 block w-full border-gray-200 rounded-lg dark:bg-slate-900 dark:border-gray-700 dark:text-gray-100">
            <div>
              mintした数:{state.nftBalance}
            </div>
          </div>
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