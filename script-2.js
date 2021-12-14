//let allTasks = JSON.parse(localStorage.getItem('tasks')) || [];\
let allTasks = [];
let valueInput = '';
let input = null;
let activeEditTask = null;

const refrashBd = async() => {
  const resp = await fetch('http://localhost:8000/allTasks', {
    method: 'GET'
  });
  let result = await resp.json();
  allTasks=result.data;
  render();
 
}

window.onload = async function init () {
    input = document.getElementById('add-task');
    input.addEventListener('change', updateValue);
 refrashBd();
   
}
 
 
onClickButton = async() => {
    const resp = await fetch('http://localhost:8000/createTask', {
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
    let result = await resp.json()
    .then((resp) => {
      allTasks.push(resp);
    })
    valueInput = '';
    input.value = '';

    render();
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
  console.log("render");
  while(content.firstChild){ // пишем цикл для того, чтобы не дублировался первый элемент
    content.removeChild(content.firstChild);// удаляем дочерный элемент контента
  }
  
    allTasks.sort((a,b) => a.isCheck > b.isCheck ? 1 : a.isCheck < b.isCheck ? -1: 0);
    allTasks.map((item, index) => {
    const container = document.createElement('div'); // создаём контейнер для нашего таска и для этого мы создаем див элемент
    container.id = `task-${index}`;
    container.className = 'task-container';
    // const checkbox = document.createElement('input'); // создаем переменную чекбокс и задаём ей тип инпут
    // checkbox.type = 'checkbox'; // задаем тип для инпута.
    // checkbox.checked = item.isCheck; // задаём чекбоксу свойство проверен ли он.
    // checkbox.onchange = function () { //добавляем изменение при нажатии на чекбокс
    //   onChangeCheckbox(item.id);
    // };
    // container.appendChild(checkbox); //добавляем в наш контейнер чекбокс.
   
   
 
    if(item._id === activeEditTask) {//если индекс равен едит таск выполняем
   
      const inputTask = document.createElement('input');//создаем переменную в нее записываем инпут
      inputTask.type = 'text';//указываем что будем хранить текст
      inputTask.value = item.text;//сохраняем в инпут введенный текст
      inputTask.addEventListener('change',updateTaskText);//при событии вызывыаем функцию
      inputTask.addEventListener('blur', doneEditTask);//при фокусе вызываем функцию
      container.appendChild(inputTask)//создаем элемент
    } else{
      const text = document.createElement('p');//создаем элемент текст сохраняем в него параграф
      text.innerText = item.text//созраняем в него значение
      text.className = item.isCheck ? 'done-text' : 'not-done-text';//задаем ему класс
      container.appendChild(text);//добавляем элемент 
      const checkbox = document.createElement('input'); // создаем переменную чекбокс и задаём ей тип инпут
      checkbox.type = 'checkbox'; // задаем тип для инпута.
      checkbox.checked = item.isCheck; // задаём чекбоксу свойство проверен ли он.
      checkbox.onchange = function () { //добавляем изменение при нажатии на чекбокс
      onChangeCheckbox(item._id, item.isCheck);
    };
    container.appendChild(checkbox); //добавляем в наш контейнер чекбокс.
    }
 
    if(!item.isCheck) { //проверяем и если не стоит галочка
      if (item._id === activeEditTask) {//если индекс равен едиттаск
        const imageDone = document.createElement('img');//создаем элемент изображение
        imageDone.src = 'images/check-mark.png';//заполняем иконкой галочки
        imageDone.onclick = function () {//при нажатии выполняем
          doneEditTask();
        };
        container.appendChild(imageDone);
      } else {
        const imageEdit = document.createElement('img');
        imageEdit.src = 'images/editing.png'//заполняем иконкой  карандаш
        imageEdit.onclick = function () {
          activeEditTask = item._id;
          render();
        };
        container.appendChild(imageEdit)
      }
 
    }
     
    deleteAll=()=>{
        allTasks.splice(0,(allTasks.length))
        render();
    }
 
    const imageDelete = document.createElement('img');
    imageDelete.src = 'images/close.png';
    imageDelete.onclick = function () {
      onDeleteTask(item._id);
    }
    container.appendChild(imageDelete);
 
    content.appendChild(container);
  });  
}
 
onChangeCheckbox = async(id,isChekt) => {
 // allTasks[index].isCheck = !allTasks[index].isCheck;
  const resp = await fetch(`http://localhost:8000/updateTask`, {
    method: 'PATCH',
    headers: {
      'Content-Type':'application/json;charset=utf-8',
      'Access-Control-Allow-Origin':'*'
    },
    body: JSON.stringify({
      id: id,
      isCheck: !isChekt       
    })
  });
  refrashBd();
}
 
onDeleteTask = async (index) => {
  const resp = await fetch(`http://localhost:8000/deleteTask?id=${index}`, {
    method: 'DELETE',
  });
  refrashBd();
}
 
updateTaskText = async (event) => {
  // allTasks[activeEditTask].text = event.target.value;// вводимое значение. 
  // console.log(allTasks[activeEditTask].text);
  // console.log(event.target.value);
  console.log(activeEditTask, event.target.value);
  const resp = await fetch(`http://localhost:8000/updateTask`, {
    method: 'PATCH',
    headers: {
      'Content-Type':'application/json;charset=utf-8',
      'Access-Control-Allow-Origin':'*'
    },
    body: JSON.stringify({
      id: activeEditTask,
      text: event.target.value,     
    })
  });
  // let result = await resp.json();
  // console.log(result);
  // allTasks=result.data;
 // localStorage.setItem('tasks',JSON.stringify(allTasks));
 refrashBd();
}
 
doneEditTask = () => {
  activeEditTask = null;
  render();
}
