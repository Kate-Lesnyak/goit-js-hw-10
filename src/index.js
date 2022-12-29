// import { fetchCountries } from './js/fetch-countries';

// var debounce = require('lodash.debounce');
// import Notiflix from 'notiflix';

// Notify.info('Too many matches found. Please enter a more specific name.');
// Notify.failure('Oops, there is no country with that name');

import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;


const refs = {
  searchBox: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
}

console.dir(refs.searchBox);


refs.searchBox.addEventListener('input', debounce(onSearchCountryInput, DEBOUNCE_DELAY));

function onSearchCountryInput(e) {
  e.preventDefault();

  // const {
  // } = e.currentTarget.elemengts;

}

const BASE_URL = 'https://restcountries.com/v3.1';

function fetchCountries() {
  return fetch(`${BASE_URL}/name/ukraine?fields=name,capital,population,flags,languages`)
    // return fetch(`${BASE_URL}/all`)
    .then(resp => {
      if (!resp.ok) {
        throw new Error(resp.statusText)
      }
      return resp.json()
    })
    .then(name => {
      console.log(name)
    })
    .catch(Notify.failure('Oops, there is no country with that name'));
}

fetchCountries();

function renderCountryItem(nameCountry) {
  const markup = countryItem(nameCountry);
  refs.countryList.innerHTML(markup);
}

renderCountryItem();