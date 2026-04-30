const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
//const connectDB = require("./config/db").connectDB;

//API documentation
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

//Routes
const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const carBrandsRoutes = require("./routes/carBrandsRoutes");
const carModelsRoutes = require("./routes/carModelsRoutes");
const partBrandsRoutes = require("./routes/partBrandsRoutes");
const productImagesRoutes = require("./routes/productImagesRoutes");
const productCompatibilityRoutes = require("./routes/productCompatibilityRoutes");
const productRoutes = require("./routes/productRoutes");
const addressesRoutes = require("./routes/addressesRoutes");
const oemReferencesRoutes = require("./routes/oemReferencesRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();
app.use(express.json());
app.use(cors());

dotenv.config();

const PORT = process.env.PORT || 9000;

//Connect to the database
//connectDB();

// API routes
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    swaggerOptions: { supportedSubmitMethods: [] },
  }),
);

app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/car_brands", carBrandsRoutes);
app.use("/api/car_models", carModelsRoutes);
app.use("/api/part_brands", partBrandsRoutes);
app.use("/api/product_images", productImagesRoutes);
app.use("/api/product_compatibility", productCompatibilityRoutes);
app.use("/api/products", productRoutes);
app.use("/api/addresses", addressesRoutes);
app.use("/api/oem_references", oemReferencesRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
