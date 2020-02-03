const scrapeWebsite = require("../scrapeWebsite");
const slack = require("../slackBlock");

module.exports = (function() {
  let _data = null;
  let _context = null;

  const scrape = async function() {
    const $ = await scrapeWebsite(
      "http://www.meatingpoint.pl/lokal/marynarska-12-warszawa/"
    );

    const dateInfo = $(".day-menu-date")
      .text()
      .trim();

    _context = `${dateInfo} <http://www.meatingpoint.pl/lokal/marynarska-12-warszawa/|www.meatingpoint.pl/lokal/marynarska-12-warszawa>`;

    const sectionTitles = ["zupy", "danie główne", "sałatki/warzywa", "dodatki"];
    _data = [];
    $(".day-dishes-list").each((i, section) => {
      if (i > 1) return;
      const [title, ...entries] = $(section)
        .text()
        .split("\n")
        .map(line => line.trim())
        .filter(Boolean);
      _data.push(
        "🚀 " + title + " 🚀",
        ...entries.map(line =>
          sectionTitles.includes(line.toLowerCase()) ? "*" + line + "*" : "• " + line
        )
      );
    });
    return this;
  };

  const createMessageBlock = function() {
    return [slack.section(`>>>${_data.join("\n")}`)];
  };

  return {
    get title() {
      return "Meating Point";
    },
    get emoji() {
      return "🥩";
    },
    get text() {
      return _data;
    },
    get context() {
      return _context;
    },
    scrape,
    createMessageBlock
  };
})();
