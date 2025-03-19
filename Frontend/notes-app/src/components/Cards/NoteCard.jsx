import React, { useState } from "react";
import { MdOutlinePushPin, MdCreate, MdDelete, MdSave, MdClose } from "react-icons/md";

const NoteCard = ({ id, title, date, content, tags, isPinned, onEdit, onDelete, onPinNote }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(title);
    const [editedContent, setEditedContent] = useState(content);
    const [editedTags, setEditedTags] = useState(tags);

    // Save Changes
    const handleSave = () => {
        onEdit(id, editedTitle, editedContent, editedTags);
        setIsEditing(false);
    };

    return (
        <div className="border rounded-xl p-5 bg-gradient-to-br from-pink-100 to-purple-100 shadow-md hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 mb-3">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
                <div>
                    {isEditing ? (
                        <input
                            type="text"
                            value={editedTitle}
                            onChange={(e) => setEditedTitle(e.target.value)}
                            className="text-md font-bold text-purple-700 border-b border-purple-300 outline-none bg-transparent"
                        />
                    ) : (
                        <h6 className="text-md font-bold text-purple-700">{title}</h6>
                    )}
                    <span className="text-xs text-slate-500">{date}</span>
                </div>

                <MdOutlinePushPin
                    className={`text-xl cursor-pointer ${isPinned ? "text-purple-500" : "text-slate-300"} hover:scale-110 transition-transform duration-200`}
                    onClick={onPinNote}
                />
            </div>

            {/* Content */}
            {isEditing ? (
                <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    className="text-sm text-slate-700 w-full p-1 border border-purple-300 rounded-md bg-transparent"
                />
            ) : (
                <p className="text-sm text-slate-700 mt-2">{content}</p>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between mt-4">
                {/* Tags Section */}
                {isEditing ? (
                    <input
                        type="text"
                        value={editedTags}
                        onChange={(e) => setEditedTags(e.target.value)}
                        className="text-xs px-2 py-1 rounded-full border border-purple-300 text-purple-700 bg-transparent"
                    />
                ) : (
                    <div className="text-xs px-2 py-1 rounded-full bg-purple-200 text-purple-700">{tags}</div>
                )}

                {/* Action Icons */}
                <div className="flex items-center gap-3">
                    {isEditing ? (
                        <>
                            <MdSave
                                className="text-xl text-blue-500 cursor-pointer hover:scale-110 transition-transform duration-200"
                                onClick={handleSave}
                            />
                            <MdClose
                                className="text-xl text-gray-500 cursor-pointer hover:scale-110 transition-transform duration-200"
                                onClick={() => setIsEditing(false)}
                            />
                        </>
                    ) : (
                        <>
                            <MdCreate
                                className="text-xl text-green-500 cursor-pointer hover:scale-110 transition-transform duration-200"
                                onClick={() => setIsEditing(true)}
                            />
                            <MdDelete
                                className="text-xl text-red-500 cursor-pointer hover:scale-110 transition-transform duration-200"
                                onClick={() => onDelete(id)}
                            />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NoteCard;
