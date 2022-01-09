const express = require('express')
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express()
const port = 3000

const url = 'mongodb+srv://Nazim-Nasser:urlmoviedb@cluster0.v2ooh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(bodyParser.json());


const moviesSchema = new mongoose.Schema({
    title:{
        type: String,
        require: true
    },
    year:{
        type: Number,
        require: true
    },
    rating:{
        type: Number,
        default: 4
    }
}, {versionKey: false})

var movies = mongoose.model('movies', moviesSchema );

// const movies = [
//     { title: 'Jaws', year: 1975, rating: 8 },
//     { title: 'Avatar', year: 2009, rating: 7.8 },
//     { title: 'Brazil', year: 1985, rating: 8 },
//     { title: 'الإرهاب والكباب‎', year: 1992, rating: 6.2 }
// ]

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
 
// route ID
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

// route add the movie by title, year and rating
app.post("/movies/add", (req, res) => {

    let title = req.query.title,
        year = req.query.year,
        rating = req.query.rating;

    if(title && year && year.length == 4 && !isNaN(year)){
        movies.create({
            title : title,
            year : year,
            rating : rating && !isNaN(rating) ? rating : 4
        }).then(() => {
            movies.find()
            .then(moviesList =>
                res.send({status:200, data: moviesList})
            ).catch(err => 
                  console.log('Error: The Movies list not found')
            )
        })
        // if(rating && !isNaN(rating)) {
        //     movies.push({title: title, year: year, rating: rating})
        //     res.send({status:200, data: movies})
        // }else{
        //     rating = 4
        //     movies.push({title: title, year: year, rating: rating})
        //     res.send({status:200, data: movies})
        // }
    }else{
        res.status(403).send({status:403, error:true, message:'you cannot create a movie without providing a title and a year'})
    }
})

// route get the movie
app.get("/movies/read", (req, res) => {
    movies.find()
        .then(moviesList =>
            res.send({status:200, data: moviesList})
        ).catch(err => 
              console.log('Error: The Movies list not found')
        )

})

// route get the movie by date
app.get("/movies/read/by-date", (req, res) => {

    // const sortByYear = movies.sort((a, b) => (a.year > b.year) ? 1 : -1)
    movies.find()
        .then(byDate => 
            res.send({status:200, data: byDate.sort((a, b) => (a.year > b.year) ? 1 : -1)})
            ).catch(err => console.log('error'))
})

// route get the movie by rating
app.get("/movies/read/by-rating", (req, res) => {

    // const sortByYear = movies.sort((a, b) => (a.rating > b.rating) ? -1 : 1)
    movies.find()
        .then(byRating => 
            res.send({status:200, data: byRating.sort((a, b) => (a.rating > b.rating) ? -1 : 1)})
            ).catch(err => console.log('error'))
})

// route get the movie by title
app.get("/movies/read/by-title", (req, res) => {

    // const sortByYear = movies.sort((a, b) => (a.title > b.title) ? 1 : -1)
    movies.find()
        .then(byTitle => 
            res.send({status:200, data: byTitle.sort((a, b) => (a.title > b.title) ? 1 : -1)})
            ).catch(err => console.log('error'))
})

// route get the movie by ID
app.get("/movies/read/id/:id", (req, res) => {

    const nameById = req.params.id;
    movies.findById(nameById)
    .then(byID => 
        res.send({status:200, data: byID})
    ).catch(err => 
        res.status(404).send({status:404, error:true , message:`The movie ${nameById} does not exist.`})
        )
//     if (nameById >=0 && nameById < movies.length) {

//         const response = {
//             status:200, data: movies[nameById]
//         };

//         res.send(response);
//     }
//     else {
//         const response = {
//             status:404, error:true, message:`the movie ${nameById} does not exist`
//         };


//         res.status(404).send(response);
//     }
})

// route edit the movie
app.put('/movies/update', (req, res) => {

    res.send('Update the data')
});

// route update the movie by id and value
app.put('/movies/update/:id', (req,res) => {

    const updateById = req.params.id
    let title = req.query.title,
        year = req.query.year,
        rating = req.query.rating;
    movies.findById(updateById)
        .then(async updEement => {
            if(title && title != 'undefined'){
                updEement.title = title;
            }
            if(year && !isNaN(year) && year.length === 4){
                updEement.year = year;
            }
            if(rating && !isNaN(rating)){
                updEement.rating = rating
            }
            await updEement.save()
            movies.find()
            .then(moviesList =>
                res.send({status:200, data: moviesList})
            ).catch(err => 
                console.log('Error: The Movies list not found')
            )
        }).catch(err => 
            res.status(404).json({status:404, error:true, message:`The movie ${updateById} does not exist`})
            )
        
    // if(updateById >=0 && updateById < movies.length){
    //     if(title && title != 'undefined'){
    //         movies[updateById].title = title;
    //     }
    //     if(year && !isNaN(year) && year.length === 4){
    //         movies[updateById].year = year;
    //     }
    //     if(rating && !isNaN(rating)){
    //         movies[updateById].rating = rating
    //     }
    //     res.status(200).json({status:200, message:'Ok', data:movies})
    // }else{
    //     res.status(404).json({status:404, error:true, message:`The movie ${updateById} does not exist`})
    // }
})

// route delete the movie
app.delete('/movies/delete', (req, res) => {

    res.send('Delete the movie')
});

// route delete the movie by id
app.delete('/movies/delete/:id', (req, res) => {

    const removeById = req.params.id

    movies.remove({_id: removeById}).then(() => {
        movies.find()
        .then(moviesList =>
            res.send({status:200, data: moviesList})
        ).catch(err => 
              console.log('Error: The Movies list not found')
        )
    }).catch(err => 
        res.status(404).send({status:404, error:true, message: `the movie ${removeById} does not exist`})
        )

    // if (removeById >=0 && removeById < movies.length) {
    //     movies.splice(removeById, 1);
    //     const response = {
    //         status:200, data: movies
    //     };

    //     res.send(response);
    // }
    // else {
    //     const response = {
    //         status:404, error:true, message: `the movie ${removeById} does not exist`
    //     };


    //     res.status(404).send(response);
    // }
});

app.listen(port)