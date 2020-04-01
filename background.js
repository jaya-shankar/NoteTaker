let notesArr=[];
let notesSources=[]
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
    notesArr.push(noteX)
    chrome.storage.sync.set({"list" : notesArr})
    chrome.storage.sync.set({"latestNote" : noteX})
    
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
      else if(request.message=="exportToTxt"){
            let allnotes=""
            chrome.storage.sync.get("list",function(data){
                for(i=0;i<data.list.length;i++){
                    allnotes=data.list[i]+"\n"+allnotes;
                }
                var text = 'Some data I want to export';
                var data = new Blob([text], {type: 'text/plain'});

                var url = window.URL.createObjectURL(data);

                sendResponse({"Url":url})
                 
            });
      }
        
    });
