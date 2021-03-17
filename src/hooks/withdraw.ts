// TODO no any
export const generateProofOverNetwork = async ({
  deposit,
  recipient,
  refund,
}: any) => {
  let url = new URL("/api/proof");
  url.searchParams.append("deposit", deposit);
  url.searchParams.append("recipient", recipient);
  url.searchParams.append("refund", refund);
  console.log(url.toString());
  const res = await fetch(url.toString());
  const json = await res.json();
  return json;
};
