let chat = document.getElementsByClassName('tw-flex-grow-1 tw-full-height tw-pd-b-1')[0];
let config = { childList: true };
let callback = function(list) {
    for (i of list) {
        let message = i.addedNodes[0].lastChild.innerText;
        console.log(message.length);
        console.log(decodeURI(message));
    }
};
let observer = new MutationObserver(callback);
observer.observe(chat, config);

console.log("hello");
console.log(chat);