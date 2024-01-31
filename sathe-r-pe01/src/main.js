//Reva Sathe - 1/21/23
import {randIndex} from "./Utils.js"
	
    
const generatePhrase = (moreLines) =>{
    if(moreLines){
        let str = randIndex(words1) + " " + randIndex(words2) + " " + randIndex(words3) + "!";
        let str2 = randIndex(words1) + " " + randIndex(words2) + " " + randIndex(words3) + "!";
        let str3 = randIndex(words1) + " " + randIndex(words2) + " " + randIndex(words3) + "!";
        let str4 = randIndex(words1) + " " + randIndex(words2) + " " + randIndex(words3) + "!";
        let str5 = randIndex(words1) + " " + randIndex(words2) + " " + randIndex(words3) + "!";
        document.querySelector("#output").innerHTML = `${str} <br> 
                                                        ${str2} <br> 
                                                        ${str3} <br> 
                                                        ${str4} <br>
                                                        ${str5}`;
    }
    else{
        let str = randIndex(words1) + " " + randIndex(words2) + " " + randIndex(words3) + "!";
        document.querySelector("#output").innerHTML = str;
    }
};

//initial call to generate phrase upon the page being loaded
generatePhrase();

//event handler that upon the button being clicked calls the generatePhrase() method updating the text
document.querySelector("#btn-1").onclick = () => generatePhrase(false);
document.querySelector("#btn-2").onclick = () => generatePhrase(true);


    
//function that strings together a phrase of randomly selected words from the arrays above
