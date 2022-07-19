CREATE TABLE IF NOT EXISTS users (
    id int PRIMARY KEY,
    name Varchar(256),
    login Varchar(256) UNIQUE,
    location Varchar(256),
    hireable Varchar(256),
    followers int,
    following int,
    public_repos int,
    created_on TIMESTAMP NOT NULL
)