
const inputsCheckbox = document.querySelectorAll('.container-custom-checkbox input'),
      ingredients = document.querySelectorAll('.current-pizza-item'),
      drinks = document.querySelectorAll('.select-drink-item'),
      totalAmount = document.querySelector('.total-amount>.summa'),
      orderBtn = document.querySelector('.typical-btn'),
      modalWindow = document.querySelector('.modal-window'),
      submitBtn = document.querySelector('.modal-window__submit-btn');


/*Modal Window*/
const modalIngredients = document.querySelector('#table-ingredients'),
      modalDrinks = document.querySelector('#table-drinks'),
      modalTotal = document.querySelector('.modal-window__total>span');


/*Добавление ингредиентов*/
const addIngredients = checkboxes => {

    for(let item of checkboxes){
        item.addEventListener('click', event => {

            const checkBoxArray = Array.from(checkboxes);
            const ingredientsArray = Array.from(ingredients);

            //Удаляем два ингредиента из массива - включены по умолчанию
            ingredientsArray.splice(0,2);

            event.target.parentNode.classList.toggle('active');
            //Индекс checkbox
            const index = checkBoxArray.indexOf(event.target);

            //Поиск в массиве ингредиентов по индексу
            ingredientsArray[index].classList.toggle('active');

            calcOrder();
            });
    }
}

addIngredients(inputsCheckbox);


/*Выбор напитков*/
const addDrinks = drinksItems => {
    for(let drink of drinksItems){
        drink.addEventListener('click', event => {
            event.target.parentNode.classList.toggle('active');
            calcOrder();
        });
    }
}

addDrinks(drinks);

/*Вычисление стоимости заказа*/
const calcOrder = () => {
    const ingredients = document.querySelectorAll('.container-custom-checkbox.active');
    const drinks = document.querySelectorAll('.select-drink-item.active');

    const startPrice = 70;//стоимость основы
    const ingredientsPrice = getSumArray(ingredients);
    const drinksPrice = getSumArray(drinks);
    const totalPrice = startPrice + ingredientsPrice + drinksPrice;
    totalAmount.innerHTML = `${totalPrice}&#8372;`;
};


/*Сумма массива*/
const getSumArray = arr => {
    let sum = 0;
        arr.forEach(item =>{
            sum += Number(item.dataset.price);
        });
    return sum;
};

/*Сделать заказ*/
orderBtn.addEventListener('click', () => {
    modalWindow.classList.remove('none');
    prepareModalContent();
});

//Формируем данные результирующих таблиц
const prepareResult = (arr, elem) => {
    if(arr.length){
        for(let item of arr){
            const tr = document.createElement('tr');
            for(let key in item){
                const td = document.createElement('td');
                td.innerText = item[key];
                tr.append(td);
            }
            elem.lastElementChild.append(tr);
        }
    }else{
        //Если пользователь изначально что то не выбрал
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        if(elem.dataset.name === 'ingredient'){
            td.innerHTML = `Основа (тесто + соус)`;
        }else if(elem.dataset.name === 'drink'){
            td.innerHTML = `Без напитков`;
        }
        tr.append(td);
        elem.lastElementChild.append(tr);
    }

}

//Подготовка контента модульного окна
const prepareModalContent = () => {
    //Очищаем таблицы
    modalIngredients.lastElementChild.innerHTML = '';
    modalDrinks.lastElementChild.innerHTML = '';

    const addIngredients = document.querySelectorAll('.container-custom-checkbox.active');
    const addDrinks = document.querySelectorAll('.select-drink-item.active');

    const ingredientList = [];
    const drinkList = [];


    for(let ing of addIngredients){
        ingredientList.push({ingredient: ing.innerText, price: ing.dataset.price});
    }

    for(let drink of addDrinks){
        drinkList.push({drink: drink.dataset.name, price: drink.dataset.price});
    }

    //Формируем контент
    prepareResult(ingredientList, modalIngredients);
    prepareResult(drinkList, modalDrinks);

    modalTotal.innerHTML = `${totalAmount.innerText}`;

    setModalOverflow();
}


//ModalContent scroll params
const setModalOverflow = () => {
    const modalContent = document.querySelector('.modal-window__content');
    if(modalContent.scrollHeight > modalContent.clientHeight){
        modalContent.style.overflowY = 'scroll';
    }else{
        modalContent.style.overflowY = 'auto';
    }

}

/*Работа модального окна*/
/*Отправка данных на сервер*/
submitBtn.addEventListener('click', event => {
    modalWindow.classList.add('none');
});

//Клик по области модального окна вне .modal-window__content
modalWindow.addEventListener('click', () => {
   modalWindow.classList.add('none');
});

modalWindow.querySelector('.modal-window__content').addEventListener('click', event => event.stopPropagation());
/*END Работа модального окна*/
