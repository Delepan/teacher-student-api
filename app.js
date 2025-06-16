const express = require("express");
const app = express();
require("dotenv").config();
require("./models");

app.use(express.json());

const teacherRoutes = require("./routes/teacherRoutes");
app.use("/api", teacherRoutes);

app.get("/", (req, res) => {
  res.send("Teacher Student API running!!!");
});

if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running at ${PORT}`);
  });
}

module.exports = app;
