import express from "express";
import { hashPass } from "../utils/hashPass";
import { Pool } from "pg";
import { pool } from "../db";

const router = express.Router();

router.post("/login", async function (params) {});
router.post("/logout", async function (params) {});

router.post("/register", async function (req, res) {
	try {
		const { login: username, email, password } = req.body;
		if (!email || !password || !username)
			throw new Error("Email or passwor error1");
		console.log(email, password);
		if (email) {
		} //есть ли такой пользователь в бд
		const hashedPass = await hashPass(password);
		const newUser = await pool.query(
			"INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
			[username, email, hashedPass]
		);
		return res.status(200).json({ text: newUser.rows });
	} catch (e) {
		// console.log(e);

		return res.status(400).json({ error: e });
	}
});

export default router;
