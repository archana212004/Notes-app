import React, { useState } from 'react';
import TagInput from "../../components/input/TagInput";
import { MdClose } from "react-icons/md";

const AddEditNotes = ({ onClose, onSave, initialData, type }) => {
    const [title, setTitle] = useState(initialData?.title || "");
    const [content, setContent] = useState(initialData?.content || "");
    const [tags, setTags] = useState(initialData?.tags || []);
    const [error, setError] = useState("");

    const handleSave = async () => {
        try {
            console.log('Attempting to save note...'); // Debug log
            
            if (!title.trim() || !content.trim()) {
                setError("Title and Content are required!");
                return;
            }

            const noteData = {
                title: title.trim(),
                content: content.trim(),
                tags: tags.filter(tag => tag.trim() !== ""),
                isPinned: initialData?.isPinned || false
            };

            console.log('Note data being sent:', noteData); // Debug log

            if (type === 'edit' && initialData?._id) {
                await onSave(initialData._id, noteData);
            } else {
                await onSave(null, noteData);
            }

            console.log('Note saved successfully'); // Debug log
            onClose();
        } catch (err) {
            console.error('Error in handleSave:', err); // Debug log
            setError(err.message || "Failed to save note");
        }
    };

    return (
        <div className="p-5 bg-white shadow-lg rounded-lg w-full max-w-md mx-auto">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">{type === 'edit' ? "Edit Note" : "Add Note"}</h2>
                <button 
                    className="text-gray-500 hover:text-gray-700"
                    onClick={onClose}
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
                        Title
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Enter note title"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Content
                    </label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={6}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Enter note content"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tags
                    </label>
                    <TagInput tags={tags} setTags={setTags} />
                </div>

                <button
                    onClick={handleSave}
                    className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition-colors duration-300"
                >
                    {type === 'edit' ? "Update Note" : "Add Note"}
                </button>
            </div>
        </div>
    );
};

export default AddEditNotes;
