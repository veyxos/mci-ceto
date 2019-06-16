import * as util from "./util"

export default class HttpObject {
    public static globalVars: Map<string, string> = new Map<string, string>([
        ["nodeVersion", process.version],
        ["date", new Date().toISOString()],
        ["server", util.serverName],
        ["serverVersion", util.serverVersion]
    ])
    public readonly mimeType: string
    public readonly minify: boolean
    public readonly src: string

    constructor(src: string, mimeType: string, minify: boolean = true) {
        this.src = src
        this.mimeType = mimeType
        this.minify = minify
    }

    public render(vars: Map<string, string>, ...idontuseanyofthis: Array<any>): string { // tslint:disable-line no-any
        return this.renderString((this.minify ? this.src.split("\n").filter(it => it.match(/^\s+$/) === null).map(it => it.trim()).join("") : this.src), vars)
    }

    protected renderString(input: string, vars: Map<string, string> = new Map()): string {
        new Map([...HttpObject.globalVars].concat([...vars])).forEach((val, key) => input = input.replace(new RegExp(`\{\{${key}\}\}`, "g"), val))
        return input
    }
}
