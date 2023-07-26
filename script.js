//determine necessary parts of tiktok embed
//

let videoCodes = [];

const request = new XMLHttpRequest();
request.open("GET", "likes.txt", false); // `false` makes the request synchronous
request.send(null);

let lines = request.responseText.split("\n");
let i = 0;
lines.forEach((line) => {
  if (line.startsWith("Video")) {
    let splitLine = line.split("/");
    let videoCode = splitLine[splitLine.length - 2];
    videoCodes.push(videoCode);
  }
});

const createTiktok = (videoCode) => {
  // <dummy id="template" class="hidden tiktok">
  // <blockquote
  //   class="tiktok-embed"
  //   cite="https://www.tiktok.com/share/video/7137844136069319982"
  //   data-video-id="7137844136069319982"
  //   style="max-width: 605px; min-width: 325px"
  // >
  //   <section></section>
  // </blockquote>
  // <script async src="https://www.tiktok.com/embed.js"></script>
  // </dummy>

  // let template = document.getElementById("template");
  // let clone = template.cloneNode(true);
  // clone.classList.remove("hidden");
  // let cloneChild = clone.children[0];
  // cloneChild.setAttribute("data-video-id", videoCode);
  // clone.setAttribute("id", videoCode);

  // let cite = cloneChild.getAttribute("cite");
  // citeList = cite.split("/");
  // citeList[citeList.length - 1] = videoCode;
  // let modifiedCite = citeList.join("/");
  // cloneChild.setAttribute("cite", modifiedCite);
  // let src = cloneChild.firstChild;
  // console.log(src);

  const tikTokFrame = document.createElement("iframe");
  tikTokFrame.classList = "tiktok";
  tikTokFrame.width = "100%";

  tikTokFrame.src = "https://www.tiktok.com/embed/v2/" + videoCode;

  function resizeIframe(iframe) {
    iframe.height = iframe.contentWindow.document.body.scrollHeight + "px";
    console.log("called");
  }
  tikTokFrame.onload = resizeIframe;

  return tikTokFrame;
};

const paginationNumbers = document.getElementById("pagination-numbers");
const paginatedList = document.getElementById("paginated-list");
const listItems = paginatedList.querySelectorAll("li");
const nextButton = document.getElementById("next-button");
const previousButton = document.getElementById("previous-button");
const nextButton2 = document.getElementById("next-button2");
const previousButton2 = document.getElementById("previous-button2");

const paginationLimit = 11;
let pageCount = Math.ceil(videoCodes.length / paginationLimit);

let currentPage = 1;

const appendPageNumber = (index) => {
  const pageNumber = document.createElement("button");
  pageNumber.className = "pagination-number";
  pageNumber.innerHTML = index;
  pageNumber.setAttribute("page-index", index);

  paginationNumbers.appendChild(pageNumber);
};

const getPaginationNumbers = () => {
  for (let i = 1; i <= pageCount; i++) {
    appendPageNumber(i);
  }
};

const setCurrentPage = (pageNum) => {
  if (pageNum > pageCount || pageNum < 1) {
    return;
  }
  currentPage = pageNum;

  // get element container
  // clear its children
  // create embeds and add  as children in loop

  handlePageStatus();
  handleActivePageNumber();
  const previousRange = (pageNum - 1) * paginationLimit;
  const currentRange = pageNum * paginationLimit;
  while (paginatedList.firstChild) {
    paginatedList.removeChild(paginatedList.firstChild);
  }

  videoCodes.forEach((item, index) => {
    if (
      index > (currentPage - 1) * paginationLimit &&
      index < currentPage * paginationLimit
    ) {
      paginatedList.appendChild(createTiktok(item));
    }
  });
};

//check if necessary with defer script

window.addEventListener("load", () => {
  getPaginationNumbers();
  setCurrentPage(1);

  previousButton.addEventListener("click", () => {
    setCurrentPage(currentPage - 1);
  });

  nextButton.addEventListener("click", () => {
    setCurrentPage(currentPage + 1);
  });

  previousButton2.addEventListener("click", () => {
    setCurrentPage(currentPage - 1);
  });

  nextButton2.addEventListener("click", () => {
    setCurrentPage(currentPage + 1);
  });

  document.querySelectorAll(".pagination-number").forEach((button) => {
    const pageIndex = Number(button.getAttribute("page-index"));

    if (pageIndex) {
      button.addEventListener("click", () => {
        setCurrentPage(pageIndex);
      });
    }
  });
});

const handleActivePageNumber = () => {
  document.querySelectorAll(".pagination-number").forEach((button) => {
    button.classList.remove("active");
    const pageIndex = Number(button.getAttribute("page-index"));
    if (pageIndex == currentPage) {
      button.classList.add("active");
    }
  });
};

const disableButton = (button) => {
  button.classList.add("disabled");
  button.setAttribute("disabled", true);
};

const enableButton = (button) => {
  button.classList.remove("disabled");
  button.removeAttribute("disabled");
};

const handlePageStatus = () => {
  if (currentPage === 1) {
    disableButton(previousButton);
  } else {
    enableButton(previousButton);
  }

  if (pageCount === currentPage) {
    disableButton(nextButton);
  } else {
    enableButton(nextButton);
  }
};

let touchstartX = 0;
let touchendX = 0;

function checkDirection() {
  if (touchendX < touchstartX) setCurrentPage(currentPage + 1);
  if (touchendX > touchstartX) setCurrentPage(currentPage - 1);
}

document.addEventListener("touchstart", (e) => {
  touchstartX = e.changedTouches[0].screenX;
});

document.addEventListener("touchend", (e) => {
  touchendX = e.changedTouches[0].screenX;
  checkDirection();
});
