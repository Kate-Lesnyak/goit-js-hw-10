// Задание - поиск стран

// Создай фронтенд часть приложения поиска данных о стране по её частичному или полному имени.Посмотри демо видео работы приложения.

// HTTP - запросы
// Используй публичный API Rest Countries, а именно ресурс name, возвращающий массив объектов стран удовлетворивших критерий поиска.Добавь минимальное оформление элементов интерфейса.

// Напиши функцию fetchCountries(name) которая делает HTTP - запрос на ресурс name и возвращает промис с массивом стран - результатом запроса.Вынеси её в отдельный файл fetchCountries.js и сделай именованный экспорт.

// Поле поиска
// Название страны для поиска пользователь вводит в текстовое поле input#search - box.HTTP - запросы выполняются при наборе имени страны, то есть по событию input.Но, делать запрос при каждом нажатии клавиши нельзя, так как одновременно получится много запросов и они будут выполняться в непредсказуемом порядке.

// Необходимо применить приём Debounce на обработчике события и делать HTTP - запрос спустя 300мс после того, как пользователь перестал вводить текст.Используй пакет lodash.debounce.

// Если пользователь полностью очищает поле поиска, то HTTP - запрос не выполняется, а разметка списка стран или информации о стране пропадает.

// Выполни санитизацию введенной строки методом trim(), это решит проблему когда в поле ввода только пробелы или они есть в начале и в конце строки.

//   Интерфейс
// Если в ответе бэкенд вернул больше чем 10 стран, в интерфейсе пояляется уведомление о том, что имя должно быть более специфичным.Для уведомлений используй библиотеку notiflix и выводи такую строку "Too many matches found. Please enter a more specific name.".

// Если бэкенд вернул от 2 - х до 10 - х стран, под тестовым полем отображается список найденных стран.Каждый элемент списка состоит из флага и имени страны.

// Если результат запроса это массив с одной страной, в интерфейсе отображается разметка карточки с данными о стране: флаг, название, столица, население и языки.

// ВНИМАНИЕ
// Достаточно чтобы приложение работало для большинства стран.Некоторые страны, такие как Sudan, могут создавать проблемы, поскольку название страны является частью названия другой страны, South Sudan.Не нужно беспокоиться об этих исключениях.

// Обработка ошибки
// Если пользователь ввёл имя страны которой не существует, бэкенд вернёт не пустой массив, а ошибку со статус кодом 404 - не найдено.Если это не обработать, то пользователь никогда не узнает о том, что поиск не дал результатов.Добавь уведомление "Oops, there is no country with that name" в случае ошибки используя библиотеку notiflix.

// ВНИМАНИЕ
// Не забывай о том, что fetch не считает 404 ошибкой, поэтому необходимо явно отклонить промис чтобы можно было словить и обработать ошибку.


import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './js/fetch-countries';

const DEBOUNCE_DELAY = 300;

const refs = {
  searchBox: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
  body: document.body,
}

refs.searchBox.addEventListener('input', debounce(onSearchCountryInput, DEBOUNCE_DELAY));

addBodyStyles();

function onSearchCountryInput(e) {
  const nameCountry = e.target.value.trim();
  clearCountryList();
  clearCountryInfo();

  if (!nameCountry) {
    return;
  }

  if (nameCountry) {
    fetchCountries(nameCountry)
      .then(data => {
        if (data.length > 10) {
          return Notify.info('Too many matches found. Please enter a more specific name.');
        }

        // if (data.length > 1 && data.length <= 10) {
        //   renderCountryList(data);
        // }

        renderCountryList(data);

        if (data.length === 1) {
          clearCountryList();
          renderCountryInfo(data);
        }
      })

      // * 2 вариант
      // .catch(error => Notify.failure('Oops, there is no country with that name'));

      // .catch(error => Notify.failure(`${error}`));
      .catch(onFetchError);
  }
}

function onFetchError(error) {
  return Notify.failure(`${error}`);
}

function clearCountryList() {
  refs.countryList.innerHTML = '';
}

function clearCountryInfo() {
  refs.countryInfo.innerHTML = '';
}

function addBodyStyles() {
  const bodyStyles = `<style>
    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    p {
    margin: 0;
    padding: 0;
  }

ul {
    margin: 0;
    padding: 0;
    list - style: none;
  }

.img {
    display: block;
    max - width: 100 %;
    height: auto;
  }
  </style>`;

  refs.body.insertAdjacentHTML('afterbegin', bodyStyles);
}

function renderCountryInfo(arrCountryInfo) {
  const markup = arrCountryInfo.map(({ flags: { svg }, name: { official }, capital, languages, population }) =>
    `<div class="country-info__wrapper"><img src="${svg}" alt="flag" width="50">
  <h2 class="country-info__title">${official}</h2></div>
  <p class="country-info__text"><b>Capital:</b> ${capital.join(', ')}</p>
  <p class="country-info__text"><b>Population:</b> ${population}</p>
  <p class="country-info__text"><b>Languages:</b> ${Object.values(languages).join(', ')}</p>`).join('');

  refs.countryInfo.innerHTML = markup;

  const countryInfoStyles = `<style>
.country-info__wrapper {
  display: flex;
  align-items: center;
  column-gap: 20px;
  margin-bottom: 10px;
}

.country-info__title {
  font-size: 24px;
}

.country-info__text {
  margin-bottom: 10px;
}
</style>`;

  refs.countryInfo.insertAdjacentHTML('afterbegin', countryInfoStyles);
}


function renderCountryList(arrCountryList) {
  const markup = arrCountryList.map(({ flags: { svg }, name: { official } }) =>
    ` <li class="country-list__item">
      <img src="${svg}" alt="flag" width="30">
      <h2 class="country-list__item-title">${official}</h2></li>`).join('');

  refs.countryList.innerHTML = markup;

  const countryListStyles = `<style>
.country-list__item {
  display: flex;
  align-items: center;
  column-gap: 10px;
  row-gap: 30px;
  }

.country-list__item:not(:last-child) {
  margin-bottom: 10px;
}

.country-list__item-title {
  font-size: 15px;
}
</style>`;

  refs.countryList.insertAdjacentHTML('afterbegin', countryListStyles);
}

