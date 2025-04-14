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
const editModal = document.getElementById('edit-champion-modal')
const editCloseBtn = document.querySelector('#edit-champion-modal .close-modal');
const editCancelBtn = document.querySelector('#edit-champion-modal .cancel-btn');
const editChampionForm = document.getElementById('edit-champion-form');

let currentFilteredChampions = [...champions]; 
let currentSortType = 'default';
let championToEdit = null;
let id = null;


function addCards(championsArray){
  cardContainer.innerHTML = '';

  if(championsArray.length == 0) {
    cardContainer.innerHTML = '<p class="no-results">No champions found. Try adjusting your filters.</p>';
    return;
  }
  let allCardsHtml = '';

  for(let i = championsArray.length - 1; i >= 0; i--) {
    const champion = championsArray[i];
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
  }


  // championsArray.forEach(champion => {
  //   let tagHtml = ''
  //   champion.tag.forEach(tag => {
  //     tagHtml += `<span class="tag">${tag}</span>`
  //   })
  //   let cardHtml = `
  //     <div class="card">
  //       <div class="card-image">
  //         <img src="${champion.imgUrl}" alt="${champion.champName}" />
  //         ${champion.bestchoice ? '<span class="badge">Recommended</span>' : ''}
  //       </div>
  //       <div class="card-content">
  //         <div class="card-header">
  //           <div class="champion-name-edit-container">
  //             <h2>${champion.champName.toUpperCase()}</h2>
  //             <button class="edit-btn" data-champion="${champion.champName}">
  //               <svg viewBox="0 0 24 24" width="18" height="18">
  //                 <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/>
  //               </svg>
  //             </button>
  //           </div>
  //           <p class="champion-title">${champion.subtitle}</p>
  //         </div>
  //         <div class="champion-description">
  //           ${champion.description || 'This champion stalks the battlefield looking for unsuspecting victims. With a mix of cunning and raw power, they can turn the tide of any fight.'}
  //         </div>
          
  //         <div class="champion-info">
  //           <span class="difficulty ${champion.difficulty.toLowerCase()}">${champion.difficulty}</span>
  //           <div class="champion-tags">
  //             ${tagHtml}
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   `;
  //   allCardsHtml += cardHtml;
  // });
  cardContainer.innerHTML = allCardsHtml;
  setupEditButtonHandlers();
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

function applyTagFilter(checkedTag) {
  currentFilteredChampions = tagFilter(checkedTag);

  cardContainer.innerHTML = '';

  if (currentSortType !== 'default') {
    sortChampions(currentSortType);
  } else {
    addCards(currentFilteredChampions);
  }
}

function setupDropdownToggle() {
  dropdownToggle.addEventListener('click', function() {
    dropdownContent.classList.toggle('show');
    dropdownToggle.classList.toggle('active');
  });

  document.addEventListener('click', function(event) {
    if (!event.target.closest('.dropdown-filter')) {
      dropdownContent.classList.remove('show');
      dropdownToggle.classList.remove('active');
    }
  });

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
  
        let checkedTag = [];
        for(let i = 0; i < roleCheckboxes.length; i++){
          const checkBox = roleCheckboxes[i];
          if(checkBox.checked) {
            checkedTag.push(checkBox.value);
          }
        }
        applyTagFilter(checkedTag)
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
    // console.log(`User typed: ${this.value}`);
    if(this.value == "") {
      addCards(currentFilteredChampions);
    } else {
      let foundChampion = [...currentFilteredChampions];
      foundChampion = searchByName(foundChampion, this.value);
      addCards(foundChampion);
    }
  })

}


function lockScroll() {
  let scrollPosition;

  scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
  
  document.body.style.overflow = 'hidden';
  document.body.style.position = 'fixed';
  document.body.style.top = `-${scrollPosition}px`;
  document.body.style.width = '100%';
}

function unlockScroll() {
  let scrollPosition;

  document.body.style.overflow = '';
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.width = '';
  
  window.scrollTo(0, scrollPosition);
}

function setupAddButtonListener() {

  addBtn.addEventListener('click', function() {
    // console.log('Add btn clicked');
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

    let isDuplicate = false;
    const nameInput = document.getElementById('champ-name');
    const name = nameInput.value;
    for(let i = 0; i < champions.length; i++) {
      if(name.toLowerCase() == champions[i].champName.toLocaleLowerCase()) {
        isDuplicate = true;
        break;
      }
    }

    if (isDuplicate) {
      // Create a custom error message
      let errorMsg = document.getElementById('name-error');
      if (!errorMsg) {
        errorMsg = document.createElement('div');
        errorMsg.id = 'name-error';
        errorMsg.className = 'error-message';
        nameInput.parentNode.appendChild(errorMsg);
      }
      
      errorMsg.innerHTML = '⚠️ This champion already exists. Please choose another name.';
      nameInput.focus();
      
      return;
    } else {
      const errorMsg = document.getElementById('name-error');
      if (errorMsg) errorMsg.remove();
      
      nameInput.setCustomValidity('');
      nameInput.classList.remove('input-error');
    }

    let subtitle = document.getElementById('champ-subtitle').value;
    if(subtitle == "") {
      subtitle = "The champion"
    }

    const imageUrlInput = document.getElementById('champ-img');
    let imgUrl = document.getElementById('champ-img').value;
    if(imgUrl == "") {
      imgUrl = "asset/backup.png"
    }
    let isValidUrl = isValidImage(imgUrl);
    if (!isValidUrl) {
      let errorImgMsg = document.getElementById('imageurl-error');
      if (!errorImgMsg) {
        errorImgMsg = document.createElement('div');
        errorImgMsg.id = 'imageurl-error';
        errorImgMsg.className = 'error-message';
        imageUrlInput.parentNode.appendChild(errorImgMsg);
      }

      errorImgMsg.innerHTML = '⚠️ Please use .jpg or .png image link';
      imageUrlInput.focus();
      
      return;
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
    // console.log('Champion added:', newChampion);

  })
}

function setupEditModalEvents() {
  let scrollPosition;

  function unlockScroll() {
    // Remove styles from body
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    
    // Restore scroll position
    window.scrollTo(0, scrollPosition);
  }

  editCloseBtn.addEventListener('click', function() {
    editModal.style.display = 'none';
    unlockScroll();
  });

  editCancelBtn.addEventListener('click', function() {
    editModal.style.display = 'none';
    unlockScroll();
  });

  window.addEventListener('click', function(event) {
    if (event.target === editModal) {
      editModal.style.display = 'none';
      unlockScroll();
    }
  });

  const editModalContent = document.querySelector('#edit-champion-modal .modal-content');
    editModalContent.addEventListener('click', function(event) {
      event.stopPropagation();
  });

  editChampionForm.addEventListener('submit', function(event){
    event.preventDefault();

    if (!championToEdit) {
      console.error('No champion selected for editing');
      return; 
    }
  
    // Get values with fallbacks
    let name = document.getElementById('edit-champ-name').value;
    if(name == "") {
      name = championToEdit.champName;
    }
  
    let subtitle = document.getElementById('edit-champ-subtitle').value;
    if(subtitle == "") {
      subtitle = championToEdit.subtitle;
    }
    
    let imgUrl = document.getElementById('edit-champ-img').value;
    if(imgUrl == "") {
      imgUrl = championToEdit.imgUrl;
    }
    
    let description = document.getElementById('edit-champ-description').value;
    if(description == "") {
      description = championToEdit.description;
    }
    
    const difficultyRadio = document.querySelector('#edit-champion-modal input[name="edit-difficulty"]:checked');
    const difficulty = difficultyRadio ? difficultyRadio.value : championToEdit.difficulty;
  
    let tagCheckboxes = document.querySelectorAll('#edit-champion-modal .tag-options input[type="checkbox"]:checked');
    let tags = [];
    tagCheckboxes.forEach(checkBox => {
      tags.push(checkBox.value);
    });
    
    if (tags.length < 1 && championToEdit.tag) {
      tags = championToEdit.tag;
    }
  
    const recommended = document.getElementById('edit-champ-recommended').checked;
    const edittedChampion = {
      champName: name,
      subtitle: subtitle,
      imgUrl: imgUrl,
      description: description,
      difficulty: difficulty,
      tag: tags,
      bestchoice: recommended
    };

    // console.log('Editted version: ', edittedChampion)
  
    if (id !== null && id >= 0 && id < champions.length) {
      champions[id] = edittedChampion;
      currentFilteredChampions = [...champions];
      addCards(currentFilteredChampions);
    } else {
      console.error('Invalid champion index for updating');
    }
  
    editModal.style.display = 'none';
    unlockScroll();
    editChampionForm.reset();
  })
}

function setupEditButtonHandlers() {
  const editBtn = document.querySelectorAll('.edit-btn');
  editBtn.forEach(btn => {
    btn.addEventListener('click', function(event) {
      event.stopPropagation();
      // console.log("btn clicked")
      const champName = btn.getAttribute('data-champion');
      for (let i = 0; i < champions.length; i++) {
        if (champions[i].champName.toLowerCase() === champName.toLowerCase()) {
          championToEdit = champions[i];
          id = i;
          break;
        }
      }
      document.getElementById('edit-champ-name').value = championToEdit.champName;
      document.getElementById('edit-champ-subtitle').value = championToEdit.subtitle;
      document.getElementById('edit-champ-img').value = championToEdit.imgUrl;
      document.getElementById('edit-champ-description').value = championToEdit.description;


      const difficulty = championToEdit.difficulty;
      document.querySelector(`#edit-champion-modal input[value="${difficulty}"]`).checked = true;
      
      const tags = championToEdit.tag;
      document.querySelectorAll('#edit-champion-modal .tag-options input[type="checkbox"]').forEach(checkBox => {
        checkBox.checked = tags.includes(checkBox.value);
      })

      const isRecommended = championToEdit.bestchoice;
      document.getElementById('edit-champ-recommended').checked = isRecommended;

      editModal.style.display = 'block';
      lockScroll();
    })
  })
}

function isValidImage(imgUrl) {
  if(imgUrl.slice(-4) == '.png' || imgUrl.slice(-4) == '.jpg' || imgUrl.slice(-4) == '.jpeg') {
    return true;
  }
  return false;
}

function init() {
  addCards(champions);
  setupEditModalEvents();
  setupDropdownToggle();
  setupSortDropdown();
  setupSortListeners();
  setupFilterListeners();
  setupSearchListeners();
  setupAddButtonListener();
}



document.addEventListener('DOMContentLoaded', init);
