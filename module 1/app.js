// let name = 'Amogh';
// let age = 20;
// let hasHobbies = true;


// const summeriseUser = (hisName, hisAge, anyHobby)=>{
//     return `The boys name is ${hisName} , and age : ${hisAge} and ofc has ${anyHobby} hobbies `; 
// };


// console.log(summeriseUser(name,age,hasHobbies));



// }

// person.msg();

// const movies = ['Action' , 'Horror' , 'Sci-fi'];
// // movies.forEach(movie =>{
// //     console.log(movie);
// // });

// // console.log(movies.map(movie => movie + ' Avdenture'));
// const cpyArr = [...movies];//spread opertor, can pull data from arrays,objects etc..
// console.log(cpyArr);

// const toArray = (...agrs)=>{
//     return agrs;//REST Operator for using to get multiple agruments for a function
// };

// console.log(toArray(1,2,3,4,"AMogh"));

//destructuring
const person = {

    name: "Amogh",
    age: 20,
    msg(){
        console.log(`Hello bhai log, im ${this.name}`);
    }
};
const printName = ({ name,age }) =>{
    console.log(name,age);
};
printName(person);

const {name , msg} = person;
console.log(name,msg);

const movies = ['Action' , 'Horror' , 'Sci-fi'];
const [mv1,mv2,mv3] = movies;
console.log(mv1,mv2,mv3)

