import React from 'react';
import { useStateContext } from '@/app/provider/StateContextProvider';
import NotificationParam from "@/app/type/NotificationParam";
import { NotificationType } from '../../../constants';
var tmpState:any = null
const Header = () => {

  const { state, updateState } = useStateContext();

  const setCurrentAccount = (account:(string | null)) => {
    updateState({...state, currentAccount: account})
  }
  const setNotification = (param:NotificationParam) => {
    tmpState = { ...tmpState, showNotification: true, notificationParam: param }
    updateState(tmpState)
  }
  
  /* ボタンのスタイルをまとめた変数 */
  const buttonStyle = "block w-full rounded-md bg-slate-400 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600";

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

  const disConnectWallet = async () => {
    try {
      /* ユーザーが認証可能なウォレットアドレスを持っているか確認する */
      const { ethereum } = window as any;
      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }
      console.log("disConnected");
      setCurrentAccount(null);
    } catch (error) {
      console.log(error);
    }
  };

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
    if(state.currentAccount){
        const accounts = await ethereum.request({ method: "eth_accounts" });
        if (accounts.length !== 0) {
          const account = accounts[0];
          setCurrentAccount(account);
        }
    }
  };

  const notificationTest = (event: React.MouseEvent<HTMLDivElement>) => {
    var param = new NotificationParam('completed', 'Minting process completed successfully.', '', false, 'Close', true, NotificationType.DENGER, () => {}, () => {})
    setNotification(param)
  }

  return (
    <nav className="w-full sticky top-0 p-3 bg-slate-800">
        <div className="flex justify-between max-w-5xl mx-auto items-center">
            <div className="flex items-center m-1" onClick={notificationTest}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <path fill="none" d="M0 0h24v24H0z"/>
                  <path fill="#ffffff" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                  <path fill="#ffffff" d="M15.5 9c-.83 0-1.5.67-1.5 1.5S14.67 12 15.5 12s1.5-.67 1.5-1.5S16.33 9 15.5 9zm-7 0C7.67 9 7 9.67 7 10.5S7.67 12 8.5 12 10 11.33 10 10.5 9.33 9 8.5 9zm7 6c-1.45 0-2.73.73-3.5 1.84-.77-1.11-2.05-1.84-3.5-1.84s-2.73.73-3.5 1.84c-.77-1.11-2.05-1.84-3.5-1.84v2c1.45 0 2.73.73 3.5 1.84.77-1.11 2.05-1.84 3.5-1.84s2.73.73 3.5 1.84c.77-1.11 2.05-1.84 3.5-1.84v-2z"/>
                </svg>
                <h2 className="text-xl font-bold m-2">NFT contract</h2>
            </div>
            <div className="">
                <div className="lg:flex lg:items-center">
                    {/* ウォレットを接続するボタン */}
        {!state.currentAccount && (
          <button
            onClick={connectWallet}
            type="button"
            className={`${buttonStyle}`}
          >
            Connect Wallet
          </button>
        )}
        {/* ウォレット接続済みのボタン */}
        {state.currentAccount && (
          <button
            onClick={disConnectWallet}
            title="DisConnect"
            className={`${buttonStyle} bg-indigo-900 text-white `}
          >
            disconnect ( {state.currentAccount} )
          </button>
        )}
                </div>
            </div>
        </div>
    </nav>
    );
};

export default Header;