const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res)=> {
    res.send('ok')
    
})

app.get('/test', (req, res)=> {
    res.send({status:200, message:"ok"})
})

app.get('/time', (req, res)=> {
    let data = new Date();
    const time = {status:200, message:`${data.getHours()}:${data.getMinutes()}:${data.getSeconds()}`}
    
    res.send(time)
})
 
app.get(['/hello', '/hello/:id'], (req, res)=> {
    const id = {status:200, message:`Hello, ${req.params.id || "Unknown"}`}

    res.send(id)
})

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

app.listen(port)