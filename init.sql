CREATE USER docker;
CREATE DATABASE test_db;
CREATE DATABASE primary_db;
GRANT ALL PRIVILEGES ON DATABASE test_db TO docker;
GRANT ALL PRIVILEGES ON DATABASE primary_db TO docker;
