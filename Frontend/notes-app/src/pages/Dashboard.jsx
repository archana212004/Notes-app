import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NoteCard from "./NoteCard"; // Import NoteCard component

const Dashboard = () => {
    const navigate = useNavigate();
    const username = localStorage.getItem("username");

    // Sample notes (later, you can fetch these from a database)
    const [notes, setNotes] = useState([
        { id: 1, title: "React Basics", content: "Learned about components and state.", tags: "Work", isPinned: false },
        { id: 2, title: "Weekend Plans", content: "Go hiking and relax.", tags: "Personal", isPinned: true },
    ]);
    
    const [editingNote, setEditingNote] = useState(null); // Store the note being edited

    // Function to handle editing
    const handleEditNote = (id) => {
        const noteToEdit = notes.find(note => note.id === id);
        setEditingNote(noteToEdit);
    };

    // Function to save the edited note
    const handleSaveNote = (updatedNote) => {
        setNotes(notes.map(note => (note.id === updatedNote.id ? updatedNote : note))); // Update original note
        setEditingNote(null); // Clear editing state
    };

    // Function to delete a note
    const handleDeleteNote = (id) => {
        setNotes(notes.filter(note => note.id !== id));
    };

    // Function to toggle pin status
    const handlePinNote = (id) => {
        setNotes(notes.map(note => 
            note.id === id ? { ...note, isPinned: !note.isPinned } : note
        ));
    };

    // Logout function
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        navigate("/"); // Redirect to login
    };

    return (
        <div style={styles.container}>
            <h2>Welcome, {username ? username : "User"}! 🎉</h2>
            <p>This is your dashboard.</p>

            {/* Notes Section */}
            <div style={styles.notesContainer}>
                {notes.map((note) => (
                    <NoteCard
                        key={note.id}
                        id={note.id}
                        title={note.title}
                        date={new Date().toLocaleDateString()}
                        content={note.content}
                        tags={note.tags}
                        isPinned={note.isPinned}
                        onEdit={handleEditNote}
                        onDelete={handleDeleteNote}
                        onPinNote={() => handlePinNote(note.id)}
                    />
                ))}
            </div>

            {/* Edit Note Form */}
            {editingNote && (
                <div style={styles.editContainer}>
                    <h3>Edit Note</h3>
                    <input
                        type="text"
                        style={styles.input}
                        value={editingNote.title}
                        onChange={(e) => setEditingNote({ ...editingNote, title: e.target.value })}
                    />
                    <textarea
                        style={styles.input}
                        value={editingNote.content}
                        onChange={(e) => setEditingNote({ ...editingNote, content: e.target.value })}
                    ></textarea>
                    <button style={styles.saveButton} onClick={() => handleSaveNote(editingNote)}>
                        Save
                    </button>
                </div>
            )}

            <button style={styles.logoutButton} onClick={handleLogout}>
                Logout
            </button>
        </div>
    );
};

// Simple inline styles
const styles = {
    container: {
        textAlign: "center",
        padding: "50px",
    },
    logoutButton: {
        marginTop: "20px",
        padding: "10px 20px",
        fontSize: "16px",
        backgroundColor: "#ff4d4d",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
    },
    notesContainer: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "10px",
        marginTop: "20px",
    },
    editContainer: {
        backgroundColor: "#f9f9f9",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
        margin: "20px auto",
        width: "50%",
    },
    input: {
        width: "100%",
        padding: "8px",
        margin: "10px 0",
        border: "1px solid #ccc",
        borderRadius: "4px",
    },
    saveButton: {
        backgroundColor: "#4CAF50",
        color: "white",
        padding: "10px 20px",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
    },
};

export default Dashboard;
