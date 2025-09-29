import express from "express"
import configureMiddleware from "./configureMiddleware.js"
import connectLivereload from "connect-livereload"
import session from "cookie-session"
import { engine } from "express-handlebars"
import livereload from "livereload"
import logger from "morgan"
import path, { dirname } from "path"
import { fileURLToPath } from "url"
import getConnection from "./database/index.js"
import authenticationRoutes from "./routes/authentication.js"

const __dirname = dirname(fileURLToPath(import.meta.url))
const PORT = process.env.PORT
const ENV = process.env.NODE_ENV
const SECRET_KEY = process.env.SECRET_KEY
const STATIC_DIR = path.join(__dirname, "public")

const app = express()
configureMiddleware(app)

app.engine(".html", engine({ extname: ".html" }))
app.set("view engine", ".html")
app.set("views", path.join(__dirname, 'views'))

app.use(logger("dev"))

app.use(express.urlencoded({ extended: false }))

app.use(session({
    keys: [SECRET_KEY],
    name: "session",
    secure: ENV === "production",
    sameSite: true,
    httpOnly: true,
    maxAge: 60 * 60 * 1000
}))
app.use((req, res, next) => {
    res.locals.user = req.session.user
    next()
})

app.use(express.static(STATIC_DIR))

const liveReloadServer = livereload.createServer({ port: 8989 })
liveReloadServer.watch([STATIC_DIR, path.join(__dirname, "views")])

liveReloadServer.server.once("connection", () => {
    setTimeout(() => {
        liveReloadServer.refresh("/")
    }, 100)
});

app.use(connectLivereload())

app.use(authenticationRoutes)





// ========= Products ===========

const products = {
    // classic collection
    "classic_hoodie": {
        name: "CLASSIC HOODIE",
        price: "CHF 49.00",
        img: "hoodie_c.png"
    },
    "classic_ziphoodie": {
        name: "CLASSIC ZIPHOODIE",
        price: "CHF 59.00",
        img: "ziphoodie_c.png"
    },
    "classic_sweatpants": {
        name: "CLASSIC SWEATPANTS",
        price: "CHF 45.00",
        img: "sweatpants_c.png"
    },
    "classic_tshirt": {
        name: "CLASSIC TSHIRT",
        price: "19.00",
        img: "tshirt_p.png"
    },
    // premium collection

    "premium_hoodie": {
        name: "PREMIUM HOODIE",
        price: "CHF 59.00",
        img: "hoodie_p.png"
    },
    "premium_ziphoodie": {
        name: "PREMIUM ZIPHOODIE",
        price: "CHF 69.00",
        img: "ziphoodie_p.png"
    },
    "premium_sweatpants": {
        name: "PREMIUM SWEATPANTS",
        price: "CHF 55.00",
        img: "sweatpants_p.png"
    },
    "premium_tshirt": {
        name: "PREMIUM TSHIRT",
        price: "29.00",
        img: "tshirt_c.png"
    }
    
}

// Our first route handler!
app.get("/", async (req, res) => {
    const conn = getConnection()
    const [rows] = await conn.query("SELECT 1 + 1")
    console.log(rows)
    res.render("index")
})

// /products/hoodie
app.get("/product/:name", (req, res) => {
    const name = req.params.name // hoodie
    const product = products[name]
    res.render("product", {
        product
    })
})

// /products/cart




app.get("/classic", (req, res) => {
    res.render("classic")
})

app.get("/premium", (req, res) => {
    res.render("premium")
})

app.get("/support", (req, res) => {
    res.render("support")
})

app.get("/newsletter", (req, res) => {
    res.render("newsletter")
})

app.get("/profile", (req, res) => {
    res.render("profile")
})

app.get("/cart", (req, res) => {
    res.render("cart")
})

// Start the server on the port specified in .env!
app.listen(PORT, () => console.log(`Server listening on: http://localhost:${PORT}`))
