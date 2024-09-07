var myKey = "647fe983d91b4e1999872d41f54598f9";
var request = $.ajax({
  method: "GET",
  url: "https://api.rawg.io/api/games",
  data: {
    key: myKey,
    dates: "2024-01-01,2024-04-30",
    ordering: "-added",
  },
});

request.done(function (msg) {
  let popularGames = "";

  for (i = 0; i < 4; i++) {
    let genres_ls = [];
    for (g = 0; g < msg.results[i].genres.length; g++) {
      genres_ls[g] = msg.results[i].genres[g].name;
    }

    let genres = genres_ls.join(", ");

    popularGames +=
      "<div class='pop-box'><img class='pop-img' src='" +
      msg.results[i].background_image +
      "' /><div class='pop-info'><h3 id='game-name'>" +
      msg.results[i].name +
      "</h3><hr /><div><div class='pop-data'>Release date: <span class='pop-result'>" +
      msg.results[i].released +
      "</span></div><div class='pop-data'>Genres : <span class='pop-result'>" +
      genres +
      "</span></div></div></div></div>";
  }

  document.getElementById("pop-container").innerHTML = popularGames;
});

request.fail(function (jqXHR, textStatus) {
  document.write("-failed : " + textStatus + "<br>");
});
