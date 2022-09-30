var sourceSelect = "vipbsn";
var modeSelect = "0";

chrome.storage.local.get(["enabled", "sourceSelect", "modeSelect"], (data) => {
  if (data.sourceSelect) {
    sourceSelect = data.sourceSelect;
  }
  if (data.modeSelect) {
    modeSelect = data.modeSelect;
  }
  if (data.enabled) {
    //it is enabled, do accordingly
    setTimeout(function () {
      if (sourceSelect == "vipbsn") {
        var chapter = document.getElementsByClassName("webkit-chapter")[0];
        var title = document.getElementsByClassName("chapter-title")[0];
        var book = getElementByXpath(
          "/html/body/div[1]/div[1]/div[1]/div[2]/div[1]/div/div/nav/ol/li[3]/a"
        );
        var bookAuthor = getElementByXpath(
          '//*[@id="id_chap_content"]/ul/li[2]/p'
        ).innerText;
        if (chapter && title && book) {
          var bookName = book.innerText;
          var titleText = title.innerText;
          var chapterText = chapter.innerHTML;
          var chapterNo = parseInt(textbetween(titleText, "Chương", ":"));
          insertTexttoDb(
            titleText,
            chapterText,
            chapterNo,
            bookName,
            modeSelect,
            bookAuthor
          );
        }
      }
    }, 3000);
  } else {
    //it is disabled
  }
});

function insertTexttoDb(
  titleText,
  chapterText,
  chapterNo,
  bookName,
  modeSelect,
  bookAuthor
) {
  postData("http://localhost/qbook/api/create.php", {
    chapter_title: titleText,
    chapter_content: chapterText,
    chapter_no: chapterNo,
    book_name: bookName,
    book_author: bookAuthor,
  }).then((data) => {
    console.log(data.status);
    if (data.status == 200) {
      //  trigger next button
      if (modeSelect == 1) {
        let x = getElementByXpath(
          "/html/body/div[1]/div[1]/div[1]/div[2]/div[1]/div/div/div[2]/div[1]/div[2]/a"
        );
        x.click();
      }
    }
  });
}

function getElementByXpath(path) {
  return document.evaluate(
    path,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue;
}

async function postData(url = "", data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

function textbetween(s, prefix, suffix) {
  var i = s.indexOf(prefix);
  if (i >= 0) {
    s = s.substring(i + prefix.length);
  } else {
    return "";
  }
  if (suffix) {
    i = s.indexOf(suffix);
    if (i >= 0) {
      s = s.substring(0, i);
    } else {
      return "";
    }
  }
  return s;
}
// function copyTextToClipboard(text) {
//   var copyFrom = document.createElement("textarea");
//   copyFrom.textContent = text;
//   document.body.appendChild(copyFrom);
//   copyFrom.select();
//   navigator.clipboard.writeText(copyFrom.value).then(
//     () => {
//       console.log("copy done");
//       copyFrom.blur();
//       document.body.removeChild(copyFrom);

//       // trigger next button
//       // let x = getElementByXpath(
//       //   "/html/body/div[1]/div[1]/div[1]/div[2]/div[1]/div/div/div[2]/div[1]/div[2]/a"
//       // );
//       // x.click();
//     },
//     () => {
//       //clipboard write failed, use fallback
//       console.log("copy fail");
//     }
//   );
//   //de-select the text using blur() & remove.
// }
