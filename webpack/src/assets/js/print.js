console.log('print.js');

export default function printMe() {
    console.log('Updating print.js:lim');
    let inp = document.querySelector('.input-txt');
    let txt = document.querySelector('.txt-holder');
    inp.value = Math.random()*1000;
}