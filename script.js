//переменные для следующей карточки и колонки
//let Note.IdCounter = 8; //хранит в себе ID-шник следующей создаваемой карточки
let columnIdCounter = 4; //хранит в себе ID-шник следующей создаваемой колонки
//let Note.dragged = null; //элемент карточки которую мы перетаскиваем

//СОЗДАДИМ ФУНКЦИЮ ДЛЯ СОЗДАНИЯ НОВОЙ КАРТОЧКИ/ЗАМЕТКИ
function columnProcess (columnElement) {

	//внутри колонки найдем кнопку добавления новой карточки по атрибуту- DATA-ACTION-ADDNOTE
	const spanAction_addNote = columnElement.querySelector('[data-action-addNote]')

	//и по клику на эту кнопку вызовем функцию, чтобы обратобать событие при клике
	//при клике будем создавать новую карточку и добавлять ее в общий список той колонки по которой кликнули
	spanAction_addNote.addEventListener('click', function (event){
		const noteElement = document.createElement('div');
		noteElement.classList.add('note');
		noteElement.setAttribute('draggable', 'true');
		noteElement.setAttribute('data-note-id', Note.IdCounter);

		//для каждой новой заметки увеличим счетчик переменной хранящей ID заметки
		Note.IdCounter++;
		
		//добавим созданную карточки в конец колонки
		columnElement.querySelector('[data-notes]').append(noteElement);

		//сделаем, чтобы при добавлении новой карточки мы сразу начинали ее редактировать
		noteElement.setAttribute('contenteditable', 'true');
		noteElement.focus();

		//для вновь создаваемой колонки, вызовем функцию, которая обрабатывает редактирование карточки (сама ф-я описана ниже)
		Note.process(noteElement);

	})

	// добавим/уберем возможность редактирвоания заголовка карточки по клику
	const headerElement = columnElement.querySelector('.column-header');
	
	headerElement.addEventListener('dblclick', function (event) {
		headerElement.setAttribute('contenteditable', 'true')
		headerElement.focus()
	})

	headerElement.addEventListener('blur', function (event) {
		headerElement.removeAttribute('contenteditable', 'false')
	})

	//ОБРАБОТАЕМ СОБЫТИЕ DROP У КОЛОНКИ, ДЛЯ СБРОСА ЗАДАЧИ ДАЖЕ ЕСЛИ У КОЛОНКИ НЕТ СВОЕЙ ЗАДАЧИ
	//сперва для события dragover колонки отменим стандартное поведение, по аналогии с ДРОПОМ карточки
	columnElement.addEventListener('dragover', function (event){
		event.preventDefault()
	})

	columnElement.addEventListener('drop', function (event){
		//если бросаем элемент над колонкой, в которой нет своих задач, 
		if (Note.dragged) {
			//обращаемся к колонке, затем к DIV с атрибутом DATA-NOTES - это как раз DIV колонки перед кнопкой ДОБАВИТЬ КАРТОЧКУ. 
			//и в него мы вставляем перетаскиваемую карточку.
			return columnElement.querySelector('[data-notes]').append(Note.dragged);
		}
	})
}



//СОЗДАЕМ НОВУЮ КАРТОЧКУ
//найдем все колонки по классу COLUMN
//переберем их методом FOREACH и для каждой колонки будем вызывать функцию создания новой карточки
document
	.querySelectorAll('.column')
	.forEach(columnProcess);

//СОЗДАЕМ НОВУЮ КОЛОНКУ
//найдем кнопку и навесим на кнопку обработчик. при нажатии на которую будет создается новая колонка.
//по клику создаем DIV элемент колонки, из разметки, с классом COLUMN и другими атрибутами
document
	.querySelector('[data-action-addColumn]')
	.addEventListener('click', function (event) {
		//создаем колонку (COLUMNELEMENT) и атрибуты 
		const columnElement = document.createElement('div');
		columnElement.classList.add('column');
		columnElement.setAttribute('draggable', 'true');
		columnElement.setAttribute('data-column-id', columnIdCounter);

		//добавляем в колонку HTML разметку (формально можно все элементы также создать, как делали выше, но есть же INNERHTML)
		columnElement.innerHTML = 
			`<p class="column-header" contenteditable="true">В плане</p>
			<div data-notes></div><p class="column-footer">
				<span data-action-addNote class="action">+ Добавить карточку</span>
			</p>` 
		
		//для каждой новой колонки увеличим счетчик переменной хранящей ID колонки
		columnIdCounter++;
		console.log(columnIdCounter);
		
		//добавим созданную карточки в конец колонки
		document.querySelector('.columns').append(columnElement);

		//для каждой колонки будем вызывать функцию создания новой карточки
		columnProcess (columnElement);
	})

//РЕДАКТИРОВАНИЕ КАРТОЧКИ
//Находим ВСЕ карточки по классу (NOTE), полученный массив перебираем FOREACH 
//и для каждой колонки (по аналогии с созданием карточки) будем вызывать функцию редактирования карточки
document
	.querySelectorAll('.note')
	.forEach(Note.process)

