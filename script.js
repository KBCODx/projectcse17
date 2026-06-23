// State Management
let items = JSON.parse(localStorage.getItem('wishlist_items')) || [];
let activeFilter = 'All';

// DOM Selectors
const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const categorySelect = document.getElementById('category-select');
const filterSelect = document.getElementById('filter-select');
const wishlistUl = document.getElementById('wishlist');

// Save items helper structure
function saveToLocalStorage() {
  localStorage.setItem('wishlist_items', JSON.stringify(items));
}

// Render Engine
function renderList() {
  wishlistUl.innerHTML = '';

  // Filter array dynamically
  const filteredItems = items.filter(item => {
    if (activeFilter === 'All') return true;
    return item.category === activeFilter;
  });

  // Build DOM elements
  filteredItems.forEach(item => {
    const li = document.createElement('li');
    li.className = `wishlist-item ${item.bought ? 'bought' : ''}`;

    li.innerHTML = `
            <label class="checkbox-container">
                <input type="checkbox" ${
        item.bought ? 'checked' :
                      ''} data-id="${item.id}" class="toggle-checkbox">
                <span class="checkmark"></span>
            </label>
            <span class="item-text">${item.name}</span>
            <span class="badge ${item.category.toLowerCase()}">${
        item.category}</span>
            <button class="delete-btn" data-id="${item.id}">×</button>
        `;

    wishlistUl.appendChild(li);
  });
}

// Core Operations / CRUD Features

// 1. Create
itemForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const newItem = {
    id: Date.now().toString(),  // Quick execution unique ID tracker
    name: itemInput.value.trim(),
    category: categorySelect.value,
    bought: false
  };

  items.push(newItem);
  saveToLocalStorage();
  renderList();

  itemForm.reset();  // Clear input elements quickly
});

// Handling events within the list (Update & Delete)
wishlistUl.addEventListener('click', (e) => {
  const targetId = e.target.getAttribute('data-id');

  // 2. Update (Toggle state change)
  if (e.target.classList.contains('toggle-checkbox')) {
    items = items.map(item => {
      if (item.id === targetId) {
        return {...item, bought: !item.bought};
      }
      return item;
    });
    saveToLocalStorage();
    renderList();
  }

  // 3. Delete
  if (e.target.classList.contains('delete-btn')) {
    items = items.filter(item => item.id !== targetId);
    saveToLocalStorage();
    renderList();
  }
});

// 4. Read / Filter setup
filterSelect.addEventListener('change', (e) => {
  activeFilter = e.target.value;
  renderList();
});

// App Startup Point
renderList();