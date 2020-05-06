const Note = {
	IdCounter: 8, //хранит в себе ID-шник следующей создаваемой карточки
	dragged: null, //элемент карточки которую мы перетаскиваем

	//СОЗДАДИМ ФУНКЦИЮ ДЛЯ РЕДАКТИРОВАНИЯ КАРТОЧКИ/ЗАМЕТКИ + DRAG & DROP
	//при ДВОЙНОМклике на каждую будем добавлять атрибут contenteditable="true" , позволяющий редактировать элемент
	process (noteElement) {
		noteElement.addEventListener('dblclick', function (event) {
		noteElement.setAttribute('contenteditable', 'true')
		noteElement.focus();
		//при этом, будем убирать атрибут DRAGGABLE, у карточки и у ее родительского элемента, (т.е. у колонки)
		//чтобы не перетаскивать заметку или колонку, пока редактируем заметку
		noteElement.removeAttribute('draggable');
		noteElement.closest('.column').removeAttribute('draggable');
	})

	//а по окончании редактирвоания, при потере фокуса, уберем атрибут CONTENTEDITABLE при потере фокуса, 
	noteElement.addEventListener('blur', function (event) {
		noteElement.removeAttribute('contenteditable')
		// и вернем возможность перетаскивания заметки и колонки, когда пропал фокус, 
		// т.е. когда закончили редактировать
		noteElement.setAttribute('draggable', 'true');
		noteElement.closest('.column').setAttribute('draggable', 'true');

		//а также сделаем, что если мы добавили заметку, но ничего в нее не записали, то она удалится
		//если содержимое этого элемента вдруг оказывается равно 0, т.е. содержимое отсутствует
		if (!noteElement.textContent.trim().length) {
			//мы будем удалять заметку
			noteElement.remove();
		}
	})


		//ПЕРЕТАСКИВАНИЕ КАРТОЧКИ. DRAG AND DROP ТЕХНОЛОГИЯ

		//вещаем обработчики событий технологии DRAg & DROP над карточкой/заметкой
		//и передаим в них вторым аргументом, функцию, 
		noteElement.addEventListener('dragstart', Note.dragstart);
		noteElement.addEventListener('dragend', Note.dragend);
		noteElement.addEventListener('dragenter', Note.dragenter);
		noteElement.addEventListener('dragover', Note.dragover);
		noteElement.addEventListener('dragleave', Note.dragleave);
		noteElement.addEventListener('drop', Note.drop);
	},

	//создадим функции которые будут обрабатывать события  технологии DRAg & DROP 
	//сперва выведем в консоль само событие, ивент и контекст THIS т.е. элемент над которым будет происходить это событие
	//для событий DRAGSTART мы переменную Note.dragged будем приравнивать к THIS, чтобы знать какой элемент перетаскиваем
	//а в DRAGEND обратно обнулим 
	// а в остальных событиях - dragenter, dragover, dragleave, drop проверим, если Note.dragged
	// кроме того для DRAGSTART и DRAGEND добавим и удалим CSS класс, который будет скрывать/отображать карточку 
	// после того как мы стали ее тянуть
	
	//DRAGSTART
	dragstart (event) {
		Note.dragged = this
		this.classList.add('dragged')

	},
	
	//DRAGEND
	dragend (event) {
		Note.dragged = null
		this.classList.remove('dragged')

		//пройдем по всем элементам и при окончании драгинга удалим CSS класс UNDER, слегка затемняющий элемент, который мы добавляем в событии DRAGENTER
		document
			.querySelectorAll('.note')
			.forEach( function (x){
				x.classList.remove('under')
			})
	},

	//элементу над которым водим добавим CSS класс UNDER, слегка затемняющий его, а в событии DRAGGED удалим этот класс
	
	//DRAGENTER
	dragenter (event) {
		if (this === Note.dragged) {
			return
		}
		this.classList.add('under')
	},
	
	//DRAGOVER
	dragover (event) {
		event.preventDefault();
		if (this === Note.dragged) {
			return
		}
	},
	
	//DRAGLEAVE
	dragleave (event) {
		if (this === Note.dragged) {
			return
		}
		this.classList.remove('under')
	},

	//DROP
	//выводя в данной функции, в консоль контекст THIS мы понимаем что это тот элемент над которым происходит DROP, 
	//а выводя в данной функции, в консоль переменную Note.dragged мы понимаем что это тот элемент который иы перетаскиваем
	//если эти 2 карточки находятся в одной колонке (один родитель) то это означает что мы просто хотим поменять их местами
	//если колонки (родители разные ), мы хотим перенести карточку из одного столбца в другой
	drop (event) {
		//вызовем здесь STOPPROPAGATION, чтобы если ДРОП сработал над карточкой ,событие не всплыло
		//и точно такой же обработчик событий не сработал и над колонкой
		//т.е. если мы бросаем карточку над колонкой и там есть карточки, то отработает этот ДРОП, 
		//а если нет, то отработает ДРОП колонки (описан в функции колонки выше)
		event.stopPropagation();

		if (this === Note.dragged) {
			return
		}

		//здесь меняем очередность. Если Note.dragged был ниже чем THIS (элемент над которым бросили, то хотим поднять выше)
		//если Note.dragged был выше чем THIS - хотим опустить ниже
		if (this.parentElement === Note.dragged.parentElement) {
			//сперва найдем все заметки в этом столбце и обернем в массив, чтобы был нассив элементов а не NodeList
			const note = Array.from(this.parentElement.querySelectorAll('.note'));
			//и найдем индексы этого массива
			const indexA = note.indexOf(this);
			const indexB = note.indexOf(Note.dragged);

			//и если индекс THIS (т.е. индекс элемента НАД которым бросили) больше чем индекс Note.dragged (КОТОРЫЙ бросили), 
			// иными словами бросаемый элемент расположен выше того НАД которым бросили, то
			// используем метод INSERTBEFORE и ставим перетаскиваемый элемент после того над которым бросили
			if (indexA < indexB) {
				this.parentElement.insertBefore(Note.dragged, this);
			}
			//иначе, - если бросаемый элемент был расположен НИЖЕ того НАД которым бросили, то ставим перед следующим соседом того над которым бросили
			else {
				this.parentElement.insertBefore(Note.dragged, this.nextElementSibling);
				// this.parentElement.insertBefore(Note.dragged, this);
			}
		}
		//здесь перемещаем элемент между столбцами
		else {
			this.parentElement.insertBefore(Note.dragged, this);
		}
	}

}

