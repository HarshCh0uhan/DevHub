const auth = ( req, res, next) => {
    console.log("Checking Admin Details...")
    const token = "xyz";
    const isAdminAuthorized = token == "xyz";
    if(!isAdminAuthorized){
        res.status(401).send("Unauthorized request")
    }
    else{
        console.log("Authorization is Successful !!!");
        next();
    }
}

module.exports = {auth}