// Фильтрация полей
// В ответе от бэкенда возвращаются объекты, большая часть свойств которых тебе не пригодится.Чтобы сократить объем передаваемых данных добавь строку параметров запроса - так этот бэкенд реализует фильтрацию полей.Ознакомься с документацией синтаксиса фильтров.

// Тебе нужны только следующие свойства:

// name.official - полное имя страны
// capital - столица
// population - население
// flags.svg - ссылка на изображение флага
// languages - массив языков

const BASE_URL = 'https://restcountries.com/v3.1';

function fetchCountries(name) {
  return fetch(`${BASE_URL}/name/${name}?fields=name,capital,population,flags,languages`)
    .then(resp => {
      if (!resp.ok) {

        // * 2 вариант
        // throw new Error(resp.statusText)

        throw new Error('Oops, there is no country with that name')
      }
      return resp.json();
    });
}

export { fetchCountries };


  // * ЕСЛИ ПО УМОЛЧАНИЮ
//   .then(resp => {
//     if (!resp.ok) {
//       throw new Error(resp.statusText)
//     }
//     return resp.json()
//   })

// * ТОГДА добаваить в index.js в catch
// .catch (error => console.log(error))


