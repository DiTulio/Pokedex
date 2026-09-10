const pokemonName = document.querySelector('.pokemon__name');
const pokemonNumber = document.querySelector('.pokemon__number');
const pokemonImage = document.querySelector('.pokemon__image');
const pokemonDescription = document.querySelector('.pokemon__description');

const form = document.querySelector('.form');
const input = document.querySelector('.input__search');
const buttonPrev = document.querySelector('.btn-prev');
const buttonNext = document.querySelector('.btn-next');
const buttonInfo = document.querySelector('.btn-info');

let searchPokemon = 1;
let showingDescription = false;

const fetchPokemon = async (pokemon) => {
    const APIResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);

    if (APIResponse.status === 200) {
        const data = await APIResponse.json();
        return data;
    }
}

const fetchDescription = async (id) => {
    const APIResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);

    if (APIResponse.status === 200) {
        const data = await APIResponse.json();

        const entry = data.flavor_text_entries.find(
            (entry) => entry.language.name === 'en'
        );

        if (entry) {
            // A API traz caracteres de quebra de linha estranhos (\n, \f) no meio do texto
            return entry.flavor_text.replace(/[\n\f]/g, ' ');
        }
    }

    return 'Description not available.';
}

const resetDescriptionView = () => {
    showingDescription = false;
    pokemonImage.classList.remove('hidden');
    pokemonDescription.classList.remove('active');
    buttonInfo.classList.remove('active');
}

const renderPokemon = async (pokemon) => {

    pokemonName.innerHTML = 'Loading...';
    pokemonNumber.innerHTML = '';
    resetDescriptionView();

    const data = await fetchPokemon(pokemon);

    if (data) {
        pokemonImage.style.display = 'block';
        pokemonName.innerHTML = data.name;
        pokemonNumber.innerHTML = data.id;
        pokemonImage.src = data['sprites']['versions']['generation-v']['black-white']['animated']['front_default'] || data['sprites']['front_default'];
        input.value = '';
        searchPokemon = data.id;

        pokemonDescription.innerHTML = await fetchDescription(data.id);
    } else {
        pokemonImage.style.display = 'none';
        pokemonName.innerHTML = 'Not found :c';
        pokemonNumber.innerHTML = '';
        pokemonDescription.innerHTML = '';
    }
}

form.addEventListener('submit', (event) => {
    event.preventDefault();
    renderPokemon(input.value.toLowerCase());
});

buttonPrev.addEventListener('click', () => {
    if (searchPokemon > 1) {
        searchPokemon -= 1;
        renderPokemon(searchPokemon);
    }
});

buttonNext.addEventListener('click', () => {
    searchPokemon += 1;
    renderPokemon(searchPokemon);
});

buttonInfo.addEventListener('click', () => {
    showingDescription = !showingDescription;
    pokemonImage.classList.toggle('hidden', showingDescription);
    pokemonDescription.classList.toggle('active', showingDescription);
    buttonInfo.classList.toggle('active', showingDescription);
});

renderPokemon(searchPokemon);
