export default class Veranstaltung{
    public readonly abbreviation: string
    public readonly fullName: string
    
    constructor(abbreviation: string, fullName: string) {
        this.abbreviation = abbreviation
        this.fullName = fullName
    }
    
    public toString(): string {
        return `${this.fullName} (${this.abbreviation})`
    }
}