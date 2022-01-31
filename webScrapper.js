const request = require("request");
const cheerio = require("cheerio");
const allMatches = require(__dirname + "/getAllMatches");
const fs = require("fs");

const homeURL = "https://www.espncricinfo.com";
const folderName = __dirname + "/IPL 2021";

request.get(homeURL, function (error, response, html) {
  if (error) {
    console.log("Error loading homepage!");
  } else {
    handleHomePage(html);
  }
});

function handleHomePage(html) {
  const $ = cheerio.load(html);
  const seriesURl = $(".nav-item a[title='Series']").attr("href");

  request.get(seriesURl, function (error, response, seriesHTML) {
    if (error) {
      console.log("Error loading series page!");
    } else {
      handleSeriesPage(seriesHTML);
    }
  });
}

function handleSeriesPage(html) {
  if (fs.existsSync(folderName)) {
    console.log("YES");
  } else {
    fs.mkdirSync(folderName);
    console.log("NO");
  }
  const $ = cheerio.load(html);
  const iplURL = homeURL + $("a[href='/series/ipl-2021-1249214']").attr("href");
  request.get(iplURL, function (error, response, iplHTML) {
    if (error) {
      console.log("Error loading IPL page!");
    } else {
      allMatches.handleIPLPage(iplHTML);
    }
  });
}
