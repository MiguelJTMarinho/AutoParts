// Initialize Sentry First
const dotenv = require("dotenv");
dotenv.config();
const Sentry = require("@sentry/node");

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV || "development",
  enableLogs: true,
});

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
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
const vehicleGenerationsRoutes = require("./routes/vehicleGenerationsRoutes");
const productRoutes = require("./routes/productRoutes");
const addressesRoutes = require("./routes/addressesRoutes");
const oemReferencesRoutes = require("./routes/oemReferencesRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const newsletterSubscribersRoutes = require("./routes/newsletterSubscribersRoutes");
const shippingRateRoutes = require("./routes/shippingRateRoutes");
const productFitmentRoutes = require("./routes/productFitmentRoutes");
const contactRoutes = require("./routes/contactRoutes");

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

const PORT = process.env.PORT || 9000;
const URL = process.env.SERVER_URL || "http://localhost:9000";

//Connect to the database
//connectDB();

app.use((req, res, next) => {
  res.on("finish", () => {
    Sentry.setUser(null);
  });

  next();
});

// API routes
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    swaggerOptions: { supportedSubmitMethods: [] },
  }),
);

app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("Sentry Test Error: " + new Date().toISOString());
});

// Add this simple route to handle the root URL
app.get("/", (req, res) => {
  res.send("AutoParts API is running! 🚗💨");
});

app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/car_brands", carBrandsRoutes);
app.use("/api/car_models", carModelsRoutes);
app.use("/api/part_brands", partBrandsRoutes);
app.use("/api/product_images", productImagesRoutes);
app.use("/api/vehicle_generations", vehicleGenerationsRoutes);
app.use("/api/products", productRoutes);
app.use("/api/addresses", addressesRoutes);
app.use("/api/oem_references", oemReferencesRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/newsletter", newsletterSubscribersRoutes);
app.use("/api/shipping_rates", shippingRateRoutes);
app.use("/api/product_fitments", productFitmentRoutes);
app.use("/api/contact", contactRoutes);

Sentry.setupExpressErrorHandler(app);
// Error fall-through
app.use((err, req, res, next) => {
  res.statusCode = 500;
  res.end(res.sentry + "\n");
});

app.listen(PORT, () => {
  console.log(`Server is running on ${URL}`);
});
