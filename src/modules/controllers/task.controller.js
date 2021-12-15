const Tasks = require('../../db/models/task/index')

module.exports.getAllTasks = (req, res) => {
  Task.find().then(result => {
    res.send({ data: result });
  }).catch(err => console.log(err));
};

module.exports.createNewTask = (req, res) => {
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
}

module.exports.changeTaskInfo = (req, res) => {
  const body = req.body;
  if (body.hasOwnProperty('id') && (body.hasOwnProperty('text') || body.hasOwnProperty('isCheck'))) {
    tasks.forEach((item, i) => {
      if(item.id === body.id) {
        for(let key in body) {
          tasks[i][key] = body[key];
        }
      }
    });
    task.save().then(result => {
      res.send(result);
    }).catch(err => res.send(err));
  }
};

module.exports.deleteTask = (req, res) => {
  if (!req.query.id) return res.status(422).send('Error! Params not correct');
  
  const task = tasks.filter(item => item.id === req.query.id);
  if (task.length) {
    tasks.forEach((item, i) => {
      if(item.id === req.query.id) {
        tasks.splice(i, 1);
      }
    });
    res.send({data: tasks});
  } else {
    res.status(404).send('Task not found');
  }  
}

module.exports.deleteTask = (req, res) => {
  const id = req.query.id;
  if (id) {
    Task.deleteOne({ _id: id }).then(result => {
      res.send("Delete")
    }).catch(err => {
      res.send(err);
    })
  };
};

module.exports.changeTaskInfo = (req, res) => {
  const body = req.body;
  const id = req.body.id;
  const selector = { _id: id };
  
if(body.hasOwnProperty('id') && (body.hasOwnProperty('text') || body.hasOwnProperty('isCheck'))){
  let newText = body.text;

  Task.updateOne(selector, {
    $set: {isCheck:body.isCheck,
            text: newText}
    }).then(result => {
        res.send(result)
    }).catch(err => {
        res.send(err)
      })
  } 
}
