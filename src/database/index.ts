import * as path from "path"
import * as sqlite from "sqlite3"
import Info from "./Info"
import UStunde from "./UStunde"
import Veranstaltung from "./Veranstaltung"
import Wochentag from "./Wochentag"

const sqlite3 = sqlite.verbose()

export default new class Database{
    private db: sqlite.Database

    constructor() {
        console.log(__dirname)
        this.db = new sqlite3.Database(path.resolve(__dirname, "../../mci.db"), err => {
            if (err) throw err
            console.log("Connected")
        })
    }

    public infos(): Promise<Array<Info>> {
        return new Promise<Array<Info>>((resolve, reject): void => {
            this.db.all("SELECT * FROM schwarzes_brett ORDER BY id", [], (err: Error | null, res: Array<{ id: number; title: string; content: string }>) => {
                if (err) reject(err)
                else resolve(res.map(it => new Info(it.id, it.title, it.content)))
            })
        })
    }

    public veranstaltungen(): Promise<Array<Veranstaltung>> {
        return new Promise<Array<Veranstaltung>>((resolve, reject): void => {
            this.db.all("SELECT * FROM veranstaltung ORDER BY abbreviation", [], (err: Error | null, res: Array<{ abbreviation: string; full_name: string }>) => {
                if (err) reject(err)
                else resolve(res.map(it => new Veranstaltung(it.abbreviation, it.full_name)))
            })
        })
    }

    public stundenplan(): Promise<Array<UStunde>> {
        return new Promise<Array<UStunde>>((resolve, reject) => {
            this.db.all("SELECT day, time, time_span, veranstaltung AS veranstaltung_abbr, veranstaltung.full_name AS veranstaltung_full, typ, dozent, room FROM stundenplan INNER JOIN veranstaltung ON veranstaltung.abbreviation = stundenplan.veranstaltung", [],
                (err: Error | null, res: Array<{
                    day: 1 | 2 | 3 | 4 | 5;
                    time: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;
                    time_span: string;
                    veranstaltung_abbr: string;
                    veranstaltung_full: string;
                    typ: string;
                    dozent: string;
                    room: number;
                }>) => {
                if (err) reject(err)
                else {
                    resolve(res.map(it => new UStunde(
                        it.day,
                        it.time,
                        it.time_span,
                        new Veranstaltung(it.veranstaltung_abbr, it.veranstaltung_full),
                        it.typ,
                        it.dozent,
                        it.room
                    )))
                }
            })
        })
    }
}()
