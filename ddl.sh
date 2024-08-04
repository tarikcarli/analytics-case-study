#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
	CREATE TABLE users(
        id serial PRIMARY KEY,
        name text,
        created_at timestamp default now()       
    );
    CREATE TABLE books(
        id serial PRIMARY KEY,
        name text,
        score real default -1,
        created_at timestamp default now()        
    );
    CREATE TABLE borrow_books(
        id serial PRIMARY KEY,
        user_id integer,
        book_id integer,
        created_at timestamp default now()  
    );
    CREATE TABLE borrow_books_history(
        id serial PRIMARY KEY,
        user_id integer,
        book_id integer,
        score real,
        created_at timestamp default now()    
    );
EOSQL
