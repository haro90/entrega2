const express = require("express");
const exphbs = require("express-handlebars");
const http = require("http");
const { Server } = require("socket.io");
const ProductManager = require("../ProductManager");

const productManagerInstance = new ProductManager();

const app = express();
const port = 8080;
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(express.static("public"));

app.engine(
  "handlebars",
  exphbs.create({
    extname: ".handlebars",
    layoutsDir: __dirname + "/../views/layouts",
    partialsDir: __dirname + "/../views/partials",
  }).engine
);

app.set("view engine", "handlebars");
app.set("views", "./views/layouts");

const productsRouter = require("../routers/products");
const cartRouter = require("../routers/cart");
const viewsRouter = require("../routers/views.router");

app.use("/api/products", productsRouter);
app.use("/api/cart", cartRouter);
app.use("/", viewsRouter);

io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado");

  socket.on("productAdded", function (product) {
    if (product && product.title) {
      product.id = generateProductId();
      productManagerInstance.addProduct(product);
      io.emit("productAdded", product);
      io.emit("updateProductList", productManagerInstance.getProducts());
    }
  });

  socket.on("deleteProduct", (productId) => {
    console.log("Producto eliminado:", productId);
    const deletedProductId = productManagerInstance.deleteProduct(productId);
    io.emit("productDeleted", deletedProductId);
    io.emit("updateProductList", productManagerInstance.getProducts());
  });
});

server.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});

const generateProductId = productManagerInstance.generateProductId;
