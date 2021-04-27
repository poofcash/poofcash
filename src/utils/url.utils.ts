export const isValidHttpUrl = (testUrl: string) => {
  let url;

  try {
    url = new URL(testUrl);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
};
