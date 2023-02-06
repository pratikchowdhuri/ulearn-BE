const jwt = require('jsonwebtoken')

function authenticate(req, res, next){
    try{
        const token = req.headers.authorization.split(' ')[1]
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY)
        const {userId} = decodedToken
        req.user = {
            userId
        }
        console.info('request is authenticated')
        next()
    }
    catch(err){
        res.status(401).send('Unauthorised access')
    }
}

module.exports = authenticate