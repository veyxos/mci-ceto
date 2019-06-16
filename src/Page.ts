import * as fs from "fs"
import { IncomingMessage } from "http"
import * as path from "path"
import HttpObject from "./HttpObject"

export default class Page extends HttpObject {
    public static layout: string = fs.readFileSync(path.resolve(__dirname, "../static/_layout.hbs"), "UTF-8")
    public static header: string = fs.readFileSync(path.resolve(__dirname, "../static/header.hbs"), "UTF-8")

    constructor(src: string) {
        super(src, "text/html")
    }

    public render(vars: Map<string, string>, req: IncomingMessage): string {
        const layoutVars = new Map<string, string>([
            ["header", Page.header],
            ["content", this.src]
        ])
        if (vars.has("additionalHead")) {
            layoutVars.set("additionalHead", vars.get("additionalHead") as string)
            vars.delete("additionalHead")
        } else {
            layoutVars.set("additionalHead", "")
        }
        const autoVars = new Map<string, string>([
            ["path", req.url as string],
            ["host", req.headers.host as string],
            ["port", (req.headers.host as string).indexOf(":") >= 0 ? (req.headers.host as string).split(":")[1].split("/")[0] : "80"]
        ])
        return this.renderString(this.renderString(Page.layout, layoutVars), new Map([...autoVars].concat([...vars])))
    }
}
