const request = require("request");
const cheerio = require("cheerio");
const singleMatch = require(__dirname + "/getSingleMatch");

const homeURL = "https://www.espncricinfo.com";

function handleIPLPage(html) {
  const $ = cheerio.load(html);
  const matchURL =
    homeURL + $(".sidebar-widget-league-schedule a.label").attr("href");
  request.get(matchURL, function (error, respomse, matchHTML) {
    if (error) {
      console.log("Error loading matches!");
    } else {
      handleMatches(matchHTML);
    }
  });
}

function handleMatches(html) {
  const $ = cheerio.load(html);

  const allMatches = $(
    ".card.league-scores-container a[data-hover='Scorecard']"
  );

  for (let match of allMatches) {
    const matchURL = homeURL + $(match).attr("href");
    console.log(matchURL);
    singleMatch.handleSingleMatch(matchURL);
  }
}

module.exports = {
  handleIPLPage: handleIPLPage,
};
