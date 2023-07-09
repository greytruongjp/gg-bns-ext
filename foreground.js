var sourceSelect = "vipbsn";
var modeSelect = "0";
var localPostUrl = "http://localhost/qbook/api/create.php";
var postUrl = "https://tukulab.com/qbook/api/create.php";
var timeoutSecond = 4500;
chrome.storage.local.get(
  ["enabled", "sourceSelect", "modeSelect", "manualMode"],
  (data) => {
    console.log(data);
    if (data.sourceSelect) {
      sourceSelect = data.sourceSelect;
    }
    if (data.modeSelect) {
      modeSelect = data.modeSelect;
    }
    if (data.enabled || data.manualMode) {
      //it is enabled, do accordingly
      setTimeout(function () {
        if (sourceSelect == "vipbsn") {
          // var chapter = document.getElementsByClassName("webkit-chapter")[0];
          var chapter = getElementByXpath("//*[@id='chapter-id']/div/span");
          var title = document.getElementsByClassName("chapter-title")[0];
          var book = getElementByXpath(
            "//*[@id='box-chapter-content']/div/div[2]/div[1]/div/div/nav/ol/li[3]/a"
          );
          var bookAuthor = getElementByXpath(
            '//*[@id="id_chap_content"]/ul/li[2]/p'
          ).innerText;
          var btnBuyChapter = document.getElementsByClassName("btn-buy")[0];
          if (btnBuyChapter) {
            console.log("chưa mua chương");
          } else {
            if (chapter && title && book && !btnBuyChapter) {
              var bookName = book.innerText;
              var titleText = title.innerText;
              var chapterText = chapter.innerHTML;
              var chapterNo = parseInt(textbetween(titleText, "Chương", ":"));
              // console.log("title " + titleText);
              console.log("chapter " + chapterText);
              // console.log("chapter No " + chapterNo);
              // console.log("book name " + bookName);
              // console.log("Book author " + bookAuthor);

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
        }
        if (sourceSelect == "mtc") {
          var book = getElementByXpath("/html/head/title");
          console.log(book);
          var title = getElementByXpath('//*[@id="js-read__body"]/div[2]');
          var chapter = getElementByXpath('//*[@id="article"]');
          if (chapter && title && book) {
            var bookAuthor = "mtc";
            var bookName = book.innerText.split(" -")[0];
            var titleText = title.innerHTML;
            var chapterText = chapter.innerHTML;
            var totalDivsInChapter = occurrences(chapterText, "</div>");
            // console.log(totalDivsInChapter);
            if (totalDivsInChapter > 0) {
              for (i = 0; i < totalDivsInChapter; i++) {
                var adsText = textbetween(chapterText, "<div", "</div>");
                adsText = "<div" + adsText + "</div>";
                // console.log(adsText);
                newChapterText = chapterText.replace(adsText, "");
                chapterText = newChapterText;
              }
            }
            var chapterNo = parseInt(book.innerText.split("- Chương ")[1]);
            console.log("title " + titleText);
            console.log("chapter " + chapterText);
            console.log("chapter No " + chapterNo);
            console.log("Book Name " + bookName);
            console.log("Book author " + bookAuthor);
            insertTexttoDbMtc(
              titleText,
              chapterText,
              chapterNo,
              bookName,
              modeSelect,
              bookAuthor
            );
          }
        }
      }, timeoutSecond);
    } else {
      //it is disabled
    }
  }
);

function insertTexttoDb(
  titleText,
  chapterText,
  chapterNo,
  bookName,
  modeSelect,
  bookAuthor
) {
  postData(postUrl, {
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
        let btnNextBns = getElementByXpath(
          "//*[@id='box-chapter-content']/div/div[2]/div[1]/div/div/div[2]/div[1]/div[2]/a"
        );
        btnNextBns.click();
      }
    }
  });
}

function insertTexttoDbMtc(
  titleText,
  chapterText,
  chapterNo,
  bookName,
  modeSelect,
  bookAuthor
) {
  postData(postUrl, {
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
        let btnNextMtc = getElementByXpath(
          "/html/body/div[1]/div/div/main/div[3]/div[6]/div[1]/a[2]"
        );
        btnNextMtc.click();
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
function occurrences(string, subString, allowOverlapping) {
  string += "";
  subString += "";
  if (subString.length <= 0) return string.length + 1;

  var n = 0,
    pos = 0,
    step = allowOverlapping ? 1 : subString.length;

  while (true) {
    pos = string.indexOf(subString, pos);
    if (pos >= 0) {
      ++n;
      pos += step;
    } else break;
  }
  return n;
}
