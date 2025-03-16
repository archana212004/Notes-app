import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import NoteCard from "../../components/Cards/NoteCard";
import { MdAdd } from "react-icons/md";
import AddEditNotes from "./AddEditNotes";
import Modal from "react-modal";
import backgroundImage from "../../assets/background.jpg";

const Home = () => {
    const [openAddEditModal, setOpenAddEditModel] = useState({
        isShown: false,
        type: "add",
        data: null,
    });

    // ✅ Notes State
    const [notes, setNotes] = useState([
        {
            id: 1,
            title: "Meeting on 2nd Jan",
            date: "02-01-2026",
            content: "Meeting on 2nd Jan",
            tags: ["#meeting"],
            isPinned: true,
        },
        {
            id: 2,
            title: "Project Deadline",
            date: "10-02-2026",
            content: "Finalize project submission",
            tags: ["#work"],
            isPinned: false,
        },
        {
            id: 3,
            title: "Doctor's Appointment",
            date: "15-03-2026",
            content: "Visit doctor at 4 PM",
            tags: ["#health"],
            isPinned: true,
        },
        {
            id: 4,
            title: "Grocery Shopping",
            date: "20-03-2026",
            content: "Buy vegetables, milk, and eggs",
            tags: ["#personal"],
            isPinned: false,
        },
    ]);

    // ✅ Function to ADD a New Note
    const handleSaveNote = (newNote) => {
        const noteWithId = { ...newNote, id: Date.now(), date: new Date().toLocaleDateString(), isPinned: false };
        setNotes([...notes, noteWithId]); // Append new note
        setOpenAddEditModel({ isShown: false, type: "add", data: null }); // Close modal
    };

    // ✅ Function to TOGGLE PIN
    const handlePinNote = (id) => {
        setNotes(notes.map(note => note.id === id ? { ...note, isPinned: !note.isPinned } : note));
    };

    // ✅ Function to DELETE Note
    const handleDeleteNote = (id) => {
        setNotes(notes.filter(note => note.id !== id));
    };

    return (
        <>
            <Navbar />

            <div
                style={{
                    minHeight: "100vh",
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    backgroundAttachment: "fixed",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: "20px",
                }}
            >
                {/* ✅ Notes Display */}
                <div className="container mx-auto">
                    <div className="grid grid-cols-3 gap-4 mt-8">
                        {notes.map((note) => (
                            <NoteCard
                                key={note.id}
                                title={note.title}
                                date={note.date}
                                content={note.content}
                                tags={note.tags}
                                isPinned={note.isPinned}
                                onEdit={() => {
                                    setOpenAddEditModel({ isShown: true, type: "edit", data: note });
                                }}
                                onDelete={() => handleDeleteNote(note.id)}
                                onPinNote={() => handlePinNote(note.id)}
                            />
                        ))}
                    </div>
                </div>

                {/* Floating Add Button */}
                <button
                    className="w-16 h-16 flex items-center justify-center rounded-2xl bg-blue-600 absolute right-10 bottom-10"
                    onClick={() => {
                        setOpenAddEditModel({ isShown: true, type: "add", data: null });
                    }}
                >
                    <MdAdd className="text-[32px] text-white" />
                </button>

                {/* Modal for Adding/Editing Notes */}
                <Modal
                    isOpen={openAddEditModal.isShown}
                    onRequestClose={() => setOpenAddEditModel({ isShown: false, type: "add", data: null })}
                    style={{
                        overlay: {
                            backgroundColor: "rgba(0,0,0,0.2)",
                        },
                    }}
                    contentLabel="Add/Edit Note"
                    className="w-[60%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll"
                >
                    <AddEditNotes 
                        type={openAddEditModal.type}
                        initialData={openAddEditModal.data}
                        onSave={handleSaveNote}
                        onClose={() => setOpenAddEditModel({ isShown: false, type: "add", data: null })}
                    />
                </Modal>
            </div>
        </>
    );
};

export default Home;
