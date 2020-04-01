
window.onload=function(){
    chrome.storage.sync.get("list",function(data){
        let div=document.querySelector("#notes")
        for(let i=0;i<data.list.length;i++){
            let noteObj=document.createElement("div");
            let button=setupButton()
            let p=document.createElement("p");
            p.innerHTML=data.list[i];
            noteObj.style.display="flex"
            noteObj.appendChild(button);
            noteObj.appendChild(p);
            div.prepend(noteObj)

        }
    });
    this.document.querySelector("#addPoint").addEventListener("click",function(){
        let note=document.querySelector("#note");
        chrome.runtime.sendMessage({data: note.value,message:"Add"});
        let div=document.querySelector("#notes")
        let noteObj=document.createElement("div");
        let button=setupButton()
        let p=document.createElement("p");
        p.innerHTML=note.value;
        noteObj.style.display="flex"
        noteObj.appendChild(button);
        noteObj.appendChild(p);
        div.prepend(noteObj)
    });

    this.document.querySelector("#exportToTxt").addEventListener("click",function(){
        chrome.runtime.sendMessage({"message":"exportToTxt"})
    })

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
            chrome.runtime.sendMessage({"deleteThis":button.nextElementSibling.innerHTML ,"message":"deleteNote"},function(response){
                document.getElementById("download_link").href =response.Url
            })

        })
        return button;
    }
};