//require/import the modules req
const request= require("request");
const cheerio = require("cheerio");
const allMatch= require("./allMatch");//within file
const fs= require("fs");
const path= require("path");
//site url
const url="https://www.espncricinfo.com/series/indian-premier-league-2022-1298423";
request(url,cb);//url called

//callback function for url
function cb(err,response,html){
    if(err) console.log(err);
    else extractLink(html);
    

}

//function to parse html
function extractLink(html){
    let $= cheerio.load(html);
    // console.log(html);
    let element= $("a[class='ds-block ds-text-center ds-uppercase ds-text-ui-typo-primary ds-underline-offset-4 hover:ds-underline hover:ds-decoration-ui-stroke-primary ds-block']");
    // console.log(element);
    let link= element.attr("href");
    let fulllink = "https://www.espncricinfo.com"+link;
    console.log(fulllink);
    allMatch.getMatch(fulllink);//from allMatch.js

}
//to create a Dir for data
const iplPath= path.join(__dirname,"IPL");
dirCreator(iplPath);

function dirCreator(filePath){
    if(fs.existsSync(filePath)==false){
        fs.mkdirSync(filePath)
    }

}



