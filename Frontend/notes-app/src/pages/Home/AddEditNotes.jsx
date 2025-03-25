import React, { useState } from 'react';
import TagInput from "../../components/input/TagInput";
import { MdClose } from "react-icons/md";

const AddEditNotes = ({ onClose, onSave, initialData, type }) => {
    const [title, setTitle] = useState(initialData?.title || "");
    const [content, setContent] = useState(initialData?.content || "");
    const [tags, setTags] = useState(initialData?.tags || []);
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSave = async () => {
        try {
            setIsSubmitting(true);
            setError("");
            
            // Validate inputs
            if (!title.trim()) {
                setError("Title is required!");
                return;
            }
            if (!content.trim()) {
                setError("Content is required!");
                return;
            }

            const noteData = {
                title: title.trim(),
                content: content.trim(),
                tags: tags.filter(tag => tag.trim() !== ""),
                isPinned: initialData?.isPinned || false
            };

            console.log('Attempting to save note with data:', noteData);

            // Call the onSave function passed from parent
            const success = await onSave(initialData?._id || null, noteData);
            
            if (success) {
                console.log('Note saved successfully');
                onClose(); // Close the modal only on success
            } else {
                console.log('Note save failed');
                // Error will be set by the parent component
            }
        } catch (err) {
            console.error('Error in handleSave:', err);
            setError(err.message || "Failed to save note. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-5 bg-white shadow-lg rounded-lg w-full max-w-md mx-auto">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">{type === 'edit' ? "Edit Note" : "Add Note"}</h2>
                <button 
                    className="text-gray-500 hover:text-gray-700"
                    onClick={onClose}
                    disabled={isSubmitting}
                >
                    <MdClose size={24} />
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
                    {error}
                </div>
            )}

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Enter note title"
                        disabled={isSubmitting}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Content <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={6}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Enter note content"
                        disabled={isSubmitting}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tags
                    </label>
                    <TagInput 
                        tags={tags} 
                        setTags={setTags}
                        disabled={isSubmitting}
                    />
                </div>

                <button
                    onClick={handleSave}
                    disabled={isSubmitting}
                    className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                    {isSubmitting ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {type === 'edit' ? "Updating..." : "Adding..."}
                        </>
                    ) : (
                        type === 'edit' ? "Update Note" : "Add Note"
                    )}
                </button>
            </div>
        </div>
    );
};

export default AddEditNotes;
