import { champions } from "./data.js";
import { tagFilter } from "./filters.js";

// DOM Elements
const cardContainer = document.querySelector('.card-container');
const dropdownToggle = document.querySelector('.dropdown-toggle');
const dropdownContent = document.querySelector('.dropdown-content');
const roleCheckboxes = document.querySelectorAll('.checkbox-item input[type="checkbox"]')

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
          <h2>${champion.champName.toUpperCase()}</h2>
          <p class="champion-title">${champion.subtitle}</p>
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

function applyFilter(checkedTag) {
  let filteredCards = tagFilter(checkedTag);

  cardContainer.innerHTML = '';
  addCards(filteredCards);
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


function init() {
  addCards(champions);
  setupDropdownToggle();
  setupFilterListeners();
}



document.addEventListener('DOMContentLoaded', init);
