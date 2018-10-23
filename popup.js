let get_pasta = document.getElementById('get_pasta');
let bkg = chrome.extension.getBackgroundPage();
let pastaland = document.getElementById('pastaland');
console.log("poop");
get_pasta.onclick = function(){
    bkg.console.log("hello");
    bkg.console.log(pastaland.value);
};
