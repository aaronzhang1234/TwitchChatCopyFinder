const nms = String.fromCharCode(8203); //&NegativeMediumSpace;
const zwnj = String.fromCharCode(8204); //&zwnj;
const zwj = String.fromCharCode(8205); //&zwj;

let get_pasta = document.getElementById('get_pasta');
let bkg = chrome.extension.getBackgroundPage();
let pastaland = document.getElementById('pastaland');

get_pasta.onclick = function() {
    bkg.console.log("hello");
    let pasta = pastaland.value;
    for (let i = 0; i < 32; i++) {
        let sig = generateSignature();
        bkg.console.log(sig + pasta);
    }
};

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
    return zwj + sig + zwj;
}
