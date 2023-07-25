//determine necessary parts of tiktok embed
//

let videoCodes = [];
fetch("likes.txt")
  .then((res) => res.text())
  .then((text) => {
    let lines = text.split("\n");
    let i = 0;

    lines.forEach((line) => {
      // if (i < 0) {
      //   return;
      // }
      // i++;
      if (line.startsWith("Video")) {
        let splitLine = line.split("/");
        let videoCode = splitLine[splitLine.length - 2];
        videoCodes.push(videoCode);
      }
    });
    // do something with "text"
  });

const createTiktok = (videoCode) => {
  let template = document.getElementById("template");
  let clone = template.cloneNode(true);
  clone.classList.remove("hidden");
  let cloneChild = clone.children[0];
  cloneChild.setAttribute("data-video-id", videoCode);

  let cite = cloneChild.getAttribute("cite");
  citeList = cite.split("/");
  citeList[citeList.length - 1] = videoCode;
  let modifiedCite = citeList.join("/");
  cloneChild.setAttribute("cite", modifiedCite);
  console.log(modifiedCite);

  return clone;
};

const paginationNumbers = document.getElementById("pagination-numbers");
const paginatedList = document.getElementById("paginated-list");
const listItems = paginatedList.querySelectorAll("li");
const nextButton = document.getElementById("next-button");
const previousButton = document.getElementById("previous-button");

const paginationLimit = 1;
let pageCount = Math.ceil(listItems.length / paginationLimit);
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

  // get element container
  // clear its children
  // create embeds and add  as children in loop

  currentPage = pageNum;
  handlePageStatus();
  handleActivePageNumber();
  const previousRange = (pageNum - 1) * paginationLimit;
  const currentRange = pageNum * paginationLimit;

  videoCodes.forEach((item, index) => {
    // item.classList.add("hidden");
    // if (index >= previousRange && index < currentRange) {
    //   item.classList.remove("hidden");
    // }
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

  document.querySelectorAll(".pagination-number").forEach((button) => {
    console.log("check");
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
