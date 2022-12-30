import jwt from 'jsonwebtoken';
import User from '../models/user.js';


const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        console.log(token);
        const decoded = jwt.verify(token, 'signature')
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })
        console.log(user);
        if (!user) {
            throw new Error()
        }

        req.user = user
        console.log(req.token);
        next()
    } catch (e) {
        res.status(401).send({ error: 'Please authenticate. or login with valid credentials' })
    }
}


export default auth