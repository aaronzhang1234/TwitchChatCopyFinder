const nms = String.fromCharCode(8203); //&NegativeMediumSpace;
const zwnj = String.fromCharCode(8204); //&zwnj;
const zwj = String.fromCharCode(8205); //&zwj;
const whitespace_chars = [nms, zwnj, zwj];

let bkg = chrome.extension.getBackgroundPage();


let get_pasta    = document.getElementById('get_pasta');
let new_sig      = document.getElementById('new_sig');
let pastaland    = document.getElementById('pastaland');
let pastawithsig = document.getElementById('pastawithsig');
let reset_sig    = document.getElementById('reset_sig');

document.getElementById('button_holder').onclick = change_sig;

chrome.extension.onMessage.addListener(
    function(request, sender, sendResponse){
        if(request.message == "new pasta"){
            bkg.console.log("recieved");
            sendResponse({recieved:"ok"});
        }
});
document.addEventListener("DOMContentLoaded", function(event) {
    chrome.storage.local.get(['signature'], function(result){
        if(chrome.runtime.lastError){
            firstFunction();
        }
    })
    updateSignatureButtons();
    injectScript();
});
function updateSignatureButtons(){
    chrome.storage.local.get(['signature'], function(result){
        let signature = result.signature;
        for(let i = 1; i<signature.length-1; i++){
            let button_signifier = document.getElementById("sig_"+i);
            let wsChar = getHiddenCharName(signature[i])
            button_signifier.alt = wsChar;
            button_signifier.src = getImage(wsChar);
        }
    })
}
function change_sig(e){
    if(e.target.tagName=="INPUT"){
        let child_index = Array.from(e.target.parentNode.children).indexOf(e.target)
        let wsCode = getHiddenChar(e.target.getAttribute("alt"));
        let wsIndex = whitespace_chars.findIndex(ws=>ws===wsCode);
        let next_index = (wsIndex+1)%3;
        let next_code = whitespace_chars[next_index];
        let next_code_name = getHiddenCharName(next_code);
        e.target.src = getImage(next_code_name);
        e.target.alt = next_code_name;
        chrome.storage.local.get(['signature'], function(result){
            let old_sig = result.signature;
            let new_sig = replaceAt(old_sig, child_index+1, next_code);
            setSignatureJS(new_sig);
            updateSignatureJS();
        })

    }
}
function replaceAt(string, index, replace) {
  return string.substring(0, index) + replace + string.substring(index + 1);
}
reset_sig.onclick = function(){
    let signature = nms.repeat(18); 
    setSignatureJS(signature);
    updateSignatureJS();
    updateSignatureButtons();
}
new_sig.onclick = function() {
    let signature = generateSignature();
    setSignatureJS(signature); 
    updateSignatureJS();
    updateSignatureButtons();
};
get_pasta.onclick = function(){
    chrome.storage.local.get(['signature'], function(result){
        let pasta = pastaland.value;
        let randomed_pasta = '';
        if(pasta.includes(" ")){
            spaceLocs = [];
            //Getting all locations of spaces in the pasta
            for(let i = 0; i< pasta.length; i++){
                if(pasta[i] === ' '){
                    spaceLocs.push(i);
                }
            }
            let random_num = Math.floor(spaceLocs.length * Math.random());            
            let random_space_location = spaceLocs[random_num];
            randomed_pasta = pasta.slice(0, random_space_location) + ' ' + result.signature + pasta.slice(random_space_location);             
        }else{
            let random_pos_not_floored = (pasta.length -2) * Math.random();
            let random_pos = Math.floor(random_pos_not_floored) + 1;
            randomed_pasta = pasta.slice(0, random_pos) + result.signature + pasta.slice(random_pos); 
        }
        pastawithsig.value = randomed_pasta;
        pastawithsig.select();
        document.execCommand("copy");
    })
}
function getHiddenChar(hidden_char_name){
   if(hidden_char_name === "nms"){
        return nms;
   }else if(hidden_char_name === "zwnj"){
        return zwnj;
   }else if(hidden_char_name === "zwj"){
        return zwj;
   }

}
function getImage(hidden_char_name){
   if(hidden_char_name === 'nms'){
        return "kappa.png";
   }else if(hidden_char_name === 'zwnj'){
        return "lul.png";
   }else if(hidden_char_name === 'zwj'){
        return "pog.png";
   }
}
function getHiddenCharName(hidden_char){
   if(hidden_char === nms){
        return "nms";
   }else if(hidden_char === zwnj){
        return "zwnj";
   }else if(hidden_char === zwj){
        return "zwj";
   }
}
//return a random 16 character signature
function generateSignature() {
    let sig = "";

    for (let i = 0; i < 16; i++) {
        let c = Math.floor(Math.random() * 3);
        sig += whitespace_chars[c];
    }
    return nms + sig + nms;
}

function setSignatureJS(signature){
    chrome.storage.local.set({signature:signature}, function(){
    });
}
function updateSignatureJS(){
    chrome.storage.local.get(['signature'], function(result){
        var signature = {sig:result.signature};
        chrome.tabs.executeScript({
            code: 'var signature = ' + JSON.stringify(signature.sig)
        });
    })
}
function firstFunction(){
    let signature = nms.repeat(18); 
    setSignatureJS(signature);
    updateSignatureButtons();
    start_pasta.style.display="none";
    injectScript();
}
function injectScript(){
    chrome.storage.local.get(['signature'], function(result){
        var signature = {sig:result.signature};
        chrome.tabs.executeScript({
        code: 'var signature = ' + JSON.stringify(signature.sig)
        },function(){
            chrome.tabs.executeScript({file:'pasta-finder.js'});
        });
    })
}
