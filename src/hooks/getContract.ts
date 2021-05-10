import ERC20_ABI from "abis/erc20.json";
import ERC20_TORNADO_ABI from "abis/erc20tornado.json";
import { Web3Provider, JsonRpcSigner } from "@ethersproject/providers";
// import { getAddress } from "@ethersproject/address";
import { Contract } from "web3-eth-contract";
import { ContractKit } from "@celo/contractkit";

// TODO: Does this need to be added back in? I thought this was used for field verification on the withdraw page
// returns the checksummed address if the address is valid, otherwise returns false
// function isAddress(value: any): string | false {
//   try {
//     return getAddress(value);
//   } catch {
//     return false;
//   }
// }

// account is not optional
function getSigner(library: Web3Provider, account: string): JsonRpcSigner {
  return library.getSigner(account).connectUnchecked();
}

// account is optional
export function getProviderOrSigner(
  library: Web3Provider,
  account?: string
): Web3Provider | JsonRpcSigner {
  return account ? getSigner(library, account) : library;
}

// account is optional
export function getContract(
  kit: ContractKit,
  ABI: any,
  address?: string
): Contract {
  return new kit.web3.eth.Contract(ABI, address);
}

export function getTokenContract(
  kit: ContractKit,
  tokenAddress?: string
): Contract {
  return getContract(kit, ERC20_ABI, tokenAddress);
}

export function getTornadoContract(
  kit: ContractKit,
  tornadoTokenAddress: string
): Contract {
  return getContract(kit, ERC20_TORNADO_ABI, tornadoTokenAddress);
}
