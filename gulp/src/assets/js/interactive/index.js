'use strict';

import { pi, square, Person } from './module2';

console.log(pi);
console.log(square(10));
console.log(new Person('lim jongjin'));

/* car module */
import { Cart, nameSpace } from './cart'
let miniCart = new Cart();
console.log('miniCart.getItem', miniCart.getItems())
console.log('cart::: nameSpace', nameSpace)
const tmp = $('<span />').text('추가되는 숫자' + '::::'+ miniCart.firstName)
$('h1').append(tmp);


const myVar ='1111111 새롭게 정의'

//es6 기능 : 블록 스코프 변수 선언
const sentences = [
    { subject: 'JavaScript', verb: 'is', object: 'great11111' },
    { subject: '1ilsang.', verb: 'blog.', object: 'me' }
];
//ES6 기능 : 객체 분해
function say({ subject, verb, object }) {
    //es6 : 템플릿 문자열
    //아래 사용한 것은 따옴표가 아니라 백틱(`)
    console.log('say:::=>', `${subject} ${verb} ${object}`);
}
//es6 : for..of
for (let s of sentences) {
    say(s);
}

// Class
class Box {
    constructor() {
        this.boxin = [111111];
        this.member = [{
            id: 1,
            name: 'Dove Soap',
            price: 39.99
        }, {
            id: 2,
            name: 'Axe Deo',
            price: 99.99
        }];
    }
}
