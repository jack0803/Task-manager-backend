import '../src/db/mongoose.js'
import Task from '../src/models/task.js';
Task.findByIdAndDelete('639ecd87dcd54323b875b5e4').then((task) => {
    console.log(task)
    return Task.countDocuments({ completed: false })
}).then((result) => {
    console.log(result)
}).catch((e) => {
    console.log(e)
})