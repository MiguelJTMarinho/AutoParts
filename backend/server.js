const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
//const connectDB = require("./config/db").connectDB;

const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const carBrandsRoutes = require("./routes/carBrandsRoutes");
const carModelsRoutes = require("./routes/carModelsRoutes");
const partBrandsRoutes = require("./routes/partBrandsRoutes");

const app = express();
app.use(express.json());
app.use(cors());

dotenv.config();

const PORT = process.env.PORT || 9000;

//Connect to the database
//connectDB();

// API routes
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/car_brands", carBrandsRoutes);
app.use("/api/car_models", carModelsRoutes);
app.use("/api/part_brands", partBrandsRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
