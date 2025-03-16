import React, { useState } from 'react';
import { FaPlus, FaTimes } from 'react-icons/fa'; // New Icons

const categoryColors = {
    Work: "bg-green-200 text-green-800",
    Personal: "bg-blue-200 text-blue-800",
    Urgent: "bg-red-200 text-red-800",
    Default: "bg-gray-200 text-gray-800",
};

const TagInput = ({ tags, setTags }) => {
    const [inputValue, setInputValue] = useState("");

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const addNewTag = () => {
        if (inputValue.trim() !== "" && !tags.includes(inputValue.trim())) {
            setTags([...tags, inputValue.trim()]);
            setInputValue(""); // Clear input after adding
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            addNewTag();
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setTags(tags.filter((tag) => tag !== tagToRemove));
    };

    const getCategoryColor = (tag) => {
        if (tag.toLowerCase().includes("work")) return categoryColors.Work;
        if (tag.toLowerCase().includes("personal")) return categoryColors.Personal;
        if (tag.toLowerCase().includes("urgent")) return categoryColors.Urgent;
        return categoryColors.Default;
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow-md">
            {/* Tags Display */}
            {tags?.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap mt-2">
                    {tags.map((tag, index) => (
                        <span
                            key={index}
                            className={`${getCategoryColor(tag)} text-xs px-3 py-1 rounded-full flex items-center gap-2 animate-fadeIn`}
                        >
                            #{tag}
                            <button
                                onClick={() => handleRemoveTag(tag)}
                                className="text-slate-700 hover:text-red-500 transition duration-200"
                            >
                                <FaTimes />
                            </button>
                        </span>
                    ))}
                </div>
            )}

            {/* Tag Input Field */}
            <div className="flex items-center gap-4 mt-3">
                <input
                    type="text"
                    className="text-sm w-full bg-transparent border-2 border-blue-400 px-3 py-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Add a tag (e.g., Work, Personal, Urgent)"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                />

                <button
                    className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-blue-500 bg-blue-500 text-white hover:bg-blue-700 transition duration-300"
                    onClick={addNewTag}
                >
                    <FaPlus className="text-lg" />
                </button>
            </div>
        </div>
    );
};

export default TagInput;
