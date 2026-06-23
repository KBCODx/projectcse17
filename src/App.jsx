import { useState, useEffect } from 'react';
import './App.css';

function App() {
  // Load data from localStorage on start
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('react_wishlist_items');
    return saved ? JSON.parse(saved) : [];
  });

  const [inputName, setInputName] = useState('');
  const [category, setCategory] = useState('Tech');
  const [activeFilter, setActiveFilter] = useState('All');

  // Automatically save to localStorage whenever our items list changes
  useEffect(() => {
    localStorage.setItem('react_wishlist_items', JSON.stringify(items));
  }, [items]);

  // Handle Add Item (Create)
  const handleAddItem = (e) => {
    e.preventDefault();
    if (!inputName.trim()) return;

    const newItem = {
      id: Date.now().toString(),
      name: inputName.trim(),
      category: category,
      bought: false
    };

    setItems([...items, newItem]);
    setInputName(''); // Reset input text field
  };

  // Handle Toggle Status (Update)
  const toggleBought = (id) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, bought: !item.bought } : item
    ));
  };

  // Handle Remove Item (Delete)
  const deleteItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  // Filter items based on active dropdown selection
  const filteredItems = items.filter(item => {
    if (activeFilter === 'All') return true;
    return item.category === activeFilter;
  });

  return (
    <div className="container">
      <h1>Smart Wishlist </h1>

      {/* Form Submission Controls */}
      <form onSubmit={handleAddItem} className="input-section">
        <input 
          type="text" 
          placeholder="What do you want to get?..." 
          value={inputName}
          onChange={(e) => setInputName(e.target.value)}
          required 
        />
        
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="Tech">💻 Tech</option>
          <option value="Groceries">🍎 Groceries</option>
          <option value="Clothes">👕 Clothes</option>
          <option value="Other">✨ Other</option>
        </select>
        
        <button type="submit" className="add-btn">Add Item</button>
      </form>

      {/* Filtering Category Selector */}
      <div className="filter-section">
        <label>Filter by Category:</label>
        <select value={activeFilter} onChange={(e) => setActiveFilter(e.target.value)}>
          <option value="All">All Categories</option>
          <option value="Tech">💻 Tech</option>
          <option value="Groceries">🍎 Groceries</option>
          <option value="Clothes">👕 Clothes</option>
          <option value="Other">✨ Other</option>
        </select>
      </div>

      {/* Dynamic Item Rendering */}
      <ul className="wishlist">
        {filteredItems.map(item => (
          <li key={item.id} className={`wishlist-item ${item.bought ? 'bought' : ''}`}>
            <input 
              type="checkbox" 
              className="checkbox-container" 
              checked={item.bought}
              onChange={() => toggleBought(item.id)}
            />
            <span className="item-text">{item.name}</span>
            <span className={`badge ${item.category.toLowerCase()}`}>{item.category}</span>
            <button className="delete-btn" onClick={() => deleteItem(item.id)}>×</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;