import { champions } from "./data.js";
import { sortAtoZ, sortZtoA, sortEasyToHard, sortHardToEasy, searchByName } from "./sorts.js";

// DOM Elements
const cardContainer = document.querySelector('.card-container');
const dropdownToggle = document.querySelector('.dropdown-toggle');
const dropdownContent = document.querySelector('.dropdown-content');
const roleCheckboxes = document.querySelectorAll('.checkbox-item input[type="checkbox"]');
const sortRadios = document.querySelectorAll('.radio-item input[type="radio"]');
const searchInput = document.querySelector('.search-container input[type="text"]');
const addBtn = document.querySelector('.add-btn');
const modal = document.getElementById('add-champion-modal');
const closeModal = document.querySelector('.close-modal');
const cancelBtn = document.querySelector('.cancel-btn');
const addChampionForm = document.getElementById('add-champion-form');

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
            <div class="champion-name-edit-container">
              <h2>${champion.champName.toUpperCase()}</h2>
              <button class="edit-btn" data-champion="${champion.champName}">
                <svg viewBox="0 0 24 24" width="18" height="18">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/>
                </svg>
              </button>
            </div>
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

function setupSearchListeners() {

  searchInput.addEventListener('input', function() {
    console.log(`User typed: ${this.value}`);
    if(this.value == "") {
      addCards(currentFilteredChampions);
    } else {
      let foundChampion = [...currentFilteredChampions];
      foundChampion = searchByName(foundChampion, this.value);
      addCards(foundChampion);
    }
  })

}

function setUpAddButtonListener() {
  let scrollPosition;

  function lockScroll() {
    scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollPosition}px`;
    document.body.style.width = '100%';
  }

  function unlockScroll() {
    // Remove styles from body
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    
    // Restore scroll position
    window.scrollTo(0, scrollPosition);
  }

  addBtn.addEventListener('click', function() {
    console.log('Add btn clicked');
    lockScroll();
    modal.style.display = 'block';
  });

  closeModal.addEventListener('click', function() {
    modal.style.display = 'none';
    unlockScroll();
  });

  cancelBtn.addEventListener('click', function() {
    modal.style.display = 'none';
    unlockScroll();
  });

  window.addEventListener('click', function(event) {
    if (event.target === modal) {
      modal.style.display = 'none';
      unlockScroll();
    }
  });
  
  const modalContent = document.querySelector('.modal-content');
  modalContent.addEventListener('click', function(event) {
    event.stopPropagation();
  });

  addChampionForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('champ-name').value;
    let subtitle = document.getElementById('champ-subtitle').value;
    if(subtitle == "") {
      subtitle = "The champion"
    }
    let imgUrl = document.getElementById('champ-img').value;
    if(imgUrl == "") {
      imgUrl = "asset/backup.png"
    }
    let description = document.getElementById('champ-description').value;
    if(description == "") {
      description = "A new power is born"
    }
    const difficultyRadio = document.querySelector('input[name="difficulty"]:checked')
    const difficulty = difficultyRadio ? difficultyRadio.value : 'Moderate';

    const tagCheckboxes = document.querySelectorAll('.tag-options input[type="checkbox"]:checked');
    let tags = [];
    tagCheckboxes.forEach(checkBox => {
      tags.push(checkBox.value);
    });

    const recommended = document.getElementById('champ-recommended').checked;
    const newChampion = {
      champName: name,
      subtitle: subtitle,
      imgUrl: imgUrl,
      description: description,
      difficulty: difficulty,
      tag: tags,
      bestchoice: recommended
    };

    champions.push(newChampion);
    currentFilteredChampions = [...champions];
    addCards(champions)

    modal.style.display = 'none';
    unlockScroll();
    addChampionForm.reset();
    console.log('Champion added:', newChampion);

  })
}

function init() {
  addCards(champions);
  setupDropdownToggle();
  setupSortDropdown();
  setupSortListeners();
  setupFilterListeners();
  setupSearchListeners();
  setUpAddButtonListener();
}



document.addEventListener('DOMContentLoaded', init);
