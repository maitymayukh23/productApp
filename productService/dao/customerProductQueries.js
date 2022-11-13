const pool = require('../databaseConnection/connection')
const jwt = require('jsonwebtoken')

//accepts customer_id and product_id as request param
const addProductToCart = (req, res) => {
    const cid = parseInt(req.params.cid);
    const pid = parseInt(req.params.pid);

    if (req.headers.authorization === undefined) {
        res.end('Error! Request header not provided.');
        return null;
    } else {
        token = req.headers.authorization.split(' ')[1];
    }
    //Authorization: 'Bearer TOKEN'
    if (!token) {
        res.status(200).json({ success: false, message: "Error! Token was not provided." });
    }
    //Decoding the token
    const decodedToken = jwt.verify(token, "secretkey");

    pool.query('INSERT INTO customer_product (cid,pid) VALUES ($1,$2) RETURNING *', [cid, pid], (error, results) => {
        if (error)
            throw error
        res.status(201).send(`Product add to cart with ID: ${results.rows[0].cpid}`);
    })
}

const getProductsInCart = (req, res) => {
    const cid = parseInt(req.params.cid);

    if (req.headers.authorization === undefined) {
        res.end('Error! Request header not provided.');
        return null;
    } else {
        token = req.headers.authorization.split(' ')[1];
    }
    //Authorization: 'Bearer TOKEN'
    if (!token) {
        res.status(200).json({ success: false, message: "Error! Token was not provided." });
    }
    //Decoding the token
    const decodedToken = jwt.verify(token, "secretkey");

    pool.query('SELECT * FROM product WHERE pid IN (SELECT pid FROM customer_product WHERE cid=$1);', [cid], (error, results) => {
        if (error){
            res.status(200).json({success:false, message:"Error!"});
        }
          
        res.status(200).json(results.rows);
    })
}

const deleteProductFromCart = (req, res) => {
    const cid = parseInt(req.params.cid);
    const pid = parseInt(req.params.pid);

    if (req.headers.authorization === undefined) {
        res.end('Error! Request header not provided.');
        return null;
    } else {
        token = req.headers.authorization.split(' ')[1];
    }
    //Authorization: 'Bearer TOKEN'
    if (!token) {
        res.status(200).json({ success: false, message: "Error! Token was not provided." });
    }
    //Decoding the token
    const decodedToken = jwt.verify(token, "secretkey");

    pool.query('DELETE FROM customer_product WHERE cid=$1 AND pid=$2', [cid, pid], (error, results) => {
        if (error)
            throw error
        res.status(201).send(`Product deleted from cart. `);
    })
}

module.exports = { addProductToCart, getProductsInCart, deleteProductFromCart }