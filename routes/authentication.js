import express from "express"
import bcrypt from "bcrypt"
import getConnection from "../database/index.js"

const router = new express.Router()

router.get("/login", (req, res) => {
    if (req.session.user) {
        return res.redirect("/")
    }
    res.render("authentication/login")
})

router.post("/login", async (req, res) => {
    const { email, password } = req.body

    const conn = getConnection()
    const [rows] = await conn.query("SELECT * FROM user WHERE email=?", [email])
    const user = rows[0]

    if (!user) return res.status(401).redirect("/login")

    const passwordsMatch = await bcrypt.compare(password, user.password)
    if (passwordsMatch) {
        req.session.user = {
            id: user.id,
            username: user.username
        }
        res.redirect("/")
    } else {
        res.render("authentication/login", { errors: [] })
    }
})

router.get("/signup", (req, res) => {
    res.render("authentication/signup")
})

router.post("/signup", async (req, res) => {
    console.log("Hi")
    const { email, username, password } = req.body
    try {
        const conn = getConnection()
        const [rows] = await conn.query("SELECT * FROM user WHERE email=? or username=?", [email, username])

        const user = rows[0]
        if (user) return res.status(401).send("Unauthorized")

        const password_hash = await bcrypt.hash(password, 10)
        const [result] = await conn.execute("INSERT INTO user (email, username, password) VALUES (?, ?, ?)", [email, username, password_hash])

        req.session.user = {
            id: result.insertId,
            username: username
        }

        return res.redirect("/")
    } catch (e) {
        console.error(e)
        return res.status(401).render("authentication/signup")
    }
})


router.get("/logout", (req, res) => {
    req.session = null
    res.redirect("/")
})

export default router