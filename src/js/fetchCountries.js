export const countryInput = document.querySelector('#search-box');

export function fetchCountries() {
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
