var appPass = (req, res, next) => {
    const appToken = req.header('app-pass')
    if(appToken === process.env.APP_SECRET_TOKEN){
        next()
    }else {
        res.status(401).send()
    }
}

module.exports = {
    appPass
}