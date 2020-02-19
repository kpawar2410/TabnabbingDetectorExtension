
document.getElementById("res_img").src=chrome.extension.getBackgroundPage().img; //print the img
document.getElementById("per").innerHTML="difference:"+chrome.extension.getBackgroundPage().percent+"%"; //print the percent of difference