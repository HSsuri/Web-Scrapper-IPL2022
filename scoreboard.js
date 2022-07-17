const request= require("request");
const cheerio = require("cheerio");
// const url="https://www.espncricinfo.com/series/indian-premier-league-2022-1298423/chennai-super-kings-vs-kolkata-knight-riders-1st-match-1304047/full-scorecard";
function process(url){
    request(url,cb);
}

function cb(err,response,html){
    if(err) console.log(err);
    else extractMatchDetails(html);
    // console.log(true);

}
var count=0;
function extractMatchDetails(html){
    let $= cheerio.load(html);
     // venue- ds-text-tight-m ds-font-regular ds-text-ui-typo-mid
     // result- ds-text-tight-m ds-font-regular ds-truncate ds-text-typo-title span
    let desc= $(".ds-text-tight-m.ds-font-regular.ds-text-ui-typo-mid");
    let res= $(".ds-text-tight-m.ds-font-regular.ds-truncate.ds-text-typo-title span");
    let stringArr= desc.text().split(','); 
    let match= stringArr[0].split('(N)');
    let matchNo= match[0].trim();
    let venue= stringArr[1].trim();
    let date = stringArr[2].trim() + " 2022";
    let result=res.text();
    count++;
    console.log(count);
    console.log(matchNo);
    let innings= $(".ds-bg-fill-content-prime.ds-rounded-lg");
    let inHtML= "";
    for (let index = 0; index < innings.length; index++) {
        let teamName= $(innings[index]).find(".ds-text-tight-s.ds-font-bold.ds-uppercase").text();
        teamName= teamName.split('INNINGS')[0].trim();
        let opIndex= index==0?1:0;
        let oppName=$(innings[opIndex]).find(".ds-text-tight-s.ds-font-bold.ds-uppercase").text();
        oppName= oppName.split('INNINGS')[0].trim();
        console.log(teamName);
        console.log(oppName);
        let batsmantable= $(innings[index]).find("table")[0];
        let allRows= $(batsmantable).find("tbody tr");
        // console.log(allrows.html());
        // console.log(" ");
        for(let j=0;j<allRows.length;j++){
            let isBat= $(allRows[j]).hasClass("ds-border-b ds-border-line ds-text-tight-s");
            // console.log(isBat);
            let allCols;
            if(isBat===true){
                allCols= $(allRows[j]).find("td");
                if(allCols.length<6) isBat=false;
            }

            if(isBat===true){
                let playerName=$(allCols[0]).text().trim();
                let runs= $(allCols[2]).text();
                let balls= $(allCols[3]).text();
                let fours= $(allCols[5]).text();
                let sixes= $(allCols[6]).text();
                let sr= $(allCols[7]).text();

                console.log( playerName +" "+runs +" "+balls +" "+fours +" "+sixes +" "+sr);
            }
        }
            

    }
    console.log(inHtML);
       

}

module.exports={
    ps:process
}