const express = require("express");
const connectDB = require("./config/db");
const app = express();

app.use(express.json());
connectDB();

app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/users", require("./routes/api/users"));
app.use("/api/categories", require("./routes/api/categories"));
app.use("/api/posts", require("./routes/api/posts"));
// app.use("/api/profile", require("./routes/api/profile"));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
