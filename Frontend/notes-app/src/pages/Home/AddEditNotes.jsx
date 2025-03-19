import React, { useState } from "react";
import TagInput from "../../components/input/TagInput";
import { MdClose } from "react-icons/md";

const AddEditNotes = ({ noteData, type,onClose, onSave, initialData }) => {
    const [title, setTitle] = useState(initialData?.title || "");
    const [content, setContent] = useState(initialData?.content || "");
    const [tags, setTags] = useState(initialData?.tags || []);
    const [error, setError] = useState("");

    // Add note
    const addNewNote = async ()=>{

    };

    // Edit Note
    const handleEdit = (id, newTitle, newContent, newTags) => {
        setNotes((prevNotes) =>
            prevNotes.map((note) =>
                note.id === id ? { ...note, title: newTitle, content: newContent, tags: newTags } : note
            )
        );
    };
    
    const handleSave = () => {
        if (!title.trim() || !content.trim()) {
            setError("Title and Content are required!");
            return;
        }

        if(type === 'edit'){
            handleEdit()
        }
        else{
            addNewNote()
        }
        const newNote = { title, content, tags };
        onSave(newNote);
        setTitle(""); // Clear title input
        setContent(""); // Clear content input
        setTags([]); // Clear tags
        setError(""); // Reset error
    };

    return (
        <div className="p-5 bg-white shadow-lg rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4 relative">
                <h2 className="text-xl font-semibold">{initialData ? "Edit Note" : "Add Note"}</h2>
                <button className="w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-50" onClick={onClose}>
                    <MdClose className="text-2xl text-slate-400" />
                </button>
            </div>
            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
            <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">TITLE</label>
                <input
                    type="text"
                    className="p-2 border rounded focus:ring focus:ring-blue-300"
                    placeholder="Go To Gym At 5"
                    value={title}
                    onChange={({ target }) => setTitle(target.value)}
                />
            </div>
            <div className="flex flex-col gap-2 mt-4">
                <label className="text-sm font-medium text-gray-700">CONTENT</label>
                <textarea
                    className="p-2 border rounded focus:ring focus:ring-blue-300"
                    placeholder="Content"
                    rows={6}
                    value={content}
                    onChange={({ target }) => setContent(target.value)}
                />
            </div>
            <div className="mt-3">
                <label className="text-sm font-medium text-gray-700">TAGS</label>
                <TagInput tags={tags} setTags={setTags} />
            </div>
            
            <button
                className="mt-5 w-full p-3 bg-blue-500 text-white font-medium rounded hover:bg-blue-600 transition"
                onClick={handleSave}
            >
                {initialData ? "Update Note" : "Add Note"}
            </button>
        </div>
    );
};

export default AddEditNotes;
