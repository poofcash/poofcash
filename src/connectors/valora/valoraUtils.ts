import {
  AccountAuthRequest,
  AccountAuthResponseSuccess,
  DappKitResponse,
  DappKitResponseStatus,
  parseDappkitResponseDeeplink,
  serializeDappKitRequestDeeplink,
  SignTxRequest,
  SignTxResponseSuccess,
  TxToSignParam,
} from "@celo/utils";
import { identity, mapValues } from "lodash";
import * as querystring from "querystring";
import { useEffect } from "react";
import { parse } from "url"; // TODO fix deprecated

const valoraRedirectStorageKey = "valoraRedirect";

// If a Valora response is found in the URL, add it to local storage.
// If Android, close the tab so that we return to original tab.
export const useInitValoraResponse = () => {
  useEffect(() => {
    const resp = parseDappkitResponse(window.location.href);
    if (!resp) {
      return;
    }
    if (resp.status === DappKitResponseStatus.SUCCESS) {
      localStorage.setItem(valoraRedirectStorageKey, window.location.href);
      window.close();
    }
  }, []);
};

/**
 * Parses the response from Dappkit.
 * @param url
 */
export const parseDappkitResponse = (
  url: string
):
  | (DappKitResponse & {
      requestId: string;
    })
  | null => {
  const whereQuery = url.indexOf("?");
  if (whereQuery === -1) {
    return null;
  }
  const searchNonDeduped = url.slice(whereQuery + 1);
  const allSearch = searchNonDeduped.split("?");
  const newQs = allSearch
    .filter(identity)
    .reduce((acc, qs) => ({ ...acc, ...querystring.parse(qs) }), {});
  const realQs = querystring.stringify(newQs);
  const { protocol, host } = parse(url);
  const result = parseDappkitResponseDeeplink(
    `${protocol}//${host}/?${realQs}`
  );
  if (!result.requestId) {
    return null;
  }
  return result;
};

export const awaitDappkitResponse = async <
  T extends DappKitResponse
>(): Promise<T> => {
  return await new Promise((resolve, reject) => {
    const timer = setInterval(() => {
      console.log("awaiting");
      const responseUrl = localStorage.getItem(valoraRedirectStorageKey);
      if (!responseUrl) {
        return;
      }

      // Clear local storage
      localStorage.removeItem(valoraRedirectStorageKey);

      try {
        const response = parseDappkitResponse(responseUrl);
        if (!response) {
          return;
        }
        if (response.status === DappKitResponseStatus.UNAUTHORIZED) {
          reject(new Error("Unauthorized"));
        } else {
          resolve((response as unknown) as T);
        }
        clearInterval(timer);
      } catch (e) {}
    }, 200);
  });
};

export const removeQueryParams = (url: string, keys?: string[]): string => {
  const whereQuery = url.indexOf("?");
  if (whereQuery === -1) {
    return url;
  }
  const searchNonDeduped = url.slice(whereQuery + 1);
  const allSearch = searchNonDeduped.split("?");
  const newQs: Record<string, string> = allSearch.reduce(
    (acc, qs) => ({
      ...acc,
      ...mapValues(querystring.parse(qs), (v) => v?.toString() ?? null),
    }),
    {}
  );
  keys?.forEach((key) => {
    delete newQs[key];
  });
  const { protocol, host, path } = parse(url);
  const queryParams = `${querystring.stringify(newQs)}`;
  const resultUrl = `${protocol}//${host}/${path?.slice(0, path.indexOf("?"))}`;
  if (queryParams) {
    return `${resultUrl}?${queryParams}`;
  }
  return resultUrl;
};

const cleanCallbackUrl = (url: string): string => {
  return removeQueryParams(url, []);
};

/**
 * Requests auth from the Valora app.
 */
export const requestValoraAuth = async (): Promise<AccountAuthResponseSuccess> => {
  const requestId = "login";
  const dappName = "Poof";
  const callback = cleanCallbackUrl(window.location.href);
  window.location.href = serializeDappKitRequestDeeplink(
    AccountAuthRequest({
      requestId,
      dappName,
      callback,
    })
  );

  return await awaitDappkitResponse<AccountAuthResponseSuccess>();
};

/**
 * Requests auth from the Valora app.
 */
export const requestValoraTransaction = async (
  txs: TxToSignParam[]
): Promise<SignTxResponseSuccess> => {
  const requestId = "make-transaction";
  const dappName = "Poof";
  const callback = cleanCallbackUrl(window.location.href);
  window.location.href = serializeDappKitRequestDeeplink(
    SignTxRequest(txs, {
      requestId,
      dappName,
      callback,
    })
  );

  return await awaitDappkitResponse<SignTxResponseSuccess>();
};

export type IValoraAccount = Pick<
  AccountAuthResponseSuccess,
  "address" | "phoneNumber"
>;
