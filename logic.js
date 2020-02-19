var dict={}; // map tabs
var Threshold=0.30; //threshold value to compare
var flag=true; //to compare if changed
var thread=null; //
var img=null;
var percent = 0.0;

//events for activated tabs
chrome.tabs.onActivated.addListener(function (activeInfo) {
    stop_thread(); //clear the thread
    chrome.tabs.get(activeInfo.tabId, function callback(tab){
        flag =true;
        var url = new URL(tab.url);
        try{
        getScreenshot(tab); //make a new thread
        }catch(err){
            console.log("err");
        }
    })
});

//events for removed tabs
chrome.tabs.onRemoved.addListener(function(tabId, removeInfo){
    if(removeInfo.isWindowClosing){
        stop_thread();
    }
    remove(tabId); // clear dict
}); 
                                   
//events for updated tabs
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
    if(tab.active && changeInfo.status=="complete"){
    stop_thread();
    chrome.tabs.get(tabId, function callback(tab){
        flag = false; //updated tabs do not need compare
        var url = new URL(tab.url);
        if(dict[tab.id] != undefined){
				remove(tab.id);
			}
        try{
        getScreenshot(tab);    
        }catch(err){
            console.log("err");
        }
    });
    }
});
                       
        


                                     