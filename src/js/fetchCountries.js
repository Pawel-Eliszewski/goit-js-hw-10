import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';

const countryInput = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

countryInput.addEventListener(
  'input',
  debounce(() => {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
    if (countryInput.value !== '') {
      fetchCountries()
        .then(name => renderCountries(name))
        .catch(error =>
          Notiflix.Notify.failure('Oops, there is no country with that name')
        );
    }
  }, 300)
);

function fetchCountries() {
  const countryName =
    'https://restcountries.com/v3.1/name/' +
    countryInput.value.trim() +
    '?fields=name,capital,population,flags,languages';
  return fetch(`${countryName}`).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
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
  } else {
    countryList.innerHTML = '';
    const info = name
      .map(({ name, capital, population, flags, languages }) => {
        const lang = Object.values(languages);
        return `<li>
      <p><img src="${flags.svg}"></img><b class="name">${name.official}</b></p>
      <p><b>Capital:</b>${capital}</p>
      <p><b>Population:</b>${population}</p>
      <p><b>Languages:</b>${lang}</p>
      </li>`;
      })
      .join('');
    countryInfo.innerHTML = info;
  }
}
