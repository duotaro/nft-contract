# solidity-learning

## DEMO
[demo page](https://first-dapp-eosin.vercel.app/)

## wallet 入手
[metamask](https://chrome.google.com/webstore/detail/nkbihfbeogaeaoehlefnkodbefgpgknn)でもいい
[rabby](https://chrome.google.com/webstore/detail/acmacodkjbdgmoleebolmdjonilkdbch)でもいい

## sepolia ETH入手
https://sepolia-faucet.pk910.de/?ref=hackernoon.com

## Remixでコンパイル
https://remix.ethereum.org/
ファイル作成してコンパイル→ABIファイル取得
（後で使う）

## Remixでデプロイ
ENVIROMENTでInjected　Providerを選択
メタマスクなどでsepoliaに接続
対象のコントラクトを選択してデプロイ
コントラクトアドレス取得

## フロントエンド作成
>$ npx create-next-app@latest
>$ npm install ethers
>$ npm install
>$ npm run dev

http://localhost:3000/ にアクセスして表示されるか確認

## スマコン読み取り

## スマコン書き込み


## vercel deploy
今回みたいにclientの中だけをdeployってできるんかな？

## 課題
前回作からの課題
#### ウォレットがない人を誘導する


#### できればチェーンを指定して接続したい。今のままだとデフォルトでメインネットに接続されてしまう
チェーンが違う場合にどうするか
→できた。
```
   　// BrowserProviderを使って現在のウォレットチェーンに接続（アプリから接続しても同じかな？）
    const provider = new ethers.BrowserProvider(ethereum);
    const signer = await provider.getSigner();

    const network = await provider.getNetwork();
    // chainIDで判断
    if(!TARGET_CHAIN_ID_LIST.includes(Number(network.chainId))){
        // 指定チェーン以外だったらswitch
        await  switchNetwork(ethereum, TARGET_CHAIN_ID_LIST[0])
    }

    // チェーンswaitchする
    async function switchNetwork(ethereum:any, chainId:number) {
        await ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainId }],    // chainId must be in HEX with 0x in front
    });
 }
```

次回作でやりたいところ

#### ユーザーごとに取得する内容などを変更したい（今回は一つのコントラクトでBOXという変数に全ユーザーがアクセスしている）
そもそもどういう時に使うか。
トークンとかのスマコンと、それ以外では考え方が違うっぽい。
ここはユーズケースを勉強しないとダメかも



### 学習メモ
スマコン中心
フロントエンドは呼び出すだけのイメージ
詳細は割愛する

## スマートコントラクトに触れてみよう
目的：スマートコントラクトを作成してブラウザ経由で使ってみる
1. スマートコントラクトを作ってみよう
2. Remixを使ってコンパイルとデプロイをしてみよう
3. フロントエンドでウォレットに接続してみよう
4. フロントエンドからスマコンの値を読み取ってみよう
5. フロントエンドからスマコンの値を書き換えてみよう

## ユーザーに依存するスマートコントラクトを作ろう
目的：ユーザーごとに使い分けのできるスマートコントラクトを作成してみる
1. 
2. 
3. 
4. 
5. 

