
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
    chrome.runtime.sendMessage({"message":"reload"});
}

chrome.commands.onCommand.addListener(function(command) { 
    if (command == "toggle") 
    {
        
        chrome.tabs.executeScript({
            file: "shortcut.js"
          });
          chrome.runtime.sendMessage({"message":"shortcut"})
    }	

    });

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.clear == "clearAll"){
            notesArr=[];
            chrome.storage.sync.set({"list":notesArr})
            let latestNote={"note":"🖋Nothing to Show!!"}
            chrome.storage.sync.set({"latestNote":latestNote})
      }
      else if(request.message=="Add"){
            notesArr.push(request.data)
            chrome.storage.sync.set({"list":notesArr})
            chrome.storage.sync.set({"latestNote" : request.data})
            chrome.runtime.sendMessage({"message":"reload"});

      }
      else if(request.message=="deleteNote"){
            let index=notesArr.indexOf(request.deleteThis);
            let latestNote
            chrome.storage.sync.get("latestNote",function(data){
                latestNote=data.latestNote.note;

            
                if(request.deleteThis==latestNote){
                    notesArr.splice(index, 1);
                    if(notesArr.length==0)
                        chrome.storage.sync.set({"latestNote":{"note" : "🖋Nothing to Show!!"}})
                    else
                        chrome.storage.sync.set({"latestNote": notesArr[notesArr.length-1]})
                }
                else
                    notesArr.splice(index, 1);

            });
            chrome.storage.sync.set({"list":notesArr})
      }
      
        
    });
