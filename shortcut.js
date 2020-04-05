
let sel=document.getSelection();
let text=sel.toString();
let url=document.URL
console.log(sel)
console.log(document.URL)
if(text!="")
    chrome.runtime.sendMessage({"message":"Add", "data":{"note":text, "source":url}})