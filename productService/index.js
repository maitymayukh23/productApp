const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const port = 3001;

const productDao = require("./dao/productQueries");
const customerDao = require("./dao/customerQueries");
const customerProductDao = require("./dao/customerProductQueries");

var cors = require("cors");
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(bodyParser.json()); //used to parse the request body of a post request
app.use(
  bodyParser.urlencoded({
    extended: true, //true implies there is nested data inside the body object
  })
);

app.get("/", (req, res) => {
  res.json({ info: "Node.js, Express.js and Postgres API" });
});

app.post("/customer", customerDao.register);
app.get("/customer/:email/:password", customerDao.login);

app.post("/product", productDao.addProduct);
app.get("/products", productDao.allProducts);
app.put("/product", productDao.updateProduct);

app.get("/cart/:cid/:pid", customerProductDao.addProductToCart);
app.get("/cart/:cid", customerProductDao.getProductsInCart);
app.delete("/cart/:cid/:pid", customerProductDao.deleteProductFromCart);

app.listen(port, () => {
  console.log(`App running on port ${port}....`);
});
