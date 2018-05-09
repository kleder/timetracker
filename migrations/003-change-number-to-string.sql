ALTER TABLE variables RENAME TO tmp;
CREATE TABLE variables (
    id INTEGER NOT NULL PRIMARY KEY, 
    name TEXT UNIQUE, 
    value TEXT
);

INSERT INTO variables (id, name, value) SELECT id, name, value FROM tmp;

DROP TABLE tmp;