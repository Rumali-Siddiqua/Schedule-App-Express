CREATE TABLE IF NOT EXISTS users (
    id serial primary key,
    firstname text not null,
    lastname text not null,
    email text not null,
    password text not null
);    