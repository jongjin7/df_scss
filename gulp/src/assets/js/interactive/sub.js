/* sub */
/* sub */
/* sub */
/* sub */
/* sub */
console.log('subPage js!!!!!!')
// ES6
const prefix = 'prop';
let i = 0;

const obj = {
    [`${prefix}-${++i}`]: i,
    [`${prefix}-${++i}`]: i,
    [`${prefix}-${++i}`]: i
};

console.log(obj);


const newObject = {
    name: 'Lee',
    // 메소드 축약 표현
    sayHi() {
        console.log('Hi! ' + this.name);
    }
};

newObject.sayHi(); // Hi! Lee