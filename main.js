const request= require("request");
const cheerio = require("cheerio");
const allMatch= require("./allMatch")
const url="https://www.espncricinfo.com/series/indian-premier-league-2022-1298423";
request(url,cb);
function cb(err,response,html){
    if(err) console.log(err);
    else extractLink(html);
    // console.log(true);

}

function extractLink(html){
    let $= cheerio.load(html);
    // console.log(html);
    let element= $("a[class='ds-block ds-text-center ds-uppercase ds-text-ui-typo-primary ds-underline-offset-4 hover:ds-underline hover:ds-decoration-ui-stroke-primary ds-block']");
    // console.log(element);
    let link= element.attr("href");
    let fulllink = "https://www.espncricinfo.com"+link;
    console.log(fulllink);
    allMatch.getMatch(fulllink);

}



