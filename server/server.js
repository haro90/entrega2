const express = require("express");
const exphbs = require("express-handlebars");
const http = require("http");
const io = require("socket.io");

const ProductManager = require("../ProductManager");

const productManagerInstance = new ProductManager();

const app = express();
const port = 8080;
const server = http.createServer(app);
const socketIO = io(server);

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
app.use("/", viewsRouter); // Utilizamos el router de las vistas

socketIO.on("connection", (socket) => {
  console.log("Nuevo cliente conectado");

  socket.on("addProduct", (product) => {
    console.log("Producto agregado:", product);
    socketIO.emit("productAdded", product);
  });

  socket.on("deleteProduct", (productId) => {
    console.log("Producto eliminado:", productId);
    socketIO.emit("productDeleted", productId);
  });
});

server.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
