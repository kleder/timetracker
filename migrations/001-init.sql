CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, 
    accountId INTEGER, 
    published TEXT, 
    agile TEXT, 
    issueid TEXT,
    status TEXT, 
    date INTEGER, 
    duration INTEGER, 
    lastUpdate TEXT, 
    Summary TEXT
);

CREATE TABLE IF NOT EXISTS account (
    id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, 
    name TEXT, 
    url TEXT, 
    token TEXT, 
    current INTEGER
);

CREATE TABLE IF NOT EXISTS variables (
    id INTEGER NOT NULL PRIMARY KEY, 
    name TEXT UNIQUE, 
    value TEXT
);

CREATE TABLE IF NOT EXISTS boards_states (
    id INTEGER NOT NULL PRIMARY KEY, 
    accountId INT, 
    boardName TEXT, 
    state TEXT, 
    hexColor TEXT
);

CREATE TABLE IF NOT EXISTS boards_visibility (
    id INTEGER NOT NULL PRIMARY KEY, 
    accountId INTEGER, 
    boardName TEXT, 
    visible INTEGER
);

CREATE TABLE IF NOT EXISTS boards_after_choose (
    id INTEGER NOT NULL PRIMARY KEY, 
    accountId INTEGER, 
    afterChoose INTEGER
);

INSERT INTO variables (name, value) VALUES ('hide_hints', 0);
INSERT INTO variables (name, value) VALUES ('startWorkHour', '8');
INSERT INTO variables (name, value) VALUES ('startWorkMinute', '0');
INSERT INTO variables (name, value) VALUES ('endWorkHour', '16');
INSERT INTO variables (name, value) VALUES ('endWorkMinute', '0');
INSERT INTO variables (name, value) VALUES ('dayWork', '{"monday":1,"tuesday":1,"wednesday":1,"thursday":1,"friday":1,"saturday":0,"sunday":0}');
