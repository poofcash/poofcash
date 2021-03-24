import { Contract } from "@ethersproject/contracts";
import ERC20_ABI from "abis/erc20.json";
import ERC20_TORNADO_ABI from "abis/erc20tornado.json";
import { Web3Provider, JsonRpcSigner } from "@ethersproject/providers";
import { getAddress } from "@ethersproject/address";
import { AddressZero } from "@ethersproject/constants";
import { NetworkContextName } from "index";
import { useWeb3React } from "@web3-react/core";

// returns the checksummed address if the address is valid, otherwise returns false
function isAddress(value: any): string | false {
  try {
    return getAddress(value);
  } catch {
    return false;
  }
}

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
  address: string,
  ABI: any,
  library: Web3Provider,
  account?: string
): Contract {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }

  return new Contract(
    address,
    ABI,
    getProviderOrSigner(library, account) as any
  );
}

// returns null on errors
function useContract(
  address: string | undefined,
  ABI: any,
  withSignerIfPossible = true
): Contract | null {
  const { library, account } = useWeb3React();
  const { library: networkLibrary } = useWeb3React(NetworkContextName);

  if (!address || !ABI) return null;
  try {
    if (library) {
      return getContract(
        address,
        ABI,
        library,
        withSignerIfPossible && account ? account : undefined
      );
    } else if (networkLibrary) {
      return getContract(address, ABI, networkLibrary, undefined);
    }
    return null;
  } catch (error) {
    console.error("Failed to get contract", error);
    return null;
  }
}

export function useTokenContract(
  tokenAddress?: string,
  withSignerIfPossible?: boolean
): Contract | null {
  return useContract(tokenAddress, ERC20_ABI, withSignerIfPossible);
}

export function useTornadoTokenContract(
  tornadoTokenAddress: string,
  withSignerIfPossible: boolean
): Contract | null {
  const contract = useContract(
    tornadoTokenAddress,
    ERC20_TORNADO_ABI,
    withSignerIfPossible
  );
  if (!withSignerIfPossible) {
    return new Contract(tornadoTokenAddress, ERC20_TORNADO_ABI);
  }
  return contract;
}
