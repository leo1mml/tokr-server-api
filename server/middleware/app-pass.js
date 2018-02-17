var appPass = (req, res, next) => {
    const appToken = req.header('app-pass')
    if(appToken === process.env.APP_SECRET_TOKEN){
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000/')
        next()
    }else {
        res.status(401).send()
    }
}

module.exports = {
    appPass
}