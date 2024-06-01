const pokemonCount = 494;
const regions = {
  'Kanto': { start: 1, end: 151 },
  'Johto': { start: 152, end: 251 },
  'Hoenn': { start: 252, end: 386 },
  'Sinnoh': { start: 387, end: 494 },
  'National': { start: 1, end: pokemonCount }
};
var pokedex = {};

window.onload = async function () {
  await loadRegion('Kanto');
  updatePokemonInfo(1); // Display Bulbasaur info on initial load
};

async function loadRegion(region) {
  const { start, end } = regions[region];
  document.getElementById("pokemon-list").innerHTML = ""; // Clear the list
  document.getElementById("region-title").innerHTML = `${region} Pokédex`;
  for (let i = start; i <= end; i++) {
    await getPokemon(i);
    let pokemon = document.createElement("div");
    pokemon.id = i;
    pokemon.innerText = `${i}. ${pokedex[i].name.toUpperCase()}`;
    pokemon.classList.add("pokemon-name");
    pokemon.addEventListener("click", updatePokemon);
    document.getElementById("pokemon-list").append(pokemon);
  }
  updatePokemonInfo(start); // Display the top Pokémon of the selected region
}

async function getPokemon(num) {
  let url = `https://pokeapi.co/api/v2/pokemon/${num}`;

  let res = await fetch(url);
  let pokemon = await res.json();

  let pokemonName = pokemon.name;
  let pokemonType = pokemon.types;
  let pokemonImg = pokemon.sprites.front_default;

  res = await fetch(pokemon.species.url);
  let pokemonDesc = await res.json();
  pokemonDesc = pokemonDesc.flavor_text_entries.find(entry => entry.language.name === 'en').flavor_text;

  pokedex[num] = { name: pokemonName, img: pokemonImg, types: pokemonType, desc: pokemonDesc };
}

function updatePokemon() {
  updatePokemonInfo(this.id);
}

function updatePokemonInfo(id) {
  document.getElementById("pokemon-img").src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/${id}.png`;

  let typesDiv = document.getElementById("pokemon-types");
  while (typesDiv.firstChild) {
    typesDiv.firstChild.remove();
  }

  let types = pokedex[id].types;
  for (let i = 0; i < types.length; i++) {
    let type = document.createElement("span");
    type.innerText = types[i].type.name.toUpperCase();
    type.classList.add("type-box");
    type.classList.add(types[i].type.name);
    typesDiv.append(type);
  }

  document.getElementById("pokemon-description").innerText = pokedex[id].desc;
}


document.addEventListener("DOMContentLoaded", function() {
  const tour = new Shepherd.Tour({
      defaultStepOptions: {
          cancelIcon: {
              enabled: true
          },
          classes: 'shepherd-theme-arrows'
      }
  });

  tour.addStep({
      id: 'step1',
      text: 'Welcome to SHINY POKÉDEX! Click "Next" to begin the tour.',
      attachTo: { element: '#header', on: 'right' },
      buttons: [
          {
              text: 'Next',
              action: tour.next
          }
      ]
  });

  tour.addStep({
      id: 'step2',
      text: 'View Pokémons by region.',
      attachTo: { element: '#pokemon-region-list', on: 'left' },
      buttons: [
          {
              text: 'Next',
              action: tour.next
          }
      ]
  });

  tour.addStep({
      id: 'step3',
      text: 'Shiny Pokémon images are displayed here.',
      attachTo: { element: '#pokemon-img', on: 'left' },
      buttons: [
          {
              text: 'Next',
              action: tour.next
          }
      ]
  });

  tour.addStep({
      id: 'step4',
      text: 'Check out the Pokémon types and descriptions here.',
      attachTo: { element: '#pokemon-description', on: 'left' },
      buttons: [
          {
              text: 'Next',
              action: tour.next
          }
      ]
  });

  tour.addStep({
      id: 'step5',
      text: 'Click here to view your favorite Pokémon!',
      attachTo: { element: '#pokemon-list', on: 'right' },
      buttons: [
          {
              text: 'Finish',
              action: tour.next
          }
      ]
  });

  document.getElementById('start-tour').addEventListener('click', function() {
      tour.start();
  });
});
