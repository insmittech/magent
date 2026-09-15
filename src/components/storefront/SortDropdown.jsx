import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, ArrowUpDown, Check } from 'lucide-react';

export const SortDropdown = ({ sortBy, setSortBy }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const options = [
    { value: 'featured', label: 'Popularity' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'newest', label: 'New Arrivals' },
    { value: 'rating', label: 'Customer Rating' },
    { value: 'discount', label: 'Deepest Discount' }
  ];

  const currentOption = options.find(opt => opt.value === sortBy) || options[0];

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (value) => {
    setSortBy(value);
    setIsOpen(false);
  };

  return (
    <div className="custom-sort-dropdown-container" ref={dropdownRef}>
      <button 
        className={`sort-trigger-btn ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`Sort products. Current sort: ${currentOption.label}`}
      >
        <ArrowUpDown size={14} className="sort-icon-left" />
        <span className="sort-active-label">Sort: {currentOption.label}</span>
        <ChevronDown size={14} className={`sort-chevron-right ${isOpen ? 'rotate-up' : ''}`} />
      </button>

      {isOpen && (
        <ul className="sort-options-menu" role="listbox">
          {options.map(option => (
            <li 
              key={option.value}
              className={`sort-option-item ${sortBy === option.value ? 'selected' : ''}`}
              role="option"
              aria-selected={sortBy === option.value}
              onClick={() => handleSelect(option.value)}
            >
              <span className="option-text">{option.label}</span>
              {sortBy === option.value && <Check size={14} className="check-icon-right" />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
