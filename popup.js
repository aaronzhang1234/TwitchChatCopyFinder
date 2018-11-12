const nms = String.fromCharCode(8203); //&NegativeMediumSpace;
const zwnj = String.fromCharCode(8204); //&zwnj;
const zwj = String.fromCharCode(8205); //&zwj;
const whitespace_chars = [nms, zwnj, zwj];
let start_pasta = document.getElementById('start_pasta');
let get_pasta   = document.getElementById('get_pasta');
let new_sig     = document.getElementById('new_sig');
let bkg = chrome.extension.getBackgroundPage();
let pastaland = document.getElementById('pastaland');
let pastawithsig = document.getElementById('pastawithsig');
document.getElementById('button_holder').onclick = change_sig;

document.addEventListener("DOMContentLoaded", function(event) {
    updateSignatureButtons();
});
function updateSignatureButtons(){
    chrome.storage.local.get(['signature'], function(result){
        let signature = result.signature;
        printSig(signature);
        for(let i = 1; i<signature.length-1; i++){
            let button_signifier = document.getElementById("sig_"+i);
            button_signifier.innerHTML = getHiddenCharName(signature[i]);
        }
    })
}
start_pasta.onclick= function(){
    let signature = nms.repeat(18); 
    setSignatureJS(signature);
    updateSignatureButtons();
    start_pasta.style.display="none";
    chrome.storage.local.get(['signature'], function(result){
        var signature = {sig:result.signature};
        chrome.tabs.executeScript({
        code: 'var signature = ' + JSON.stringify(signature.sig)
        },function(){
            chrome.tabs.executeScript({file:'pasta-finder.js'});
        });
    })
}
function change_sig(e){
    if(e.target.tagName=="BUTTON"){
        let child_index = Array.from(e.target.parentNode.children).indexOf(e.target)
        let wsCode = getHiddenChar(e.target.innerHTML);
        let wsIndex = whitespace_chars.findIndex(ws=>ws===wsCode);
        let next_index = (wsIndex+1)%3;
        let next_code = whitespace_chars[next_index];
        let next_code_name = getHiddenCharName(next_code);
        e.target.innerHTML = next_code_name;
        chrome.storage.local.get(['signature'], function(result){
            let old_sig = result.signature;
            let new_sig = replaceAt(old_sig, child_index+1, next_code);
            printSig(new_sig);
            setSignatureJS(new_sig);
            updateSignatureJS();
        })

    }
}
function replaceAt(string, index, replace) {
  return string.substring(0, index) + replace + string.substring(index + 1);
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
        let random_pos_not_floored = (pasta.length -2) * Math.random();
        let random_pos = Math.floor(random_pos_not_floored) + 1;
        let randomed_pasta = pasta.slice(0, random_pos) + result.signature + pasta.slice(random_pos); 
        pastawithsig.innerHTML = randomed_pasta;
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
function getHiddenCharName(hidden_char){
   if(hidden_char === nms){
        return "nms";
   }else if(hidden_char === zwnj){
        return "zwnj";
   }else if(hidden_char === zwj){
        return "zwj";
   }
}
function printSig(signature){
    let sig ="";
    for(let i = 0; i<signature.length; i++){
        sig+=getHiddenCharName(signature[i]) + " ";
    }
    bkg.console.log(sig);
}
//return a random 16 character signature
function generateSignature() {
    let sig = "";

    for (let i = 0; i < 16; i++) {
        let c = Math.floor(Math.random() * 3);
        sig += whitespace_chars[c];
    }
    printSig(sig);
    return nms + sig + nms;
}

function setSignatureJS(signature){
    chrome.storage.local.set({signature:signature}, function(){
        bkg.console.log(signature);
        bkg.console.log("signature set");
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
