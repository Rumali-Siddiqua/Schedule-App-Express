CREATE TABLE IF NOT EXISTS schedules (
    id serial primary key,
    user_id integer not null,
    day integer not null check(day >=1 and day <=7),
    start_at time  not null,
    end_at time not null
);    