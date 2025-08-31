const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const orderRoutes = require("./routes/orderRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const cartRoutes = require("./routes/cartRoutes");
const uploadRoutes = require('./routes/uploadRoutes');
const { errorHandler } = require("./middleware/errorHandler");
const path = require('path');

dotenv.config();

const app = express();

app.use(cors({
  // origin: process.env.CLIENT_URL,
  origin: ['https://odlocal.com', 'https://www.odlocal.com', 'http://localhost:4200'],
  credentials: true
}));

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/cart", cartRoutes);

app.use('/api/upload', uploadRoutes);
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Error Handler
// app.use(errorHandler);
process.on('uncaughtException', err => {
    console.error('Uncaught Exception:', err);
    // consider exiting the process or handling the error gracefully
  });
  
  process.on('unhandledRejection', reason => {
    console.error('Unhandled Rejection:', reason);
    // consider exiting the process or handling the error gracefully
  });
// DB Connection & Server Start
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("MongoDB connected");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch((err) => {
  console.error("DB Connection Failed:", err.message);
});
mongoose.connection.on('error', err => {
    console.error('Mongoose connection error:', err);
  });
  mongoose.connection.on('disconnected', () => {
    console.warn('Mongoose connection disconnected');
  });
