chrome.storage.local.get("enabled", (data) => {
  if (data.enabled) {
    //it is enabled, do accordingly
    setTimeout(function () {
      var chapter = document.getElementsByClassName("webkit-chapter")[0];
      var title = document.getElementsByClassName("chapter-title")[0];
      if (chapter && title) {
        var titleText = title.innerHTML;
        var chapterText = chapter.innerHTML;
        var wholeContent =
          "\n<h3>" + titleText + "</h3>\n\n" + chapterText + "\n\n";
        copyTextToClipboard(wholeContent);
        // console.log(wholeContent);
      }
    }, 2000);
  } else {
    //it is disabled
  }
});

function copyTextToClipboard(text) {
  //Create a textbox field where we can insert text to.
  var copyFrom = document.createElement("textarea");
  //Set the text content to be the text you wished to copy.
  copyFrom.textContent = text;
  //Append the textbox field into the body as a child.
  document.body.appendChild(copyFrom);
  //Select all the text!
  copyFrom.select();
  navigator.clipboard.writeText(copyFrom.value).then(
    () => {
      //clipboard successfully set
      console.log("copy done");
    },
    () => {
      //clipboard write failed, use fallback
      console.log("copy fail");
    }
  );
  //de-select the text using blur() & remove.
  copyFrom.blur();
  document.body.removeChild(copyFrom);
}
