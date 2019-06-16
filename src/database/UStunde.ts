import * as util from "../util"
import Veranstaltung from "./Veranstaltung"
import Wochentag from "./Wochentag"

export default class UStunde {
    public static hours: Map<number, [string, string]> = new Map([
        [1, ["8:30", "9:00"]],
        [2, ["9:00", "9:45"]],
        [3, ["10:00", "10:45"]],
        [4, ["11:00", "11:45"]],
        [5, ["12:00", "12:45"]],
        [6, ["13:00", "13:45"]],
        [7, ["14:00", "14:45"]],
        [8, ["15:00", "15:45"]],
        [9, ["16:00", "16:45"]],
        [10, ["17:00", "17:45"]],
        [11, ["18:00", "18:45"]],
        [12, ["19:00", "19:45"]],
        [13, ["20:00", "20:45"]]
    ])
    public readonly day: Wochentag
    public readonly time: number
    public readonly startTime: number
    public readonly endTime: number
    public readonly stringifiedTime: string
    public readonly veranstaltung: Veranstaltung
    public readonly type: VeranstaltungTyp
    public readonly dozent: string
    public readonly room: string

    constructor(day: 1 | 2 | 3 | 4 | 5, time: number, timeSpan: string, veranstaltung: Veranstaltung, veranstaltungsTyp: string, dozent: string, room: number) {
        this.day = this.wochentagHelper(day)
        this.time = time
        if (timeSpan.match(/^\d\d?-\d\d?$/) === null) throw new TypeError("timeSpan not in correct format")
        this.startTime = parseInt(timeSpan.split("-")[0])
        this.endTime = parseInt(timeSpan.split("-")[1])
        this.stringifiedTime = `${this.wochentagAdverb(this.day)}, ${(UStunde.hours.get(this.startTime) as [string, string])[0]} bis ${(UStunde.hours.get(this.endTime) as [string, string])[1]}`
        this.veranstaltung = veranstaltung
        this.type = this.veranstaltungTypHelper(veranstaltungsTyp)
        this.dozent = dozent
        this.room = this.roomHelper(room)
    }

    public typString(input: VeranstaltungTyp): string {
        const str = util.enumToStringArray(VeranstaltungTyp)[input]
        return (str.charAt(0) + str.slice(1).toLowerCase()).replace(/UE/ig, "Ü")
    }

    public wochentagString(input: Wochentag): string {
        const str = util.enumToStringArray(Wochentag)[input - 1]
        return str.charAt(0) + str.slice(1).toLowerCase()
    }

    public wochentagAdverb(input: Wochentag): string {
        return `${util.enumToStringArray(Wochentag).map(it => it.toLowerCase())[input]}s`
    }
    public toJSON(): string {
        return JSON.stringify({
            day: this.wochentagString(this.day),
            dayInt: this.day,
            dozent: this.dozent,
            room: this.room,
            timeInt: this.time,
            timeString: this.stringifiedTime,
            typ: this.typString(this.type),
            veranstaltungAbbr: this.veranstaltung.abbreviation,
            veranstaltungFull: this.veranstaltung.fullName
        })
    }

    private roomHelper(input: number): string {
        let res = input.toString()
        const l = res.length
        for (let i = 0; i < 4 - l; i++) {
            res = "0" + res
        }
        return `${res.charAt(0)}.${res.slice(1)}`
    }

    private veranstaltungTypHelper(input: string): VeranstaltungTyp {
        switch (input) {
            case "Vorlesung": return VeranstaltungTyp.VORLESUNG
            case "Praktikum": return VeranstaltungTyp.PRAKTIKUM
            case "Übung": return VeranstaltungTyp.UEBUNG
            case "Seminar": return VeranstaltungTyp.SEMINAR
            case "Tutorium": return VeranstaltungTyp.TUTORIUM
            default: throw new TypeError()
        }
    }

    private wochentagHelper(input: 1 | 2 | 3 | 4 | 5): Wochentag {
        switch (input) {
            case 1: return Wochentag.MONTAG
            case 2: return Wochentag.DIENSTAG
            case 3: return Wochentag.MITTWOCH
            case 4: return Wochentag.DONNERSTAG
            case 5: return Wochentag.FREITAG
            default: throw new TypeError()
        }
    }
}

enum VeranstaltungTyp {
    VORLESUNG,
    PRAKTIKUM,
    UEBUNG,
    SEMINAR,
    TUTORIUM
}
