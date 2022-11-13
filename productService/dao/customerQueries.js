const pool = require('../databaseConnection/connection');
const jwt = require('jsonwebtoken')

const register = (req, res) => {

    const { email, password, customer_name, address } = req.body

    pool.query('INSERT INTO customer (email, password, customer_name, address) VALUES ($1,$2,$3,$4) RETURNING *', [email, password, customer_name, address], (error, results) => {
        if (error) {
            res.status(200).send({success:false,message:'User already exists'});
        }
        res.status(201).send(`User added with ID: ${results.rows[0].cid}`);
    })
}

const login = (req, res,next) => {
    let token
    const email = req.params.email;
    const password = req.params.password;
    pool.query('SELECT * FROM customer WHERE email=$1 AND password=$2', [email, password], (error, results) => {
        if (error) {
            throw error
        }

        //token generator
        try {
            token = jwt.sign(
                { userId: results.rows[0].cid, userEmail: results.rows[0].email },
                'secretkey',
                { expiresIn: "1h" }
            );
        }catch(err){
            console.log(err);
            const error=new Error("Error! Something went wrong.");
            return next(error);
        }

        res.status(200).json({customer:results.rows,token:token});
    })
}

module.exports = { register, login }