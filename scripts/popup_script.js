console.log("popup.js");

// Đoạn này xử lý khi click vào nút `Save`

// var button = document.getElementById("save");
// button.onclick = injectScript;

async function injectScript() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  await chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      func: getText,
    },
    (injectionResults) => {
      console.log(injectionResults[0]);
      document.getElementById("chapter").innerHTML = injectionResults[0].result;
    }
  );
}

async function getText() {
  var chapterText =
    document.getElementsByClassName("webkit-chapter")[0].innerHTML;
  return chapterText;
}
var enabled = false; //disabled by default
var myButton = document.getElementById("toggle");

chrome.storage.local.get("enabled", (data) => {
  enabled = !!data.enabled;
  myButton.textContent = enabled ? "Tắt" : "Mở";
});

myButton.onclick = () => {
  enabled = !enabled;
  myButton.textContent = enabled ? "Tắt" : "Mở";
  chrome.storage.local.set({ enabled: enabled });
};
