import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

const ActionsDropdown = ({ options, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = (event) => {
    const rect = event.target.getBoundingClientRect();
    const dropdownWidth = 192; // Adjust based on dropdown width
    const dropdownHeight = 0; // Adjust if needed for vertical offset
    setDropdownPosition({
      top: rect.bottom + window.scrollY + dropdownHeight,
      left: rect.left + window.scrollX - dropdownWidth + rect.width,
    });
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={toggleDropdown}
        className="p-2 text-gray-700 hover:text-gray-900 focus:outline-none"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6h.01M12 12h.01M12 18h.01"
          />
        </svg>
      </button>

      {isOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            style={{
              position: "absolute",
              top: dropdownPosition.top,
              left: dropdownPosition.left,
            }}
            className="z-50 w-48 bg-white border border-gray-300 rounded-md shadow-lg"
          >
            {options.map((option) => (
              <button
                key={option._id}
                type="button"
                onClick={() => {
                  onSelect(option._id);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-2 text-left text-sm flex items-center hover:bg-gray-100 ${
                  option.color ? option.color : "text-gray-700"
                }`}
              >
                {option.icon}
                {option.label}
              </button>
            ))}
          </div>,
          document.body // Render dropdown outside the table container
        )}
    </div>
  );
};

export default ActionsDropdown;