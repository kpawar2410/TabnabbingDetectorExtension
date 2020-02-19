
//stop the thread
function stop_thread(){
    clearInterval(thread);
    thread=null;
}

//remove the thread
function remove(tabId) {
    delete dict[tabId];
}

//mark the differences on the page
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        //request.greeting=="hello",request.data=dataUrl
        if (request.greeting == "hello"){
            var result = document.createElement('div');
            result.id="result";
            result.style.width = "100%";
            result.style.height = "100%";
            result.style.top = "0px";
            result.style.left = "0px";
            result.style.backgroundImage = "url(" + request.data + ")";
            result.style.backgroundSize = "100% 100%"
            result.style.position = "fixed";
            result.addEventListener("click", function(){
                var temp = document.getElementById('result')
                    temp.parentNode.removeChild(temp);
             });
            document.body.appendChild(result);
            console.log(request.data);
            sendResponse({confirmation: "Successfully created div"});
        }
    });

//take the screenshot
function getScreenshot(tab){
    thread = setInterval(function(){
        chrome.tabs.captureVisibleTab({format : "png"}, function(dataUrl){
            if(chrome.runtime.lastError) return;
            if(dict[tab.id]==undefined){
                dict[tab.id]=dataUrl;
            }
            else{
                if(flag==true){
                compare(dataUrl,tab.id);
                flag=false;
                } 
                dict[tab.id]=dataUrl;
            }
        })        
    },500);
}

//compare the difference
function compare(dataUrl, id){      resemble(dataUrl).compareTo(dict[id]).onComplete(function(data){
        percent=data.misMatchPercentage;
        img = data.getImageDataUrl();
        var icon;
        if(percent > Threshold){ //Threshold=0.30
              chrome.tabs.query({
                active: true,
                currentWindow: true
            }, function(tabs) {
                 chrome.tabs.sendMessage(id,
                  { greeting: "hello",data: img }, function(response) {
                     console.log('100');
            icon={tabId:id, path:"image/red-hazard.png"};
            chrome.pageAction.setIcon(icon);
               });
            });
        }
        else{
            icon={tabId:id, path:"image/green-okay.png"};
             chrome.pageAction.setIcon(icon);
        }  
        chrome.pageAction.show(id);        
    })
}
