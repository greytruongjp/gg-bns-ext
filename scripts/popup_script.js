console.log("popup.js");

var enabled = false; //disabled by default
var enableBtn = document.getElementById("toggle");
var sourceSelect = document.getElementById("sourceSelect");
var modeSelect = document.getElementById("modeSelect");

chrome.storage.local.get(["enabled", "sourceSelect", "modeSelect"], (data) => {
  enabled = !!data.enabled;
  enableBtn.textContent = enabled ? "Tắt" : "Mở";
  sourceSelect.value = data.sourceSelect;
  modeSelect.value = data.modeSelect;
});

enableBtn.onclick = () => {
  enabled = !enabled;
  enableBtn.textContent = enabled ? "Tắt" : "Mở";
  chrome.storage.local.set({ enabled: enabled });
};

sourceSelect.addEventListener("change", function () {
  chrome.storage.local.set({ sourceSelect: sourceSelect.value });
});

modeSelect.addEventListener("change", function () {
  chrome.storage.local.set({ modeSelect: modeSelect.value });
});
// Đoạn này xử lý khi click vào nút `Save`

// var button = document.getElementById("save");
// button.onclick = injectScript;

// async function injectScript() {
//   const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
//   await chrome.scripting.executeScript(
//     {
//       target: { tabId: tab.id },
//       func: getText,
//     },
//     (injectionResults) => {
//       console.log(injectionResults[0]);
//       document.getElementById("chapter").innerHTML = injectionResults[0].result;
//     }
//   );
// }

// async function getText() {
//   var chapterText =
//     document.getElementsByClassName("webkit-chapter")[0].innerHTML;
//   return chapterText;
// }
