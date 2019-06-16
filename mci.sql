SELECT 'DROP TABLE ' || name || ';' FROM sqlite_master WHERE type = 'TABLE';

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS schwarzes_brett(
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS veranstaltung(
    abbreviation TEXT NOT NULL PRIMARY KEY,
    full_name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS veranstaltung_typ(
    type TEXT NOT NULL PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS stundenplan(
    day INTEGER NOT NULL CHECK (day BETWEEN 1 AND 5),
    time INTEGER NOT NULL CHECK (time BETWEEN 1 AND 13),
    -- time_span TEXT NOT NULL CHECK (time_span REGEXP "^\d{2}:\d{2}-\d{2}:\d{2}$"),
    time_span TEXT NOT NULL,
    veranstaltung TEXT NOT NULL,
    typ TEXT NOT NULL,
    dozent TEXT NOT NULL,
    room INTEGER NOT null CHECK (length(room) BETWEEN 1 AND 4),
    FOREIGN KEY (veranstaltung) REFERENCES veranstaltung(abbreviation),
    FOREIGN KEY (typ) REFERENCES veranstaltung_typ(type),
    PRIMARY KEY (day, time)
);

CREATE TABLE IF NOT EXISTS fahrten(
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    -- start_time TEXT NOT NULL CHECK (start_time REGEXP "^\d{2}:\d{2}$"),
    -- end_time TEXT NOT NULL CHECK (end_time REGEXP "^\d{2}:\d{2}$"),
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    start_location TEXT NOT NULL,
    end_location TEXT NOT NULL,
    driver TEXT NOT NULL,
    remaining_seats INTEGER CHECK(remaining_seats >= 0),
    license_plate TEXT NOT NULL,
    FOREIGN KEY (driver) REFERENCES user(campusid)
);

CREATE TABLE IF NOT EXISTS user(
    campusid TEXT NOT NULL PRIMARY KEY,
    gmid TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS wiki (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL UNIQUE,
    content TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS praktikum(
    veranstaltung TEXT NOT NULL,
    -- sdate TEXT NOT NULL CHECK ( sdate REGEXP "^\d{4}-\d{2}-\d{2}$" ),
    -- start TEXT NOT NULL CHECK ( start REGEXP "^\d{2}:\d{2}$" ),
    -- end TEXT NOT NULL CHECK ( start REGEXP "^\d{2}:\d{2}$" ),
    sdate TEXT NOT NULL,
    start TEXT NOT NULL,
    end TEXT NOT NULL,
    FOREIGN KEY (veranstaltung) REFERENCES veranstaltung(abbreviation),
    PRIMARY KEY (veranstaltung, sdate)
);
