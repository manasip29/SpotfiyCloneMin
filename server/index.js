const express = require("express");
const mysql = require("mysql")
const cors = require('cors')
const app = express();
const multer = require('multer')


app.use(express.json())
app.use(express.static("public"))
app.use(cors())
app.use('/public', express.static('public'))


app.listen(3001, () => {
    console.log("Server is running perfectly!!")
})


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
})


var upload = multer({ storage: storage }).single('file')



app.post('/create', (req, res) => {
    var imgsrc = ""
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err)
        } else if (err) {
            return res.status(500).json(err)
        }
        imgsrc = 'http://127.0.0.1:3001/public/' + req.file.filename
        let data = req.body
        console.log(req.body.song, data.song)
        db.query(
            "INSERT INTO SONGS(Artwork,Song,Rel_date,ArtistID,Rating) VALUES (?,?,?,?,?)",
            [imgsrc, data.song, data.rel_date, data.artistId, data.ratings],
            (err, result) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log(result)
                }
            }
        )

    })
})



app.post('/addArtist', (req, res) => {
    let data = req.body
    console.log(data)
    db.query(
        "INSERT INTO artist(Name,DOB,Bio) VALUES (?,?,?)",
        [data.Name, data.DOB, data.Bio],
        (err, result) => {
            if (err) {
                console.log(err)
            } else {
                res.send(result)
            }
        }
    )
})




app.get('/getArtist', (req, res) => {
    db.query(
        "SELECT * FROM artist", (err, result) => {
            if (err)
                console.log(err)
            else
                res.send(result)
        }
    )
})


app.get('/getSongsOf/:id', (req, res) => {

    db.query(
        "SELECT * FROM songs where ArtistID=" + req.params.id, (err, result) => {
            if (err)
                console.log(err)
            else
                res.send(result)
        }
    )
})


app.get("/TopArtist", (req, res) => {
    db.query(
        "select AVG(songs.Rating) as Avg, songs.ArtistID, artist.Name, artist.DOB from songs left join artist on songs.ArtistId = artist.Id  Group by ArtistID ORDER BY AVG(songs.Rating) DESC LIMIT 10", (err, result) => {
            if (err)
                console.log(err)
            else {
                console.log(result)
                res.send(result)
            }
        }

    )
})


app.post('/review', (req, res) => {
    let data = req.body
    db.query(
        "UPDATE songs SET Rating = " + data.star + " WHERE ID = " + data.id,
        (err, result) => {
            if (err)
                console.log(err)
            else {
                res.send({"rating":data.star})
            }
        }
    )
})

app.get('/getRating/:id',(req,res)=>{
      
    db.query(
        "SELECT * from songs where Id ="+ req.params.id, (err, result) => {
            if (err)
                console.log(err)
            else
                res.send(result)
        }
    )
})

app.get('/getSongs', (req, res) => {
    db.query(
        "select * from songs left join artist on songs.ArtistId = artist.Id ORDER BY songs.Rating DESC LIMIT 10", (err, result) => {

            if (err)
                console.log(err)
            else
                res.send(result)
        }
    )
})


const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "",
    database: "spotify" //Database Name
})