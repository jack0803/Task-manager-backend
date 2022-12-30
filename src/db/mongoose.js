//this module provide authentication , verification and object mapping and many more functionalities
//mongoose uses mongodb modules behind the sence
import mongoose from 'mongoose';

//established connection
//here dont take same name as database after '/'
mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api',{
    //this both are depricated in newer version
    // useNewUrlParser: true 
    // useCreateIndex: true
})

//create instances
// const me = User({
//     name: 'jack',
//     email:'JACK@gmail.com',
//     age: 20,
//     // if i do like this it will give error
//     // age: 'j'
//     password: 'Jack@1111 '
// })

// // save to database
// me.save().then((me) => {
//     console.log(me);
// }).catch((error) => {
//     console.log(error);
// }) //save doesn't take any arrgumnet but we have to handle promise which save() returns

// const task1 = Tasks({
//     description: 'make application',
//     status: false
// })

// task1.save().then((task1) => {
//     console.log(task1);
// }).catch((error) => {
//     console.log(error);
// })

//exporting whole file
export default './mongoose.js'