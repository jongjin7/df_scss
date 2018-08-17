import printMe from './print.js';

const inputText = document.querySelector('.input-txt');
inputText.value='8888811111xxxxx1111xxxxxx';

function component() {
    var element = document.querySelector('#root');
    var btn = document.createElement('button');

    btn.style="padding:20px;border:1px dotted green; margin:10px; background;silver;";


    element.innerHTML = 'Hello webpack';
    element.style="font-size:24px; line-height:30px; color:hotpink;"

    element.className ="txt-holder";
    var copyTxt ='Click me and check the console~~~~~~';
    btn.innerHTML = copyTxt;
    btn.title = copyTxt;
    btn.onclick = printMe;

    element.appendChild(btn);
}

component();

if(module.hot){
    module.hot.accept();

}

// if(module.hot){
//     module.hot.accept('./print.js', function(err) {
//         if( err ){
//           console.error( err );
//         }
//
//         console.log('Accepting the updated printMe module!');
//         printMe();
//
//         document.body.removeChild(element);
//
//         element = component(); // Re-render the "component" to update the click handler
//         document.body.appendChild(element);
//     })
// }

