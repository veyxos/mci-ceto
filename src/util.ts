interface PackageJson {
    name: string
    version: string
    description?: string
    main: string
    scripts?: {}
    respository?: { type: string; url: string }
    author?: string
    license?: string
    dependecies?: {}
    devDependencies?: {}
}

const pkg: PackageJson = require("../package.json") // tslint:disable-line no-var-requires

export function extend(obj: object, src: object): object {
    // @ts-ignore
    for (const key in src) if (src.hasOwnProperty(key)) obj[key] = src[key]
    return obj
}
export const serverName = "CeTo"
export const serverVersion = pkg.version

export function enumToStringArray(input: object): Array<string> {
    const res: Array<string> = []
    for (const entry in input) {
        if (isNaN(parseInt(entry)))  res.push(entry)
    }
    return res
}
