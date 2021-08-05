import React from "react";
import { PoofKitGlobal } from "hooks/usePoofKit";
import { useRecoilState } from "recoil";
import {
  depositActualAmount,
  depositCurrency,
  depositNotes,
} from "pages/DepositPage/state";
import { parseNote } from "utils/snarks-functions";
import { fromWei } from "web3-utils";
import { useAsyncState } from "hooks/useAsyncState";
import { usePoofPrice } from "./usePoofPrice";
import { useCeloPrice } from "./useCeloPrice";
import { useRCeloPrice } from "./useRCeloPrice";
import { apr } from "utils/interest";

export const BLOCKS_PER_WEEK = 120960;

export const useMiningRate = () => {
  const [notes] = useRecoilState(depositNotes);
  const [actualAmount] = useRecoilState(depositActualAmount);
  const [currency] = useRecoilState(depositCurrency);
  const { poofKit } = PoofKitGlobal.useContainer();

  const getMiningRate = React.useCallback(async () => {
    let totalPoofRate = 0;
    let totalApRate = 0;
    const memo: Record<string, { poofRate: string; apRate: string }> = {};
    for (const note of notes) {
      const { currency, amount, netId } = parseNote(note.noteString);
      if (memo[`${currency}${amount}${netId}`]) {
        const { poofRate, apRate } = memo[`${currency}${amount}${netId}`];
        totalPoofRate += Number(fromWei(poofRate));
        totalApRate += Number(apRate);
      } else {
        const { poofRate, apRate } = await poofKit.miningRate(
          currency,
          amount,
          netId?.toString() ?? "",
          BLOCKS_PER_WEEK
        );
        memo[`${currency}${amount}${netId}`] = { poofRate, apRate };
        totalPoofRate += Number(fromWei(poofRate));
        totalApRate += Number(apRate);
      }
    }
    return {
      poofRate: totalPoofRate.toString(),
      apRate: totalApRate.toString(),
    };
  }, [notes, poofKit]);
  const [{ poofRate, apRate }] = useAsyncState(
    { poofRate: "0", apRate: "0" },
    getMiningRate
  );

  const [poofPrice] = usePoofPrice();
  const [celoPrice] = useCeloPrice();
  const [rCeloPrice] = useRCeloPrice();
  const poofRewardsUsd = Number(poofRate) * poofPrice;
  let depositApr = 0;
  if (Number(actualAmount) === 0) {
    depositApr = 0;
  } else if (currency.toLowerCase() === "celo") {
    depositApr = apr(Number(actualAmount) * celoPrice, poofRewardsUsd, 52);
  } else if (currency.toLowerCase() === "rcelo") {
    depositApr = apr(Number(actualAmount) * rCeloPrice, poofRewardsUsd, 52);
  }

  return { poofRate, apRate, depositApr };
};
