var fuse;
var showButton = document.getElementById("search-button");
var showButtonMobile = document.getElementById("search-button-mobile");
var hideButton = document.getElementById("close-search-button");
var wrapper = document.getElementById("search-wrapper");
var modal = document.getElementById("search-modal");
var input = document.getElementById("search-query");
var output = document.getElementById("search-results");
var first = output.firstChild;
var last = output.lastChild;
var searchVisible = false;
var indexed = false;
var hasResults = false;
var MIN_QUERY_LENGTH = 2;

showButton ? showButton.addEventListener("click", displaySearch) : null;
showButtonMobile ? showButtonMobile.addEventListener("click", displaySearch) : null;
hideButton.addEventListener("click", hideSearch);
wrapper.addEventListener("click", hideSearch);
modal.addEventListener("click", function (event) {
  event.stopPropagation();
  event.stopImmediatePropagation();
  return false;
});
document.addEventListener("keydown", function (event) {
  if (event.key == "/") {
    var active = document.activeElement;
    var tag = active.tagName;
    var isInputField = tag === "INPUT" || tag === "TEXTAREA" || active.isContentEditable;
    if (!searchVisible && !isInputField) {
      event.preventDefault();
      displaySearch();
    }
  }
  if (event.key == "Escape") {
    hideSearch();
  }
  if (event.key == "ArrowDown" && searchVisible && hasResults) {
    event.preventDefault();
    if (document.activeElement == input) { first.focus(); }
    else if (document.activeElement == last) { last.focus(); }
    else { document.activeElement.parentElement.nextSibling.firstElementChild.focus(); }
  }
  if (event.key == "ArrowUp" && searchVisible && hasResults) {
    event.preventDefault();
    if (document.activeElement == first) { input.focus(); }
    else if (document.activeElement == input) { input.focus(); }
    else { document.activeElement.parentElement.previousSibling.firstElementChild.focus(); }
  }
  if (event.key == "Enter" && searchVisible && hasResults) {
    event.preventDefault();
    if (document.activeElement == input) { first.focus(); }
    else { document.activeElement.click(); }
  }
});

input.onkeyup = function (event) {
  executeQuery(this.value);
};

function displaySearch() {
  if (!indexed) { buildIndex(); }
  if (!searchVisible) {
    document.body.style.overflow = "hidden";
    wrapper.style.visibility = "visible";
    input.focus();
    searchVisible = true;
  }
}

function hideSearch() {
  if (searchVisible) {
    document.body.style.overflow = "visible";
    wrapper.style.visibility = "hidden";
    input.value = "";
    output.innerHTML = "";
    document.activeElement.blur();
    searchVisible = false;
  }
}

function fetchJSON(path, callback) {
  var httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = function () {
    if (httpRequest.readyState === 4 && httpRequest.status === 200) {
      var data = JSON.parse(httpRequest.responseText);
      if (callback) callback(data);
    }
  };
  httpRequest.open("GET", path);
  httpRequest.send();
}

function buildIndex() {
  var baseURL = wrapper.getAttribute("data-url").replace(/\/?$/, "/");
  fetchJSON(baseURL + "index.json", function (data) {
    var options = {
      shouldSort: true,
      ignoreLocation: true,
      threshold: 0.3,
      includeMatches: true,
      minMatchCharLength: 2,
      keys: [
        { name: "title", weight: 0.7 },
        { name: "summary", weight: 0.3 },
      ],
    };
    fuse = new Fuse(data, options);
    indexed = true;
  });
}

function executeQuery(term) {
  if (term.length < MIN_QUERY_LENGTH) {
    output.innerHTML = "";
    hasResults = false;
    return;
  }
  var results = fuse.search(term).slice(0, 8);
  var resultsHTML = "";
  if (results.length > 0) {
    results.forEach(function (value) {
      var title = value.item.externalUrl
        ? value.item.title + '<span class="text-xs ml-2 text-neutral-400 dark:text-neutral-500">' + value.item.externalUrl + "</span>"
        : value.item.title;
      var linkconfig = value.item.externalUrl
        ? 'target="_blank" rel="noopener" href="' + value.item.externalUrl + '"'
        : 'href="' + value.item.permalink + '"';
      resultsHTML += '<li class="mb-2">' +
        '<a class="flex items-center px-3 py-2 rounded-md appearance-none bg-neutral-100 dark:bg-neutral-700 focus:bg-primary-100 hover:bg-primary-100 dark:hover:bg-primary-900 dark:focus:bg-primary-900 focus:outline-dotted focus:outline-transparent focus:outline-2" ' +
        linkconfig + ' tabindex="0">' +
          '<div class="grow">' +
            '<div class="text-lg font-bold">' + title + '</div>' +
            '<div class="text-sm text-neutral-500 dark:text-neutral-400">' + value.item.section +
              '<span class="px-2 text-primary-500">&middot;</span>' +
              (value.item.date ? value.item.date : "") +
            '</div>' +
          '</div>' +
          '<div class="ml-2 ltr:block rtl:hidden text-neutral-500">&rarr;</div>' +
          '<div class="mr-2 ltr:hidden rtl:block text-neutral-500">&larr;</div>' +
        '</a>' +
      '</li>';
    });
    hasResults = true;
  } else {
    hasResults = false;
  }
  output.innerHTML = resultsHTML;
  if (results.length > 0) {
    first = output.firstChild.firstElementChild;
    last = output.lastChild.firstElementChild;
  }
}
