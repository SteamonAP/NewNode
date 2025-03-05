const prompt = require('prompt-sync')();
// const fetchD = callback => {
//     setTimeout(()=>{
//         callback("Data done!");
//     },2000);
// };

// setTimeout(()=>{
//     console.log("Time's up");
//     fetchD(text => {
//         console.log(text);
//     });
// },2000);

console.log("Hello"); // Corrected the typo in "Hello"
console.log("Hi there");


const fetchD = (n) => {
    return new Promise((resolve, reject) => { // Return the promise directly
        setTimeout(() => {
            if(n==2){
                resolve("Done!!");
            }else{
                reject("Nope bro");
            }
            
        }, 2000);
    });
};

const n = parseInt(prompt("Enter number: "));

setTimeout(() => {
        console.log("Time's up");
        fetchD(n).then(text => {
            console.log(text);
            return fetchD(n); // Chain another fetchD call
        })
        .then(text => {
            console.log(text);
            return fetchD(n);
        })
        .then(text => {
            console.log(text);
        })
        .catch(error => {
            console.error(error);
        });

    
   
}, 2000);