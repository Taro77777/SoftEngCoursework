Sql code for sprint 3
First, make the database (name will be "sheila")
Then copy the following:

(Creates the tables & the keys & shit, then puts in all the test data I made)

CREATE TABLE UsersList (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    realname VARCHAR(50)
);

CREATE TABLE Artist (
    ArtistID INT AUTO_INCREMENT PRIMARY KEY,
    ArtistName VARCHAR(50) NOT NULL,
    Genre VARCHAR(50),
    FOREIGN KEY (ArtistID) REFERENCES UsersList(UserID) 
);

CREATE TABLE Song (
    SongID INT AUTO_INCREMENT PRIMARY KEY,
    SongName VARCHAR(50) NOT NULL,
    SongDate YEAR NOT NULL,
    ArtistID INT NOT NULL,
    FOREIGN KEY (ArtistID) REFERENCES Artist (ArtistID)
);

CREATE TABLE Album (
    AlbumID INT AUTO_INCREMENT PRIMARY KEY,
    AlbumTitle VARCHAR(100) NOT NULL,
    ArtistID INT NOT NULL,
    Genre VARCHAR(50) NOT NULL,
    FOREIGN KEY (ArtistID) REFERENCES Artist(ArtistID)
);

CREATE TABLE Playlist (
    PlaylistID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT NOT NULL,
    Title VARCHAR(100) NOT NULL,
    PlaylistDate YEAR NOT NULL,
    FOREIGN KEY (UserID) REFERENCES UsersList(UserID)
);







INSERT INTO UsersList (username, realname) VALUES ('tarosworld', 'Taro Chamberlain');
INSERT INTO UsersList (username, realname) VALUES ('habsasworld', 'Habsa Sharif');
INSERT INTO UsersList (username, realname) VALUES ('sebsworld', 'Sebastian Moreno');
INSERT INTO UsersList (username, realname) VALUES ('debbiesworld', 'Debbie Abrahams');
INSERT INTO UsersList (username, realname) VALUES ('lukesworld', 'Luke Akehurst');
INSERT INTO UsersList (username, realname) VALUES ('dianesworld', 'Diane Abbott');
INSERT INTO UsersList (username, realname) VALUES ('elliesworld', 'Ellie Chowns');
INSERT INTO UsersList (username, realname) VALUES ('carlasworld', 'Carla Denyer');
INSERT INTO UsersList (username, realname) VALUES ('adriansworld', 'Adrian Ramsay');
INSERT INTO UsersList (username, realname) VALUES ('siansworld', 'Sian Berry');



INSERT INTO Artist (ArtistName, Genre) VALUES ('LISA', 'Rap');
INSERT INTO Artist (ArtistName, Genre) VALUES ('Duran Duran', 'Rock');
INSERT INTO Artist (ArtistName, Genre) VALUES ('Azealia Banks', 'Rap');
INSERT INTO Artist (ArtistName, Genre) VALUES ('Doja Cat', 'Rap');
INSERT INTO Artist (ArtistName, Genre) VALUES ('AOA', 'K-pop');
INSERT INTO Artist (ArtistName, Genre) VALUES ('LE SSERAFIM', 'K-pop');
INSERT INTO Artist (ArtistName, Genre) VALUES ('BLACKPINK', 'K-pop');
INSERT INTO Artist (ArtistName, Genre) VALUES ('TWICE', 'K-pop');
INSERT INTO Artist (ArtistName, Genre) VALUES ('Britney Spears', 'Pop');
INSERT INTO Artist (ArtistName, Genre) VALUES ('YENA', 'K-pop');
INSERT INTO Artist (ArtistName, Genre) VALUES ('Holly Valance', 'Pop');

INSERT INTO Album (AlbumTitle, ArtistID, Genre) VALUES ('Alter Ego', 1, 'Rap');
INSERT INTO Album (AlbumTitle, ArtistID, Genre) VALUES ('DANSE MACABRE', 2, 'Rock');
INSERT INTO Album (AlbumTitle, ArtistID, Genre) VALUES ('Broke with Expensive Taste', 3, 'Rap');
INSERT INTO Album (AlbumTitle, ArtistID, Genre) VALUES ('Hot Pink', 4, 'Rap');
INSERT INTO Album (AlbumTitle, ArtistID, Genre) VALUES ('MINISKIRT', 5, 'K-pop');

INSERT INTO Song (SongName, SongDate, ArtistID) VALUES ('Rockstar', '2025', 1);
INSERT INTO Song (SongName, SongDate, ArtistID) VALUES ('NIGHTBOAT', '2023', 2);
INSERT INTO Song (SongName, SongDate, ArtistID) VALUES ('212', '2014', 3);
INSERT INTO Song (SongName, SongDate, ArtistID) VALUES ('Say So', '2019', 4);
INSERT INTO Song (SongName, SongDate, ArtistID) VALUES ('Miniskirt', '2014', 5);

INSERT INTO Song (SongName, SongDate, ArtistID) VALUES ('CRAZY', '2024', 6);
INSERT INTO Song (SongName, SongDate, ArtistID) VALUES ('JUMP', '2025', 7);
INSERT INTO Song (SongName, SongDate, ArtistID) VALUES ('Heart Shaker', '2017', 8);
INSERT INTO Song (SongName, SongDate, ArtistID) VALUES ('Circus', '2009', 9);
INSERT INTO Song (SongName, SongDate, ArtistID) VALUES ('Catch Catch', '2024', 10);

INSERT INTO Playlist (UserID, Title, PlaylistDate) VALUES (1, 'taros playlist', '2026');
INSERT INTO Playlist (UserID, Title, PlaylistDate) VALUES (2, 'habsas playlist', '2025');
INSERT INTO Playlist (UserID, Title, PlaylistDate) VALUES (3, 'sebs playlist', '2024');
INSERT INTO Playlist (UserID, Title, PlaylistDate) VALUES (4, 'debbies playlist', '2023');
INSERT INTO Playlist (UserID, Title, PlaylistDate) VALUES (5, 'lukes playlist', '2022');

INSERT INTO Playlist (UserID, Title, PlaylistDate) VALUES (6, 'dianes playlist', '2026');
INSERT INTO Playlist (UserID, Title, PlaylistDate) VALUES (7, 'ellies playlist', '2025');
INSERT INTO Playlist (UserID, Title, PlaylistDate) VALUES (8, 'carlas playlist', '2024');
INSERT INTO Playlist (UserID, Title, PlaylistDate) VALUES (9, 'adrians playlist', '2023');
INSERT INTO Playlist (UserID, Title, PlaylistDate) VALUES (10, 'sians playlist', '2022');
