import { getExchangeContract, getTokenContract } from "./web3Service";

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

/* Get Exchange Rate from Smart Contract */
export function getExchangeRate(srcTokenAddress, destTokenAddress, srcAmount) {
  const exchangeContract = getExchangeContract();
  const tokenContract = getTokenContract();

  const accoutn = tokenContract.eth.getAccounts();
  accoutn.then(res => console.log(res))

  return new Promise((resolve, reject) => {
    exchangeContract.methods.getExchangeRate(srcTokenAddress, destTokenAddress, srcAmount).call().then((result) => {
      resolve(result)
    }, (error) => {
      reject(error);
    })
  })
}

export async function getTokenBalances(tokens, address) {
  /*TODO: Get Token Balance*/
}
