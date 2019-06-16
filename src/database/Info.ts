export default class Info {
    public readonly id: number
    public readonly title: string
    public readonly content: string


    constructor(id: number, title: string, content: string) {
        this.id = id
        this.title = title
        this.content = content
    }

    public toString(): string {
        return `${this.title.toUpperCase()}:\n${this.content.replace(/<br\s?\/?>/g, "\n").replace(/<*>/, "")}`
    }
}