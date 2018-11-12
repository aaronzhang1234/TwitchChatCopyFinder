console.log('startu');

let historical_loc = window.location.href;

setInterval(compare_locs, 5000);
function compare_locs(){ 
    console.log(historical_loc);
    current_loc = window.location.href;
    if(historical_loc != current_loc){
        chat = document.getElementsByClassName('tw-flex-grow-1 tw-full-height tw-pd-b-1')[0];
        historical_loc = current_loc;
        observer.observe(chat, config);
    }
}

let chat = document.getElementsByClassName('tw-flex-grow-1 tw-full-height tw-pd-b-1')[0];
let config = { childList: true };

let callback = function(list) {
    const nms = String.fromCharCode(8203); //&NegativeMediumSpace;
    for (i of list) {
        if(i.addedNodes[0]){
            let new_div = i.addedNodes[0];
            message = parseMessage(new_div);
            let findex = message.indexOf(nms);
            if(findex >= 0){
                let sig = message.substring(findex,findex+18); 
                if(sig == signature){
                    let image = document.createElement("img"); 
                    image.src = "https://i.imgur.com/3xIwpKb.jpg";
                    new_div.appendChild(image);
                    new_div.style.background = "blue"; 
                }
            }
        }
    }
};
function parseMessage(msg_div){
    let message = ""
    let chat_divs = msg_div.children; 
    for(let i = 3; i< chat_divs.length; i++){
        let current_chat_item = chat_divs.item(i);
        let data_a = current_chat_item.getAttribute("data-a-target");
        if(data_a === 'chat-message-text'){
            let has_children = current_chat_item.firstElementChild;
            if(has_children){
                let bttv_node = current_chat_item.childNodes.item(0);
                let text = bttv_node.innerText;
                message += text + ' ';
            }else{
                msg_text = current_chat_item.innerHTML;
                message += msg_text + " ";
            }
        }
    }    
    return message;
}
let observer = new MutationObserver(callback);
observer.observe(chat, config);
