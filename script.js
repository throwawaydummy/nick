fetch("likes.txt")
  .then((res) => res.text())
  .then((text) => {
    let lines = text.split("\n");
    let i = 0;

    lines.forEach((line) => {
      if (i < 0) {
        return;
      }
      i++;
      if (line.startsWith("Video")) {
        let splitLine = line.split("/");
        let videoCode = splitLine[splitLine.length - 2];
        // console.log(videoCode);
        let template = document.getElementById("template");
        let clone = template.cloneNode(true);
        let cloneChild = clone.children[0];
        cloneChild.setAttribute("data-video-id", videoCode);

        let cite = cloneChild.getAttribute("cite");
        citeList = cite.split("/");
        citeList[citeList.length - 1] = videoCode;

        let modifiedCite = citeList.join("/");
        cloneChild.setAttribute("cite", modifiedCite);
        console.log(modifiedCite);

        document.getElementById("template2").appendChild(clone);
      }
    });
    // do something with "text"
  })
  .catch((e) => console.error(e));
