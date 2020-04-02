window.onload=function(){
    chrome.storage.sync.get("latestNote",function(data){
        let div=document.querySelector("#latestNote");
        let p =document.createElement("p")
        p.innerHTML=data.latestNote.note;
        div.appendChild(p)
    })


    document.getElementById("openNotes").addEventListener("click",function(){
        window.open("notes.html","_blank",height=200,width=150 ,"_blank")
    });

    document.getElementById("clearNotes").addEventListener("click",function(){
        let k=confirm("are you sure?")
        if(k)
            chrome.runtime.sendMessage({clear: "clearAll"});
    });

};