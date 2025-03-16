import React from "react";
import { MdOutlinePushPin } from "react-icons/md";
import { MdCreate, MdDelete } from "react-icons/md";

const NoteCard = ({
    title,
    date,
    content,
    tags,
    isPinned,
    onEdit,
    onDelete,
    onPinNote
}) => {
    return (
        <div className="border rounded-xl p-5 bg-gradient-to-br from-pink-100 to-purple-100 shadow-md hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
                <div>
                    <h6 className="text-md font-bold text-purple-700">{title}</h6>
                    <span className="text-xs text-slate-500">{date}</span>
                </div>

                <MdOutlinePushPin
                    className={`text-xl cursor-pointer ${
                        isPinned ? "text-purple-500" : "text-slate-300"
                    } hover:scale-110 transition-transform duration-200`}
                    onClick={onPinNote}
                />
            
            </div>
                    
            {/* Content */}
            <p className="text-sm text-slate-700 mt-2">{content?.slice(0, 60)}...</p>

            {/* Footer */}
            <div className="flex items-center justify-between mt-4">
                {/* Tags Section */}
                <div className="text-xs px-2 py-1 rounded-full bg-purple-200 text-purple-700">
                    {tags}
                </div>

                {/* Action Icons */}
                <div className="flex items-center gap-3">
                    <MdCreate
                        className="text-xl text-green-500 cursor-pointer hover:scale-110 transition-transform duration-200"
                        onClick={onEdit}
                    />
                    <MdDelete
                        className="text-xl text-red-500 cursor-pointer hover:scale-110 transition-transform duration-200"
                        onClick={onDelete}
                    />
                </div>
            </div>
        </div>
    );
};

export default NoteCard;
