let allTasks = [];
let valueInput = '';
let input = null;
let activeEditTask = null;
const link = 'http://localhost:8000';

const getTasks = async() => {
  const resp = await fetch(`${link}/allTasks`, {
    method: 'GET'
  });
  const result = await resp.json();
  allTasks=result.data;
  render();
 
}

window.onload = async function init () {
    input = document.getElementById('add-task');
    input.addEventListener('change', updateValue);
    getTasks();
   
}
 
 
onClickButton = async() => {
  if (valueInput) {
    const resp = await fetch(`${link}/createTask`, {
      method: 'POST',
      headers: {
        'Content-Type':'application/json;charset=utf-8',
        'Access-Control-Allow-Origin':'*'
      },
      body: JSON.stringify({
        text:valueInput,
        isCheck:false
      })
    });
    const result = await resp.json()
    .then((res) => { 
      allTasks.push(res);
      valueInput = '';
      input.value = '';
      render();
    });
  } else {
    alert('Поле не может быть пустым')
  }

}
 
onClickButtonDelete = () => {
    allTasks.splice(0, allTasks.length);
    render()
} 
 
updateValue = (event) => {
    valueInput = event.target.value;
}
 
render =  () => {
  const content = document.getElementById('content-page');

  while(content.firstChild){ 
    content.removeChild(content.firstChild); 
  }
    allTasks
    .sort((a,b)=>{
      if (a.isCheck === b.isCheck) return 0;
      return (a.isCheck > b.isCheck) ? 1 : -1
      })
    .map((item, index) => {
    const container = document.createElement('div'); 
    container.id = `task-${item._id}`;
    container.className = 'task-container';

    if(item._id === activeEditTask) {
   
      const inputTask = document.createElement('input');
      inputTask.type = 'text';
      inputTask.value = item.text;
      inputTask.addEventListener('change', (e) => updateTaskText(e, item._id));
      inputTask.addEventListener('blur', doneEditTask);
      container.appendChild(inputTask)
    } else{
      const text = document.createElement('p');
      text.innerText = item.text
      text.className = item.isCheck ? 'done-text' : 'not-done-text';
      container.appendChild(text);
      const checkbox = document.createElement('input'); 
      checkbox.type = 'checkbox'; 
      checkbox.checked = item.isCheck; 
      checkbox.onchange = () => { 
      onChangeCheckbox(item._id, item.isCheck);
    };
    container.appendChild(checkbox); 
    }
 
    if(!item.isCheck) { 
      if (item._id === activeEditTask) {
        const imageDone = document.createElement('img');
        imageDone.src = 'images/check-mark.png';
        imageDone.onclick = () => {
          doneEditTask();
        };
        container.appendChild(imageDone);
      } else {
        const imageEdit = document.createElement('img');
        imageEdit.src = 'images/editing.png'
        imageEdit.onclick = () => {
          activeEditTask = item._id;
          render();
        };
        container.appendChild(imageEdit)
      }
 
    }
     
    const imageDelete = document.createElement('img');
    imageDelete.src = 'images/close.png';
    imageDelete.onclick = () => {
      onDeleteTask(item._id,index);
    }
    container.appendChild(imageDelete);
    content.appendChild(container);
  });  
}

 
onChangeCheckbox = async(id,isCheck) => {
  const resp = await fetch(`${link}/updateTask`, {
    method: 'PATCH',
    headers: {
      'Content-Type':'application/json;charset=utf-8',
      'Access-Control-Allow-Origin':'*'
    },
    body: JSON.stringify({
      id: id,
      isCheck: !isCheck       
    })
  });
  if(resp){
    allTasks = allTasks.map(item => {
      const newTask = {...item};
      if (item._id === id) {
        newTask.isCheck= !isCheck;
      }
      return newTask
    })
    render();
  }
}
 
onDeleteTask = async (idToDel) => {
  const resp = await fetch(`${link}/deleteTask?id=${idToDel}`, {
    method: 'DELETE',
  });

  if(resp){
    allTasks.forEach((item,index) => {
      if (item._id === idToDel) {
        allTasks.splice(index,1);
      }
      return allTasks
    })
    render();
  }
}
 
updateTaskText = async (event, id) => {
  const resp = await fetch(`${link}/updateTask`, {
    method: 'PATCH',
    headers: {
      'Content-Type':'application/json;charset=utf-8',
      'Access-Control-Allow-Origin':'*'
    },
    body: JSON.stringify({
      id: id,
      text: event.target.value,     
    })
  });
  if(resp){
    allTasks = allTasks.map(item => {
      const newTask = {...item};
      if (item._id === id) {
        newTask.text = event.target.value
      }
      return newTask
    })
    render();
  }
}
 
doneEditTask = () => {
  activeEditTask = null;
  render();
}
