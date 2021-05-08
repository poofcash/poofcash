// Largely based off of CeloVote
// https://github.com/zviadm/celovote-app/blob/main/src/ledger.ts

import { ContractKit, newKit } from "@celo/contractkit";
import {
  AddressValidation,
  LedgerWallet,
  newLedgerWalletWithSetup,
} from "@celo/wallet-ledger";
import TransportWebUSB from "@ledgerhq/hw-transport-webusb";
import { ChainId, CHAIN_INFO } from "@ubeswap/sdk";
import { AbstractConnector } from "@web3-react/abstract-connector";
import { ConnectorUpdate } from "@web3-react/types";
import { CHAIN_ID } from "config";

export const NUM_LEDGER_ACCOUNT_IDXS = 10;

class LedgerKit {
  private closed = false;
  private constructor(
    public chainId: ChainId,
    public kit: ContractKit,
    public wallet: LedgerWallet
  ) {}

  public static async init(chainId: ChainId, idxs: number[]) {
    const transport = await TransportWebUSB.create();
    try {
      const wallet = await newLedgerWalletWithSetup(
        transport,
        idxs,
        undefined,
        AddressValidation.never
      );
      const kit = newKit(CHAIN_INFO[chainId].fornoURL, wallet);
      return new LedgerKit(chainId, kit, wallet);
    } catch (e) {
      transport.close();
      throw e;
    }
  }

  close = () => {
    if (this.closed) {
      return;
    }
    this.closed = true;
    this.wallet.transport.close();
    this.kit.stop();
  };
}

export class LedgerConnector extends AbstractConnector {
  private kit: LedgerKit | null = null;
  private accountIdx: number = 0;

  constructor(accountIdx: number) {
    super({ supportedChainIds: [CHAIN_ID] });
    this.accountIdx = accountIdx;
  }

  public async activate(): Promise<ConnectorUpdate> {
    const idxs = Array(NUM_LEDGER_ACCOUNT_IDXS)
      .fill(0)
      .map((_, idx) => idx);
    const ledgerKit = await LedgerKit.init(CHAIN_ID, idxs);
    this.kit = ledgerKit;
    return {
      provider: ledgerKit.kit.web3.currentProvider,
      chainId: CHAIN_ID,
      account: ledgerKit.wallet.getAccounts()[this.accountIdx],
    };
  }

  public async getProvider(): Promise<any> {
    return this.kit?.kit.web3.currentProvider ?? null;
  }

  public async getChainId(): Promise<number> {
    return CHAIN_ID;
  }

  public async getAccount(): Promise<string | null> {
    return this.kit?.wallet.getAccounts()?.[0] ?? null;
  }

  public deactivate() {
    this.kit?.close();
  }
}
