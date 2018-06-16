chrome.runtime.setUninstallURL("https://1ce.org");

if (!localStorage.created) {
  chrome.tabs.create({ url: "https://1ce.org" });
  var manifest = chrome.runtime.getManifest();
  localStorage.ver = manifest.version;
  localStorage.created = 1;
}
function getStat(){
  return Number(localStorage.getItem('pauseHistory'));
}
function toggle(){
  localStorage.setItem('pauseHistory', Number(!getStat()));
  if(getStat()){
    chrome.browserAction.setIcon({path:  chrome.runtime.getURL('images/browseraction_off.png')});
    chrome.browserAction.setTitle({title:chrome.i18n.getMessage("browser_action_off")});
    if(!localStorage.getItem('firstTime')){
      chrome.tabs.query( { active: true, currentWindow: true }, function(tabs){
        //console.log(tabs[0]);
        if(tabs &&tabs[0]){
          chrome.tabs.executeScript(tabs[0].id,{file :'js/alert.js'})
          localStorage.setItem('firstTime',1);
        }
      });
    }
    setTimeout(injectJsCurrentTab, 3000);
  }
  else{
 chrome.browserAction.setIcon({path:  chrome.runtime.getURL('images/browseraction.png')});
    chrome.browserAction.setTitle({title:chrome.i18n.getMessage("browser_action")});
  }
}

chrome.browserAction.onClicked.addListener(function(tab){
  toggle();
});

chrome.history.onVisited.addListener(function(historyItem){
  if(getStat() && historyItem.url){
    //delete item
    setTimeout(function(){
      console.log('delete!!!!', historyItem);
      chrome.history.deleteUrl({url: historyItem.url});
    },300);
  }
});