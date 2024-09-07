var myKey = "647fe983d91b4e1999872d41f54598f9";
function getCheckedValues(checkboxList) {
  let checkboxes = document.querySelectorAll(checkboxList);
  let checkedValues = [];

  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      checkedValues.push(parseInt(checkbox.value));
    }
  });
  checkedValues.sort((a, b) => a - b);
  valueStr = checkedValues.join();
  return valueStr;
}

function movePage(url) {
  let moveQuery = {
    method: "GET",
    url: url,
  };
  sendQuery(moveQuery);
}

/*        Sending Query      */
function sendQuery(query) {
  var request = $.ajax(query);
  request.done(function (msg) {
    if (msg.results.length <= 0) {
      document.getElementById("result-display").innerHTML =
        "<div id='no-data'>There is no data!</div>";
      let pagination = document.getElementById("pagination");
      pagination.style.display = "none";
    } else {
      let result = "";
      for (i = 0; i < msg.results.length; i++) {
        /* ------Image------*/
        let gameImg;
        if (msg.results[i].background_image == null) {
          gameImg = "media/null_img.png";
        } else {
          gameImg = msg.results[i].background_image;
        }
        /* ------Rating------*/
        let gameRating = "";
        if (msg.results[i].rating != null) {
          gameRating = msg.results[i].rating;
        }
        /* ------Name------*/
        let gameName = "";
        if (msg.results[i].name != null) {
          gameName = msg.results[i].name;
        }
        /* ------Release Date------*/
        let releaseDate = "";
        if (msg.results[i].released != null) {
          releaseDate = msg.results[i].released;
        }
        /* ------Genre------*/
        let genres_ls = [];
        let gameGenres = "";
        if (msg.results[i].genres != null) {
          for (g = 0; g < msg.results[i].genres.length; g++) {
            genres_ls[g] = msg.results[i].genres[g].name;
          }
          gameGenres = genres_ls.join(", ");
        }
        /* ------Platform------*/
        let platforms_ls = [];
        let gamePlatforms = "";
        if (msg.results[i].platforms != null) {
          for (p = 0; p < msg.results[i].platforms.length; p++) {
            platforms_ls[p] = msg.results[i].platforms[p].platform.name;
          }
          if (platforms_ls.length <= 4) {
            gamePlatforms = platforms_ls.join(", ");
          } else {
            gamePlatforms =
              platforms_ls.slice(0, 4).join(", ") +
              "<span id='extra-platform'>+" +
              platforms_ls.slice(4).length +
              "</span>";
          }
        }

        result += `<div class='result'><div class='result-img'><img src='
        ${gameImg}
        ' /><div class='rating'><i class='fa-solid fa-star'></i>
        ${gameRating}
        </div></div><div class='result-info'><h3 class='result-name'>
        ${gameName}
        </h3><hr /><div class='result-data'><div>Release date : <span class='release-date'>
        ${releaseDate}
        </span></div><div>Genres : <span class='genre'>
        ${gameGenres}
        </span></div><div>Platforms : <span class='platform'>
        ${gamePlatforms}
        </span></div></div></div></div>`;
      }
      document.getElementById("result-display").innerHTML = result;

      /* _____________________pagination_____________________*/
      let pageNum = 1;
      if (query.url.indexOf("&page=") == -1) {
        pageNum = 1;
      } else {
        pageNum = query.url[query.url.indexOf("&page=") + 6];
      }
      document.getElementById("page-num").innerHTML = "Page " + pageNum;
      let nextButton = document.getElementById("next-button");
      if (msg.next != null) {
        nextButton.style.display = "inline";
        nextButton.onclick = function () {
          movePage(msg.next);
        };
      } else {
        nextButton.style.display = "none";
      }
      let previousButton = document.getElementById("previous-button");
      if (msg.previous != null) {
        previousButton.style.display = "inline";
        previousButton.onclick = function () {
          movePage(msg.previous);
        };
      } else {
        previousButton.style.display = "none";
      }
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    }
  });

  request.fail(function (jqXHR, textStatus) {
    document.write("-failed : " + textStatus + "<br>");
  });
}

/*   Generating query from the filter     */

function searchGames() {
  let queryData = new Object();
  let titleInput = document.getElementById("title-input").value;
  let startYear = document.getElementById("start-year").value;
  let endYear = document.getElementById("end-year").value;
  let genreInput = getCheckedValues('#genre-list input[type="checkbox"]');
  let platformInput = getCheckedValues('#platform-list input[type="checkbox"]');

  queryData.key = myKey;
  if (titleInput.length != 0) {
    queryData.search = titleInput;
  }
  if (startYear.length != 0 && endYear.length != 0) {
    queryData.dates = startYear + "-01-01," + endYear + "-12-31";
  }
  if (genreInput.length > 0) {
    queryData.genres = genreInput;
  }
  if (platformInput.length > 0) {
    queryData.platforms = platformInput;
  }
  let query = {
    method: "GET",
    url: "https://api.rawg.io/api/games?page_size=36&page=1",
    data: queryData,
  };
  sendQuery(query);
}

/*----------------default----------------*/
defaultQuery = {
  method: "GET",
  url: "https://api.rawg.io/api/games?page_size=36&page=1",
  data: {
    key: myKey,
    dates: "2024-01-01,2024-04-30",
    ordering: "-added",
  },
};
sendQuery(defaultQuery);
