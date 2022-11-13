const pool = require('../databaseConnection/connection')

const addProduct = (req, res) => {
    const { name, price } = req.body;
    pool.query('INSERT INTO product(name, price)VALUES ($1,$2)RETURNING *', [name, price], (error, results) => {
        if (error) {
            throw error
        }
        res.status(201).send(`Product added with ID=${results.rows[0].pid}`);
    })
}

const allProducts = (req, res) => {
    pool.query('SELECT * FROM product', (error, results) => {
        if (error)
            throw error
        res.status(200).json(results.rows)
    })
}

const updateProduct = (req, res) => {
    const { pid, name, price } = req.body;
    console.log('pid:'+pid)
    console.log('name: '+name)
    console.log('price: '+price)
    pool.query('UPDATE product SET name=$1 , price=$2 WHERE pid=$3', [name, price, pid], (error, results) => {
        if (error)
            throw error
        res.status(200).send('Product updated');
    })
}

module.exports = { addProduct, allProducts, updateProduct }