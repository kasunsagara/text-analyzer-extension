document.addEventListener("mouseup", () => {
  const text = window.getSelection().toString().trim();

  if (text.length > 0) {
    chrome.storage.local.set({ selectedText: text });
  }
});