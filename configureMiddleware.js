import connectLivereload from "connect-livereload"
import express from "express"
import { engine } from "express-handlebars"
import livereload from "livereload"
import logger from "morgan"
import path, { dirname } from "path"
import { fileURLToPath } from "url"


export default function configureMiddleware(app) {
    const __dirname = dirname(fileURLToPath(import.meta.url))
    const STATIC_DIR = path.join(__dirname, "public")
    const VIEW_DIR = path.join(__dirname, "views")
    
    // Setup template engine
    app.engine(".html", engine({ extname: ".html" }))
    app.set("view engine", ".html")
    app.set("views", VIEW_DIR)
    
    // setup logger
    app.use(logger("dev"))
    
    // setup body parsers
    app.use(express.urlencoded({ extended: false }))
    app.use(express.json())
    
    // setup static dir
    app.use(express.static(STATIC_DIR))
    
    // setup livereload server
    const liveReloadServer = livereload.createServer()
    liveReloadServer.watch([STATIC_DIR, VIEW_DIR])
    
    liveReloadServer.server.once("connection", () => {
        setTimeout(() => {
            liveReloadServer.refresh("/")
        }, 100)
    })
    app.use(connectLivereload())
}