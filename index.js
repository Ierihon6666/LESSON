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

const User = sequelize.define("users", {
    id_user: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    surname: { type: DataTypes.STRING },
    number_group: { type: DataTypes.STRING },
}, { timestamps: false });

app.use(cors());
app.use(express.json());

app.get("/main", (req, res) => {
    res.send("<h1>Hello world!</h1>");
});

app.get("/getUser/:id_user", async (req, res) => {
    try {
        const { id_user } = req.params;
        const user = await User.findOne({ where: { id_user } });
        if (!user) return res.json("Запись не найдена!");
        res.json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Ошибка" });
    }
});

app.post("/insertUser", async (req, res) => {
    try {
        const data = req.body;
        console.log(req.body);
        await User.create({ surname: data.surname, number_group: data.number_group });
        res.json({ message: "Запись создана!" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Ошибка" });
    }
});

app.delete("/deleteAll", async (req, res) => {
    try {
        await User.destroy({ where: {} }); // Удаляем все записи
        res.json({ message: "Все записи удалены!" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Ошибка" });
    }
});

app.delete("/deleteId/:id_user", async (req, res) => {
    try {
        const { id_user } = req.params;
        await User.destroy({ where: { id_user } });
        res.json({ message: `Запись по ID=${id_user} удалена` });
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
