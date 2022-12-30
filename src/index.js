import express from 'express'
//importing whole file like this way :
import './db/mongoose.js'
import userRouter from './routers/user.js';
import taskRouter from './routers/task.js';
import bcrypt from 'bcrypt';
//it provides the token to user that describe that how much time the user can logged in server
import jwt from 'jsonwebtoken';
import multer from 'multer'
const app = express()
const port = process.env.PORT || 3000
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

const upload = multer({
    //file destination directory
    dest: 'images',
    limits: {
        // 1mb
        fileSize: 1000000
    },
    fileFilter(req, file, callback) {
        // using reguler expression 
        if (!file.originalname.match(/\.(doc|docx)$/)) {
            return callback(new Error('Please upload word document'))
        }

        callback(undefined, true)
    }
})

//here in single function arrgument you can pass custom string but you have write same string inside key value of post request 
app.post('/upload' , upload.single('upload') , (req , res) => {
    
    res.send()
})

app.listen(port,() =>{
    console.log('server started! ' + port);
})

//with out midleware  new request --> run route handler


//with midleware      new request --> do somthing with request (run an custom function) --> run route handler

//this is call midleware it run before any request has been made
// app.use((req, res, next) => {
//     if (req.method === 'GET') {
    //         res.send('GET requests are disabled')
    //     } else {
//if we don't call next then requset will go in infinite waiting mode
//         next()
//     }
// })

// app.use((req, res, next) => {
//     res.send('Site is under maitenence')
// })

// import Task from './models/task.js';
// import User from './models/user.js'
// const main = async () => {
//     console.log('user connectrd with any perticuler task');
//     //here we find connection how's the task owner id is link with entire user
//     const task = await Task.findById('63a67bb525c94f0e68ed9a43').populate("owner").exec()
//     // await task.populate('owner')
//     console.log(task.owner)

//     console.log('task connected with user');
//     const user = await User.findById('63a67acf9b4960a4851d4863').populate("user_task").exec()
//     // await user.populate('tasks').execPopulate()
//     console.log(user.user_task)
// }

// main()
//here we parse incoming json data

// const myFunction = async () => {
//     //sign returns a token
//     const token = jwt.sign({ _id: "dummyid" } , 'jackthisside' , { expiresIn: "7 days" }) //second arrgument is 'secret' similer to signeture that verifies the user
//     //this token has the data in three part seprated by '.' in the form of hase
//     //the middle part contains the object and sting that we provide the sting is 'secret' so anyone cant change the data without knowing this 'secret'
//     //you can decode this code by using base64 decoder and can see that hows the token stores the data
//     console.log(token);

//     //verifing token
//     //here jwt verify the token using 'secret' that we provide if by using this 'secret' the token can't able to decode then jwt will throw an error
//     const data = jwt.verify(token,'jackthisside' )
//     console.log(data);
// }

// myFunction()

    // app.post('/users',(req , res) => {
    //     const user = User(req.body)
    
    //     //handle promise of User
    //     user.save().then(() => {
    //         res.status(201).send(user) 
    //     }).catch((error) => {
    //         //here we specifies the error code 
    //         //error codes : https://www.webfx.com/web-development/glossary/http-status-codes/
    //         res.status(400).send(error)
    //     })
    // })

    // app.post('/tasks',(req , res) => {
//     const task = Task(req.body)

//     //handle promise of User
//     task.save().then(() => {
//         res.status(201).send(task) 
//     }).catch((error) => {
    
    //         res.status(400).send(error)
    //     })
    // })
    

    // //all users
// app.get('/users', (req ,res) => {
    //     User.find({}).then((user) => {
        //         res.send(user)
        //     }).catch((error) => {
            //         console.status(500).send(error);
//     })
// })

// //perticuler user 
// //here :id is route parameter that provide by express to fetch dynamic data
// app.get('/users/:id', (req ,res) => {
//     //params contain the id that we provide in URL
//     console.log(req.params);
//     const _id = req.params.id 

//     //in findOne method not take direct _id it always take arrgumnet in object formate
//     User.findOne({_id: _id}).then((user) => {
    //         //mongdb qurery donesn't return error if id not exist so we have to handle that mongodb simply returns null
//         if(!user){
    //             return res.status(404).send()
    //         }
    //         res.send(user)
//     }).catch((error) => {
//         console.log(error);
//         res.status(500).send(error);
//     })
// })

// //all task
// app.get('/tasks', (req ,res) => {
    //     Task.find({}).then((task) => {
        //         res.send(task)
//     }).catch((error) => {
    //         console.status(500).send(error);
    //     })
    // })
    
    //converting in async await
// const gettask = async () => {
    //     const task = await Task.find({})
    //     return task
    // }
    // app.get('/tasks', (req ,res) => {
        //     gettask().then((result) => {
            //         res.send(result)
//     }).catch((error) => {
    //         res.status(500).send(error);
    //     })
// })

// //perticuler task 
// app.get('/tasks/:id', (req ,res) => {
    //     console.log(req.params);
    //     const _id = req.params.id 
    
    //     Task.findOne({_id: _id}).then((task) => {
        //         if(!task){
            //             return res.status(404).send()
            //         }
            //         res.send(task)
            //     }).catch((error) => {
                //         console.log(error);
//         res.status(500).send(error);
//     })
// })