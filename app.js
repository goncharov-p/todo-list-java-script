const express = require('express');
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const cors = require('cors');
const { header } = require('express/lib/request');
const app = express();

const { Schema } = mongoose;

const taskScheme = new Schema({
  text: String,
  isCheck: Boolean
});

const url = 'mongodb+srv://PavelG:Goncharov_123@cluster0.e0i61.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
mongoose.connect(url, { useUnifiedTopology: true });

const Task = mongoose.model('tasks', taskScheme)

app.use(cors());
app.use(bodyParser.json());

app.get('/Alltasks', (req, res) => {
  Task.find().then(result => {
    res.send({ data: result });
  });
});

app.post('/createTask', (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  const body = req.body;
  if ((body.hasOwnProperty('text') || body.hasOwnProperty('isCheck'))) {
    const task = new Task({
      text: body.text,
      isCheck: body.isCheck
    });
    task.save().then(result => {
      res.send(result);
    }).catch(err => console.log(err));
  }
})

app.delete('/deleteTask/', (req, res) => {
  const id = req.query.id;
  if (id) {
    Task.deleteOne({ _id: id }).then(result => {
      res.send("Delete")
    })
  };
});

app.patch('/updateTask', (req, res) => {
  const body = req.body;
  const id = req.body.id;
  const filter = { _id: id };
  console.log(body);
  if (body.hasOwnProperty("isCheck") && body.hasOwnProperty("id")) {
    
    console.log(body.id);
    Task.updateOne(filter, {
      $set: { isCheck: body.isCheck }
    }).then(result => {
        //res.send('Checkbox changed')
        res.send(result)
      })
  } else if (body.hasOwnProperty("id") && body.hasOwnProperty("text")) {
    let r = body.text;   
   
    
     Task.updateOne(filter, {
        $set: { text: r }
      }).then(
        result => {
          res.send(result)
        }
      )
        .catch(error => { res.send(error) })
    
  }



});

app.patch('/UpdateTaskInfo', (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  const body = req.body;
  if (body.isCheck && body.id) { } else if (body.isCheck && body.text) { }
  Task.updateOne({
    $set: { isCheck: body.isCheck },
    _id: body.id
  }).then(result => {
    res.send('Checkbox changed')
    res.send({ data: result })
  })
})

app.listen(8000, () => {
  console.log('Example app listening on port 8000!')
});