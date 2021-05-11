// From https://stackoverflow.com/questions/13405129/javascript-create-and-save-file
export const downloadFile = (filename: string, text: string) => {
  const file = new Blob([text], { type: "text/plain" });
  const a = document.createElement("a");
  const url = URL.createObjectURL(file);
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(function () {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 0);
};
