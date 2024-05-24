import React from 'react';
import { useStateContext } from '@/app/provider/StateContextProvider';

const Header = () => {

  const { state, updateState } = useStateContext();

  const setCurrentAccount = (account:(string | null)) => {
    updateState({...state, currentAccount: account})
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


  return (
    <nav className="w-full sticky top-0 p-0.5 bg-slate-800">
        <div className="flex justify-between max-w-5xl mx-auto items-center">
            <div className="flex items-center">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                >
                    <path d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path
                    d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                    />
                    <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                    />
                </svg>
                <h2 className="text-xl font-bold">NFT contract</h2>
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
            DisConnect ( {state.currentAccount} )
          </button>
        )}
                </div>
            </div>
        </div>
    </nav>
    );
};

export default Header;