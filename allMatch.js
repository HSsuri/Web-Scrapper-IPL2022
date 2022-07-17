const request= require("request");
const cheerio = require("cheerio");
const scorecard=require("./scoreboard");
function getAllMatchesLink(url){
    request(url,function(err,response,html){if(err) console.log(err);
        else getLink(html);
    });
}

function getLink(html){
    let $= cheerio.load(html);
    let scorecardElems= $(".ds-flex.ds-mx-4.ds-pt-2.ds-pb-3.ds-space-x-4.ds-border-t.ds-border-line-default-translucent>span+span+span a");
    console.log(scorecardElems.length/2);
    for(let i=0; i<scorecardElems.length;i++)
    {   if(i%2!=0) continue;
        let link= $(scorecardElems[i]).attr("href")
        link="https://www.espncricinfo.com" +link;
        console.log(link);
        scorecard.ps(link);
    }

}

module.exports={
    getMatch: getAllMatchesLink
}