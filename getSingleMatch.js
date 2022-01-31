const request = require("request");
const cheerio = require("cheerio");
const fs = require("fs");
const excel = require(__dirname + "/excelHandler");

const parentFolder = __dirname + "/IPL 2021/";

function handleSingleMatch(matchURL) {
  request.get(matchURL, function (error, response, html) {
    if (error) {
      console.log("Error on loading match!");
    } else {
      extractMatchDetails(html);
    }
  });
}

function extractMatchDetails(html) {
  // Venue Date Result TeamName OpponentName Runs Fours Sixes StrikeRate ==> These all will be extracted.

  // Venue Date Result will be common for both.

  const $ = cheerio.load(html);

  const allDet = $(".card .match-header-container");

  let venueDate = allDet.find(".description").text();
  const teams = allDet.find(".team p");
  const result = allDet.find(".status-text span").text();

  const team1 = $(teams[0]).text();
  const team2 = $(teams[1]).text();

  const firstTeamFolder = parentFolder + team1;
  const secTeamFolder = parentFolder + team2;

  if (!fs.existsSync(firstTeamFolder)) {
    fs.mkdirSync(firstTeamFolder);
  }

  if (!fs.existsSync(secTeamFolder)) {
    fs.mkdirSync(secTeamFolder);
  }

  venueDate = venueDate.split(",");

  const venue = venueDate[1].trim();
  const date = venueDate[2].trim();

  console.log(
    " \n==================================================================================================\n "
  );
  console.log(
    team1 + " VS " + team2 + " , Date : " + date + " , Venue : " + venue
  );
  console.log(
    " \n==================================================================================================\n "
  );

  const scoreCards = $(".card .Collapsible");

  for (let i = 0; i < scoreCards.length; i++) {
    const scoreCard = $(scoreCards[i]);

    const myTeam = i == 0 ? team1 : team2;
    const oppTeam = i == 0 ? team2 : team1;
    console.log(myTeam + " : \n");
    const allBatsmen = scoreCard.find("table.batsman tbody tr");

    for (let batsmen of allBatsmen) {
      const allDetails = $(batsmen).find("td");

      if (allDetails.length === 8) {
        const name = $(allDetails[0]).text().trim();
        const runs = $(allDetails[2]).text().trim();
        const balls = $(allDetails[3]).text().trim();
        const fours = $(allDetails[5]).text().trim();
        const sixes = $(allDetails[6]).text().trim();
        const strikeRate = $(allDetails[7]).text().trim();

        // Generating the path of the desired workbook as : IPL 2021/{Team Name}/{Player Name}.xlsx
        const workBook = parentFolder + myTeam + "/" + name + ".xlsx";

        // Getting the previous data in the workbook in the sheet {Player Name}
        let allData = excel.readFromExcel(workBook, name);

        const playerData = {
          Team: myTeam,
          Opponent: oppTeam,
          Venue: venue,
          Date: date,
          Name: name,
          Runs: runs,
          Balls: balls,
          Fours: fours,
          Sixes: sixes,
          StrikeRate: strikeRate,
        };

        // Adding the new object in the array;
        allData.push(playerData);

        //Writing the details in the excel workbook and then making its new file
        excel.writeInExcel(workBook, name, allData);

        const playerEntry =
          "Name : " +
          name +
          " | Runs : " +
          runs +
          " | Balls : " +
          balls +
          " | Sixes : " +
          sixes +
          " | Fours : " +
          fours +
          " | Strike Rate : " +
          strikeRate;

        console.log(playerEntry);
      }
    }

    console.log(
      " \n------------------------------------------------------------------------------------------------------------------------- "
    );
    console.log(
      "-------------------------------------------------------------------------------------------------------------------------\n "
    );
  }
}

module.exports = {
  handleSingleMatch: handleSingleMatch,
};
