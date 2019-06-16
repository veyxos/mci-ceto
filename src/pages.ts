import * as fs from "fs"
import * as path from "path"
import Page from "./Page"

export default class Pages {
    public static dashboard: Page = new Page(fs.readFileSync(path.resolve(__dirname, "../static/dashboard.hbs"), "UTF-8"))
    public static home: Page = Pages.dashboard
    public static stundenplan: Page = new Page(fs.readFileSync(path.resolve(__dirname, "../static/stundenplan.hbs"), "UTF-8"))
    public static notFound: Page = new Page(fs.readFileSync(path.resolve(__dirname, "../static/notFound.hbs"), "UTF-8"))
}
