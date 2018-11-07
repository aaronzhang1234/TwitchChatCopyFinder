const nms = String.fromCharCode(8203); //&NegativeMediumSpace;
const zwnj = String.fromCharCode(8204); //&zwnj;
const zwj = String.fromCharCode(8205); //&zwj;

let start_pasta = document.getElementById('start_pasta');
let get_pasta   = document.getElementById('get_pasta');
let new_sig     = document.getElementById('new_sig');
let bkg = chrome.extension.getBackgroundPage();
let pastaland = document.getElementById('pastaland');
let pastawithsig = document.getElementById('pastawithsig');

start_pasta.onclick= function(){
    chrome.tabs.executeScript({
        code: 'var signature = null'
    },function(){
        chrome.tabs.executeScript({file:'pasta-finder.js'});
    });
}
new_sig.onclick = function() {
    let signature = generateSignature();
    
    chrome.storage.local.set({signature:signature}, function(){
        console.log(signature);
    });

    chrome.storage.local.get(['signature'], function(result){
        var signature = {sig:result.signature};
        chrome.tabs.executeScript({
            code: 'var signature = ' + JSON.stringify(signature.sig)
        });
    })
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

//return a random 16 character signature
function generateSignature() {
    let sig = "";
    for (let i = 0; i < 16; i++) {
        let c = Math.floor(Math.random() * 3)
        switch (c) {
            case 0: sig += nms; break;
            case 1: sig += zwnj; break;
            case 2: sig += zwj; break;
        }
    }
    return nms + sig + nms;
}

