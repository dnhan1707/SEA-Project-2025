import { champions } from "./data.js";
import { sortAtoZ, sortZtoA, sortEasyToHard, sortHardToEasy } from "./sorts.js";

// DOM Elements
const cardContainer = document.querySelector('.card-container');
const dropdownToggle = document.querySelector('.dropdown-toggle');
const dropdownContent = document.querySelector('.dropdown-content');
const roleCheckboxes = document.querySelectorAll('.checkbox-item input[type="checkbox"]');
const sortRadios = document.querySelectorAll('.radio-item input[type="radio"]');
const searchInput = document.querySelector('.search-container input[type="text"]');

let currentFilteredChampions = [...champions]; 
let currentSortType = 'default';

function addCards(championsArray){
  cardContainer.innerHTML = '';

  if(championsArray.length == 0) {
    cardContainer.innerHTML = '<p class="no-results">No champions found. Try adjusting your filters.</p>';
    return;
  }
  let allCardsHtml = '';

  championsArray.forEach(champion => {
    let tagHtml = ''
    champion.tag.forEach(tag => {
      tagHtml += `<span class="tag">${tag}</span>`
    })
    let cardHtml = `
      <div class="card">
        <div class="card-image">
          <img src="${champion.imgUrl}" alt="${champion.champName}" />
          ${champion.bestchoice ? '<span class="badge">Recommended</span>' : ''}
        </div>
        <div class="card-content">
          <div class="card-header">
            <h2>${champion.champName.toUpperCase()}</h2>
            <p class="champion-title">${champion.subtitle}</p>
          </div>
          
          <div class="champion-description">
            ${champion.description || 'This champion stalks the battlefield looking for unsuspecting victims. With a mix of cunning and raw power, they can turn the tide of any fight.'}
          </div>
          
          <div class="champion-info">
            <span class="difficulty ${champion.difficulty.toLowerCase()}">${champion.difficulty}</span>
            <div class="champion-tags">
              ${tagHtml}
            </div>
          </div>
        </div>
      </div>
    `;
    allCardsHtml += cardHtml;
  });
  cardContainer.innerHTML = allCardsHtml;

}

function tagFilter(checkedTag) {
    if (checkedTag.length == 0) {
        return champions
    }

    let filteredCards = []
    for(let i = 0; i < champions.length; i++) {
        const champion = champions[i]
        let count = 0;
        checkedTag.forEach(tag => {
            if(champion.tag.includes(tag)) {
                count += 1;
                if(count == checkedTag.length){
                    filteredCards.push(champion);
                }
            }
        });
    }
    return filteredCards;
}

function applyFilter(checkedTag) {
  currentFilteredChampions = tagFilter(checkedTag);

  cardContainer.innerHTML = '';

  if (currentSortType !== 'default') {
    sortChampions(currentSortType);
  } else {
    // Otherwise just show the filtered champions
    addCards(currentFilteredChampions);
  }
}

function setupDropdownToggle() {
  // Toggle dropdown
  dropdownToggle.addEventListener('click', function() {
    dropdownContent.classList.toggle('show');
    dropdownToggle.classList.toggle('active');
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', function(event) {
    if (!event.target.closest('.dropdown-filter')) {
      dropdownContent.classList.remove('show');
      dropdownToggle.classList.remove('active');
    }
  });

  // Prevent dropdown from closing when clicking inside
  dropdownContent.addEventListener('click', function(event) {
    event.stopPropagation();
  });
}

function setupSortDropdown() {
  const sortToggle = document.querySelector('.sort-container .dropdown-toggle');
  const sortContent = document.querySelector('.sort-container .dropdown-content');
  
  sortToggle.addEventListener('click', function() {
    sortContent.classList.toggle('show');
    sortToggle.classList.toggle('active');
  });
  
  document.addEventListener('click', function(event) {
    if (!event.target.closest('.sort-container .dropdown-filter')) {
      sortContent.classList.remove('show');
      sortToggle.classList.remove('active');
    }
  });
  
  sortContent.addEventListener('click', function(event) {
    event.stopPropagation();
  });
}

function setupFilterListeners() {
  roleCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
  
        // Get all checked tag
        let checkedTag = [];
        for(let i = 0; i < roleCheckboxes.length; i++){
          const checkBox = roleCheckboxes[i];
          if(checkBox.checked) {
            checkedTag.push(checkBox.value);
          }
        }
        applyFilter(checkedTag)
      });
  })
}

function sortChampions(type) {
  let sortedChampions = [...currentFilteredChampions];
  
  switch(type) {
    case 'az':
      sortedChampions = sortAtoZ(sortedChampions);
      break;
    case 'za':
      sortedChampions = sortZtoA(sortedChampions);
      break;
    case 'eh':
      sortedChampions = sortEasyToHard(sortedChampions);
      break;
    case 'he':
      sortedChampions = sortHardToEasy(sortedChampions);
      break;
    default:
      break;
  }
  addCards(sortedChampions)
}

function setupSortListeners() {
  sortRadios.forEach(sortRadio => {
    sortRadio.addEventListener('change', function() {
      if(this.checked) {
        currentSortType = this.value;
        sortChampions(this.value)
      }
    })
  })
}


function init() {
  addCards(champions);
  setupDropdownToggle();
  setupSortDropdown();
  setupSortListeners();
  setupFilterListeners();
}



document.addEventListener('DOMContentLoaded', init);
