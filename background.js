
let notesArr=[];
chrome.runtime.onInstalled.addListener(function() {
    chrome.contextMenus.create({title:"Add to Notes", 
    contexts:["selection"],
    onclick: addNote
    });
});

chrome.runtime.onInstalled.addListener(function() {
    chrome.contextMenus.create({title:"Undo the Last point", 
    contexts:["page"],
    onclick: undoLast
    });
});

function addNote(SelectedText)
{
    let noteX=SelectedText.selectionText;
    let url=SelectedText.pageUrl;
    let note={"note":noteX,"source":url}
    notesArr.push(note)

    chrome.storage.sync.set({"list" : notesArr})
    chrome.storage.sync.set({"latestNote" : note})
    chrome.runtime.sendMessage({"message":"reload"});
    
}

function undoLast()
{
    notesArr.pop()
    chrome.storage.sync.set({"latestNote": notesArr[notesArr.length-1]})
    chrome.storage.sync.set({"list" : notesArr})
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.clear == "clearAll"){
            notesArr=[];
            chrome.storage.sync.set({"list":notesArr})
            chrome.storage.sync.set({"latestNote":"🖋Nothing to Show!!"})
      }
      else if(request.message=="Add"){
            notesArr.push(request.data)
            chrome.storage.sync.set({"list":notesArr})
      }
      else if(request.message=="deleteNote"){
            let index=notesArr.indexOf(request.deleteThis);
            notesArr.splice(index, 1);
            chrome.storage.sync.set({"list":notesArr})
      }
        
    });
