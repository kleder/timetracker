CREATE UNIQUE INDEX IF NOT EXISTS BOARDS_INDEX ON boards_states (
    accountId, 
    boardName,
    state
);

CREATE UNIQUE INDEX IF NOT EXISTS BOARDS_CHOOSE ON boards_visibility (
    accountId, 
    boardName
);