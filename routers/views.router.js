const express = require("express");
const router = express.Router();
const ProductManager = require("../ProductManager"); // Ajusta la ruta según la ubicación real de ProductManager

const productManagerInstance = new ProductManager();

// Ruta para la página principal
router.get("/", (req, res) => {
  const products = productManagerInstance.getProducts();
  res.render("index", { products, layout: false });
});

// Ruta para la página de productos en tiempo real
router.get("/realTimeProducts", (req, res) => {
  console.log("Accediendo a la ruta /realTimeProducts");

  const products = productManagerInstance.getProducts();
  res.render("realTimeProducts", { products, layout: false });
});

module.exports = router;
