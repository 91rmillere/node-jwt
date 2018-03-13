const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();

app.get('/api', (req, res) => {
    res.json({
        message: 'Welcome to the API'
    });
})

app.post('/api/posts', verifyToken, (req, res) => {

    jwt.verify(req.token, 'secretKey', (err, authData) =>{
        if(err){
            res.sendStatus(401);
        } else {
            res.json({
                message: 'Post Created',
                authData
            });
        }
    });

    
});

app.post('/api/login', (req, res) => {
    //Mock User
    const user = {
        id: 1,
        username: 'ryan',
        email: 'ryan@gmail.com'
    }
    jwt.sign({user}, 'secretKey',{ expiresIn: '30s' } ,(err, token) => {
        res.json({
            token
        });
    });
});

// Format of token
//A Authorization: Bearer <access_token>

// Verify token

function verifyToken(req, res, next){
    // Get the auth header value
    const bearerHeader = req.headers['authorization'];
    // Check if bearer is undefined
    if(typeof bearerHeader !== 'undefined'){
        //Split at the space
        const bearer = bearerHeader.split(' ');
        //Get Tokern from array
        const bearerToken = bearer[1];
        //set the token
        req.token = bearerToken;
        //call next middleware
        next();
    } else {
        //FOrbidden
        res.sendStatus(403);
    }
}

app.listen(5000, () => console.log('Server Started on port 5000'));