const express = require('express')
const app = express()
const port = 3000

const movies = [
    { title: 'Jaws', year: 1975, rating: 8 },
    { title: 'Avatar', year: 2009, rating: 7.8 },
    { title: 'Brazil', year: 1985, rating: 8 },
    { title: 'الإرهاب والكباب‎', year: 1992, rating: 6.2 }
]

app.get('/', (req, res)=> {
    res.send('ok')
    
})

// route test
app.get('/test', (req, res)=> {
    res.send({status:200, message:"ok"})
})

// route time
app.get('/time', (req, res)=> {
    let data = new Date();
    const time = {status:200, message:`${data.getHours()}:${data.getMinutes()}:${data.getSeconds()}`}
    
    res.send(time)
})
 
// route id
app.get(['/hello', '/hello/:id'], (req, res)=> {
    const id = {status:200, message:`Hello, ${req.params.id || "Unknown"}`}

    res.send(id)
})

// route search
app.get('/search',(req,res) => {
    const search = req.query.s;

    if (typeof search != 'undefined') {
        const response = {
            status:200, message:"ok", data: search
        };

        res.send(response);
    }
    else {
        const response = {
            status:500, error:true, message: "you have to provide a search"
        };


        res.status(500).send(response);
    }
});

// route create the movie
app.post('/movies/create', (req, res) => {

      res.send('Create the movie');
});

// route get the movie
app.get("/movies/read", (req, res) => {

    res.send({status:200, data: movies})
})

// route get the movie by date
app.get("/movies/read/by-date", (req, res) => {
    const sortByYear = movies.sort((a, b) => (a.year > b.year) ? 1 : -1)
    res.send({status:200, data: sortByYear})
})

// route get the movie by rating
app.get("/movies/read/by-rating", (req, res) => {
    const sortByYear = movies.sort((a, b) => (a.rating > b.rating) ? -1 : 1)
    res.send({status:200, data: sortByYear})
})

// route get the movie by title
app.get("/movies/read/by-title", (req, res) => {
    const sortByYear = movies.sort((a, b) => (a.title > b.title) ? 1 : -1)
    res.send({status:200, data: sortByYear})
})

// route edit the movie
app.put('/movies/update', (req, res) => {

    res.send('Update the data')
});

// route delete the movie
app.delete('/movies/delete', (req, res) => {

    res.send('Delete the movie')
});

app.listen(port)