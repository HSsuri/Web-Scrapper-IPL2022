//require/import the modules req
const request= require("request");
const cheerio = require("cheerio");
const fs= require("fs");
const path= require("path");
const xlsx=require("xlsx");

function process(url){
    
    request(url,cb);//url called
}

//callback function for url
function cb(err,response,html){
    if(err) {
        if(err.message.code='ETIMEDOUT')  ;
        else console.log(err);
    }
    else extractMatchDetails(html);
    

}
var count=0;

//function to get data from parsed html
function extractMatchDetails(html){
    let $= cheerio.load(html);
     let desc= $(".ds-text-tight-m.ds-font-regular.ds-text-ui-typo-mid");
    let res= $(".ds-text-tight-m.ds-font-regular.ds-truncate.ds-text-typo-title span");
    let stringArr= desc.text().split(','); 
    let match= stringArr[0].split('(N)');
    let matchNo= match[0].trim(); // MAtch Number
    let venue= stringArr[1].trim(); // venue
    let date = stringArr[2].trim() + " 2022"; // date
    let result=res.text();  //result
    // count++;
    // console.log(count);
    // console.log(matchNo);
    let innings= $(".ds-bg-fill-content-prime.ds-rounded-lg"); // gets the data of both innings
    
    for (let index = 0; index < innings.length; index++) {
        let teamName= $(innings[index]).find(".ds-text-tight-s.ds-font-bold.ds-uppercase").text();
        teamName= teamName.split('INNINGS')[0].trim();//team Name
        let opIndex= index==0?1:0;//since only 2 innings
        let oppName=$(innings[opIndex]).find(".ds-text-tight-s.ds-font-bold.ds-uppercase").text();
        oppName= oppName.split('INNINGS')[0].trim();//opponent NAme

        console.log(matchNo+", "+date+", "+venue+" || "+teamName+" || "+oppName+" || "+result)

        let batsmantable= $(innings[index]).find("table")[0];
        let allRows= $(batsmantable).find("tbody tr"); 
        
        for(let j=0;j<allRows.length;j++){
            let isBat= $(allRows[j]).hasClass("ds-border-b ds-border-line ds-text-tight-s");// for removing non-re trs
            
            let allCols;
            if(isBat===true){
                allCols= $(allRows[j]).find("td");
                if(allCols.length<6) isBat=false;// removing "extras" tr
            }

            if(isBat===true){
                let playerName=$(allCols[0]).text().trim();//player name
                let runs= $(allCols[2]).text();// Runs
                let balls= $(allCols[3]).text();//Balls
                let fours= $(allCols[5]).text();//Fours
                let sixes= $(allCols[6]).text();//Sixes
                let sr= $(allCols[7]).text();//Strike Rate

                console.log( playerName +" "+runs +" "+balls +" "+fours +" "+sixes +" "+sr);
                processPlayer(teamName,playerName,runs,balls,fours,sixes,sr,oppName,venue,result,date,matchNo);

            }
        }
            

    }
    console.log("......................................................................................................................");
    
       

}

function processPlayer(teamName,playerName,runs,balls,fours,sixes,sr,oppName,venue,result,date,matchNo){
    let teamPath= path.join(__dirname,"IPL",teamName); //Dir of team
    dirCreator(teamPath);//Dir made if not already
    let filePath = path.join(teamPath,playerName+".xlsx");
    let content=execlReader(filePath,playerName);//json content from file reader
    let playerObj={
       "Team Name": teamName,
       "Player Name":playerName,
        "Runs":runs,
        "Balls":balls,
        "Fours":fours,
        "Sixes":sixes,
        "SR":sr,
        "Opponent Name":oppName,
        "Match No.":matchNo,
        "Venue":venue,
        "Date":date,
        "Winner":result
    } //player obj for json
    content.push(playerObj);//object pushed
    execlWriter(filePath,content,playerName);//object updated in file
}

//functioj to create dir if it doesn,t exusts
function dirCreator(filePath){
    if(fs.existsSync(filePath)==false){
        fs.mkdirSync(filePath)
    }

}

//function to read excel file
function execlReader(filePath,sheetName){
    if(fs.existsSync(filePath)==false){
        return [];// if not exists then empty json
    }

    let wb= xlsx.readFile(filePath);//get workbook
    let excelData=wb.Sheets[sheetName];//get sheet
    let ans= xlsx.utils.sheet_to_json(excelData);//get data in json
    return ans;//json returned
}

//function to write/append excel file
function execlWriter(filePath,json,sheetName){
    let newWb=xlsx.utils.book_new();//new workbook
    let newWs=xlsx.utils.json_to_sheet(json);//new worksheet
    xlsx.utils.book_append_sheet(newWb,newWs,sheetName);//appends worksheet to workbook
    xlsx.writeFile(newWb,filePath);//file updated

}

//made a module
module.exports={
    ps:process
}