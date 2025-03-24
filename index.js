const express = require("express");
require("dotenv").config();
const app = express();
const cors = require("cors");
const { Sequelize } = require("sequelize");
const { DataTypes } = require("sequelize");
const PORT = process.env.PORT;

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        dialect: 'postgres',
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
    }
);

// Изменены ключи на camelCase
const User = sequelize.define("users", {
    idUser: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }, // изменено на idUser
    surname: { type: DataTypes.STRING },
    numberGroup: { type: DataTypes.STRING }, // изменено на numberGroup
}, { timestamps: false });

app.use(cors());
app.use(express.json());

app.get("/main", (req, res) => {
    res.send("<h1>Hello world!</h1>");
});

// Обратите внимание на изменения в переменной idUser
app.get("/getUser/:idUser", async (req, res) => {
    try {
        const { idUser } = req.params; // изменено на idUser
        const user = await User.findOne({ where: { idUser } }); // изменено на idUser
        if (!user) return res.json("Запись не найдена!");
        res.json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Ошибка" });
    }
});

// Изменено на numberGroup
app.post("/insertUser", async (req, res) => {
    try {
        const data = req.body;
        console.log(req.body);
        await User.create({ surname: data.surname, numberGroup: data.numberGroup }); // изменено на numberGroup
        res.json({ message: "Запись создана!" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Ошибка" });
    }
});

// Удаляем все записи
app.delete("/deleteAll", async (req, res) => {
    try {
        await User.destroy({ where: {} }); 
        res.json({ message: "Все записи удалены!" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Ошибка" });
    }
});

// Изменено на idUser
app.delete("/deleteId/:idUser", async (req, res) => {
    try {
        const { idUser } = req.params; // изменено на idUser
        await User.destroy({ where: { idUser } }); // изменено на idUser
        res.json({ message: `Запись по ID=${idUser} удалена` }); // изменено на idUser
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Ошибка" });
    }
});

async function start() {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        app.listen(PORT, () => {
            console.log(`Сервер работает на порту ${PORT}`);
        });
    } catch (error) {
        console.error("Ошибка подключения к базе данных:", error);
    }
}

start();
