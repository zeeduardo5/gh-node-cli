CREATE TABLE IF NOT EXISTS languages (
    user_id int,
    name Varchar(256),
    PRIMARY KEY (user_id, name),
    FOREIGN KEY (user_id)
      REFERENCES users (id)
)