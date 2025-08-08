import jwt from "jsonwebtoken";

const fetchUser = (req, res, next) => {
    let token = req.header("auth-token");
    if (!token){
        res.status(401).send("Invalid Token")
    }
    try {
    const data = jwt.verify(token, process.env.JWT_SECRET)
    req.user = data.user
    next();
    } catch (error) {
        console.log(error.message)
        res.status(401).send("Invalid Token")
    }
};

export default fetchUser;