let chat = document.getElementsByClassName('tw-flex-grow-1 tw-full-height tw-pd-b-1')[0];
let config = { childList: true };
let callback = function(list, observer) {
    for (i of list) {
        console.log(i);
    }
};
let observer = new MutationObserver(callback);
observer.observe(chat, config);

console.log("hello");
console.log(chat);