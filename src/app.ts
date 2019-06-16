import * as fs from "fs"
import * as http from "http"
import * as path from "path"
import Database from "./database"
import UStunde from "./database/UStunde"
import HttpObject from "./HttpObject"
import Page from "./Page"
import pages from "./pages"
import * as util from "./util"

const db = Database
db.veranstaltungen().then(it => console.log(it)).catch(e => { throw e })
db.stundenplan().then(it => console.log(it)).catch(e => { throw e })

const port = process.argv.length > 2 && !isNaN(parseInt(process.argv[2])) ? parseInt(process.argv[2]) : Math.round(1024 + Math.random() * 64511)

http.createServer(async(req, res) => {
    const sendPage = (response: HttpObject, config: {status?: number; statusMsg?: string; additionalHeaders?: http.OutgoingHttpHeaders} = {}, vars: Map<string, string> = new Map()): void => {
        if (!config.status) config.status = 200
        if (!config.statusMsg) config.statusMsg = "OK"
        if (!config.additionalHeaders) config.additionalHeaders = {}
        const out = response.render(vars, req)
        const standardHeaders: http.OutgoingHttpHeaders = {
            "Content-Length": out.length,
            "Content-Type": `${response.mimeType}; charset=UTF-8`,
            Server: `${util.serverName}/${util.serverVersion}`,
            "X-Powered-By": `Node.js/${process.version}`
        }
        const headers = util.extend(standardHeaders, config.additionalHeaders as http.OutgoingHttpHeaders) as http.OutgoingHttpHeaders
        res.writeHead(config.status, config.statusMsg, headers)
        res.end(out)
    }

    const url = (req.url as string).split("?")[0]

    switch (url) {
        case "/materialize.css":
            sendPage(new HttpObject(fs.readFileSync(path.resolve(__dirname, "../static/materialize/css/materialize.min.css"), "UTF-8"), "text/css", false))
            break
        case "/materialize.js":
            sendPage(new HttpObject(fs.readFileSync(path.resolve(__dirname, "../static/materialize/js/materialize.min.js"), "UTF-8"), "application/javascript", false))
            break
        case "/app.js":
            sendPage(new HttpObject(fs.readFileSync(path.resolve(__dirname, "../static/app.js"), "UTF-8"), "application/javascript", false))
            break
        case "/stundenplan.js":
            sendPage(new HttpObject(fs.readFileSync(path.resolve(__dirname, "../static/stundenplan.js"), "UTF-8"), "application/javascript", false))
            break

        case "/":
            sendPage(pages.dashboard, {}, new Map([
                ["title", "Dashboard"],
                ["schwarzesBrett", (await db.infos()).map(it => `<a href="#!" class="collection-item" data-info-id="${it.id}">${it.title}</a>`).join("")]
            ]))
            break
        case "/dashboard":
            sendPage(pages.notFound, {status: 307, statusMsg: "Temporary Redirect", additionalHeaders: {Location: "/"}})
            break
        case "/stundenplan":
            sendPage(pages.stundenplan, {}, new Map([
                ["title", "Stundenplan"],
                ["stundenplan", `<script id="data" type="application/json">[${(await db.stundenplan()).map(it => it.toJSON()).join(",")}]</script>`],
                ["additionalHead", "<script src=\"/stundenplan.js\" defer></script>"]
            ]))
            break
        default:
            sendPage(pages.notFound, {status: 404, statusMsg: "Not Found"})
    }
}).listen(port, () => console.log(`Server listening on port ${port}\nhttp://127.0.0.1:${port}`))
