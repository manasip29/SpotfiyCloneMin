CREATE TABLE artist (
    ID int NOT NULL AUTO_INCREMENT,
    Name varchar(255) NOT NULL,
    Bio varchar(255),
    DOB date,
    PRIMARY KEY (ID)
);

CREATE TABLE songs (
    Id int NOT NULL AUTO_INCREMENT,
    Artwork varchar(500),
    ArtistID int,
    Rating int,
    Song varchar(200),
    Rel_date date,
    PRIMARY KEY (Id),
    FOREIGN KEY (ArtistID) REFERENCES artist(ID)
);

CREATE TABLE USER (
    ID int NOT NULL AUTO_INCREMENT,
    Name varchar(255) NOT NULL,
    Email varchar(100),
    PRIMARY KEY (ID)
);