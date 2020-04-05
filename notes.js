
window.onload=function(){
    chrome.storage.sync.get("list",function(data){
        let div=document.querySelector("#notes")
        for(let i=0;i<data.list.length;i++){
            let noteObj=document.createElement("div");
            let button=setupButton()
            let p=document.createElement("p");
            p.innerHTML=data.list[i].note;
            noteObj.style.display="flex"
            noteObj.id="note"
            noteObj.appendChild(button);
            noteObj.appendChild(p);
            if(data.list[i].source!="#"){
                let a=document.createElement("a")
                a.innerHTML="view Source";
                a.href=data.list[i].source;
                noteObj.appendChild(a);
            }
            div.prepend(noteObj)

        }
    });
    this.document.querySelector("#addPoint").addEventListener("click",function(){
        let noteX=document.querySelector("#addNote");
        let note={"note" : noteX.value, "source":"#"}
        chrome.runtime.sendMessage({data: note,message:"Add"});
        let div=document.querySelector("#notes")
        let noteObj=document.createElement("div");
        let button=setupButton()
        let p=document.createElement("p");
        p.innerHTML=noteX.value;
        noteObj.style.display="flex"
        noteObj.id="note"
        noteObj.appendChild(button);
        noteObj.appendChild(p);
        div.prepend(noteObj)
        noteX.value=""
    });

    this.document.querySelector("#copyNotes").addEventListener("click",function(){

        let allnotes=""
        chrome.storage.sync.get("list",function(data){
            for(i=0;i<data.list.length;i++){
                allnotes=data.list[i].note+"\n"+allnotes;
            }
            let input=document.createElement("textarea");
            let body=document.querySelector("body")
            input.setAttribute("value",allnotes)
            input.innerHTML=allnotes
            body.appendChild(input)
            input.select();
            
            document.execCommand("copy");
            body.removeChild(input)
        
        })
    });
    this.document.getElementById("closeWindow").addEventListener("click",function(){
        chrome.tabs.getSelected(null, function(tab){
            alert(tab.id)
            alert(typeof(tab.id))
            //chrome.tab.remove(tab.id)
            
        });
    })

    document.getElementById("clearNotes").addEventListener("click",function(){
        let k=confirm("are you sure?")
        if(k)
            chrome.runtime.sendMessage({clear: "clearAll"});
        location.reload()
    });

    function setupButton()
    {
        let img=document.createElement("img")
        let button=document.createElement("button")
        img.src="images/delete.png"
        img.className="delete-icon"
        button.className="delete-button"
        button.appendChild(img);
        button.addEventListener("click",function(data){
            let parent=button.parentNode;
            let div=document.querySelector("#notes")
            div.removeChild(parent)
            chrome.runtime.sendMessage({"deleteThis":button.nextElementSibling.innerHTML ,"message":"deleteNote"})
        });
        return button;
    }

    chrome.runtime.onMessage.addListener(function(request){
        if(request.message=="reload")
        {
            location.reload()
        }
    })

};