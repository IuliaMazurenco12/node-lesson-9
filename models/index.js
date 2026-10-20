import express from "express";
import bcrypt from "bcryptjs";
import { sequelize } from "./config/db.js";
import User from "./models/user.js";

const app = express();
const port = 3333;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello node js!");
});

// Register user Регистрируем пользователя
app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).send("username and password are required");
    }

    // проверяем, нет ли уже такого пользователя
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(409).send("user already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10); // хэшируем пароль

    await User.create({ username, password: hashedPassword }); // сохраняем в MySQL

    res.status(201).send("user successfully registered!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Registration failed!");
  }
});

// login
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ where: { username } }); // ищем в MySQL
    if (!user) {
      return res.status(400).send("username or password is invalid");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).send("username or password is invalid");
    }

    res.send("Successful access to your profile!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

// сначала подключаемся к базе, потом запускаем сервер
try {
  await sequelize.authenticate();
  console.log("MySQL connected");

  app.listen(port, () => {
    console.log(`Server is running at http://127.0.0.1:${port}`);
  });
} catch (error) {
  console.error("MySQL connection error:", error.message);
}