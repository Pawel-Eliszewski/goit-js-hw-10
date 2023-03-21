import './css/styles.css';
import { countryInput, fetchCountries } from './js/fetchCountries'

import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

countryInput.addEventListener(
  'input',
  debounce(() => {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
    if (countryInput.value.trim().length !== 0) {
      fetchCountries()
        .then(name => renderCountries(name))
        .catch(error =>
          Notiflix.Notify.failure('Oops, there is no country with that name')
        );
    }
  }, DEBOUNCE_DELAY)
);

function renderCountryCard(name) {
  countryList.innerHTML = '';
  const info = name
    .map(({ name, capital, population, flags, languages }) => {
      const lang = Object.values(languages);
      const pop = population.toLocaleString('pl-PL');
      return `<li class="is-hidden">
      <p><img src="${flags.svg}"></img><b class="name">${name.official}</b></p>
      <p><b>Capital:</b>${capital}</p>
      <p><b>Population:</b>${pop}</p>
      <p><b>Languages:</b>${lang}</p>
      </li>`;
    })
    .join('');
  countryInfo.innerHTML = info;
}

function renderCountries(name) {
  if (name.length >= 10) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  } else if (name.length !== 1) {
    const list = name
      .map(({ name, flags }) => {
        return `<li>
          <p><img src="${flags.svg}"></img>${name.official}</p>
          </li>`;
      })
      .join('');
    countryInfo.innerHTML = '';
    countryList.innerHTML = list;

    const countryListItems = countryList.querySelectorAll('li');
    for (const item of countryListItems) {
      item.addEventListener('click', e => {
        renderCountryCard(name);

        const countryCardName = countryInfo.querySelectorAll('.name');
        for (const name of countryCardName) {
          if (name.textContent === e.currentTarget.textContent.trim()) {
            const clickedName = name.parentElement;
            clickedName.parentElement.classList.toggle('visible');
          }
        }
      });
    }
  } else {
    renderCountryCard(name);
    const countryCard = countryInfo.querySelector('.is-hidden');
    countryCard.classList.toggle('visible');
  }
}
