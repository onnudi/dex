import { getExchangeContract, getTokenContract, getWeb3Instance } from "./web3Service";
import EnvConfig from "../configs/env"

export function getSwapABI(data) {
  /*TODO: Get Swap ABI*/
}

export function getTransferABI(data) {
  /*TODO: Get Transfer ABI*/
}

export function getApproveABI(srcTokenAddress, amount) {
  /*TODO: Get Approve ABI*/
}

export function getAllowance(srcTokenAddress, address, spender) {
  /*TODO: Get current allowance for a token in user wallet*/
}

export async function getAccountAddress() {
  return await getWeb3Instance().eth.getAccounts();
}

export async function approval(token) {
  try {
    const tokenContract = getTokenContract(token);
    const totalSupply = await tokenContract.methods.totalSupply().call();
    console.log(totalSupply);
    const accounts = await getWeb3Instance().eth.getAccounts();
    const account = accounts[0];
    return tokenContract.methods.approve(EnvConfig.EXCHANGE_CONTRACT_ADDRESS, totalSupply).send({ from: account });
  } catch (error) {
    return error;
  }
}

export async function checkApprove(srcTokenAddress) {

  const accounts = await getWeb3Instance().eth.getAccounts();
  const account = accounts[0];

  const tokenContract = getTokenContract(srcTokenAddress);
  const totalSupply = await tokenContract.methods.totalSupply().call();

  return new Promise((resovle, reject) => {
    tokenContract.methods.allowance(account, EnvConfig.EXCHANGE_CONTRACT_ADDRESS).call().then(res => {
      resovle(res == totalSupply);
    }, error => {
      reject(error);
    })
  })


}

/* Get Exchange Rate from Smart Contract */
export function getExchangeRate(srcTokenAddress, destTokenAddress, srcAmount) {
  const exchangeContract = getExchangeContract();
  return new Promise((resolve, reject) => {
    exchangeContract.methods.getExchangeRate(srcTokenAddress, destTokenAddress, srcAmount).call().then((result) => {
      resolve(result);
    }, (error) => {
      reject(error);
    })
  })
}


export async function checkValidAddress(address){
  try{
    const web3Instance = getWeb3Instance();
    const res = await web3Instance.utils.toChecksumAddress(address)
    return res
  }catch(error) {
    return false
  }
}


export async function swapToken(srcToken, destToken, value) {
  const accounts = await getWeb3Instance().eth.getAccounts();
  if (accounts == undefined || accounts == [] || accounts == null) {
    return new Error(`Can't connect to account`);
  }
  const account = accounts[0];

  let txObj = {};
  txObj.from = account;
  if (srcToken.address == EnvConfig.TOKENS[2].address) {
    txObj.value = String(value * Math.pow(10, 18));
  }
  const exchangeContract = getExchangeContract();
  return new Promise((resolve, reject) => {
    exchangeContract.methods.exchangeToken(srcToken.address, destToken.address, String(value * Math.pow(10, 18))).send(txObj).then((result) => {
      resolve(result)
    }, (errer) => {
      reject(errer)
    })
  })

}

export async function transferToken(token, toAddress, value) {
  const accounts = await getWeb3Instance().eth.getAccounts();
  if (accounts == undefined || accounts == [] || accounts == null) {
    return new Error(`Can't connect to account`);
  }
  const account = accounts[0];
  if (token == EnvConfig.TOKENS[2].address) {
    return new Promise((resolve, reject) => {
      try {
        const result = getWeb3Instance().eth.sendTransaction({
          from: account,
          to: toAddress,
          value: String(value * Math.pow(10, 18))
        });
        resolve(result);
      }
      catch (error) {
        reject(error);
      }
    })
  }
  const tokenContract = getTokenContract(token);
  return new Promise((resolve, reject) => {
    tokenContract.methods.transfer(toAddress, String(value * Math.pow(10, 18))).send({
      from: account
    }).then((result) => {
      resolve(result)
    }, (errer) => {
      reject(errer)
    })
  })
}

export async function getTokenBalances(token) {
  /*TODO: Get Token Balance*/
  const accounts = await getWeb3Instance().eth.getAccounts();
  const account = accounts[0];
  if (token == EnvConfig.TOKENS[2].address) {
    return new Promise((resolve, reject) => {
      try {
        const result = getWeb3Instance().eth.getBalance(account);
        resolve(result);
      }
      catch (error) {
        reject(error);
      }
    })
  }
  const tokenContract = getTokenContract(token);
  return new Promise((resolve, reject) => {
    tokenContract.methods.balanceOf(account).call().then((result) => {
      resolve(result)
    }, (errer) => {
      reject(errer)
    })
  })
}
