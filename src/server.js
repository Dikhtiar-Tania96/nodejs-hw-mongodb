import express from 'express';
const app = express();


app.get('/movies', (req, res) => {
    res.send([
        {
            title: 'Film1',
            year: 2020
        },
        {
            title: 'Film2',
            year: 2022
        },
        {
            title: 'Film3',
            year: 2024
        }
    ])
})
app.listen(8080, ()=>{
console.log('Server started on port 8080')
})