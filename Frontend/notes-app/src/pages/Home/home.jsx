import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import NoteCard from "../../components/Cards/NoteCard";
import AddEditNotes from "./AddEditNotes";
import Modal from "react-modal";
import backgroundImage from "../../assets/background.jpg";

// API base URL
const API_BASE_URL = "http://localhost:5022";

// Default fetch options for all API calls
const getDefaultOptions = (token) => ({
    headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
    }
});

const Home = () => {
    const navigate = useNavigate();
    const [openAddEditModal, setOpenAddEditModel] = useState({
        isShown: false,
        type: "add",
        data: null,
    });

    // Check for authentication
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
        } else {
            // Fetch user's notes when component mounts
            fetchNotes();
        }
    }, [navigate]);

    // ✅ Notes State
    const [notes, setNotes] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Helper function to handle API errors
    const handleApiError = (error) => {
        console.error("API Error:", error);
        if (error.message === "Failed to fetch") {
            setError("Cannot connect to server. Please check if the backend is running.");
        } else {
            setError(error.message || "An error occurred. Please try again.");
        }
        setIsLoading(false);
    };

    // ✅ Fetch user's notes
    const fetchNotes = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const token = localStorage.getItem("token");
            
            const response = await fetch(`${API_BASE_URL}/api/notes`, {
                method: "GET",
                ...getDefaultOptions(token)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || "Failed to fetch notes");
            }

            const data = await response.json();
            setNotes(data.notes || []);
        } catch (err) {
            handleApiError(err);
        } finally {
            setIsLoading(false);
        }
    };

    // ✅ Function to handle both CREATE and UPDATE notes
    const handleSaveNote = async (noteId, noteData) => {
        try {
            setIsLoading(true);
            setError(null);
            const token = localStorage.getItem("token");
            
            if (!token) {
                throw new Error("Authentication token not found. Please login again.");
            }

            console.log('Starting note save operation...'); // Debug log
            console.log('Token exists:', !!token); // Debug log
            console.log('Note data:', noteData); // Debug log

            if (openAddEditModal.type === 'edit' && noteId) {
                // Update existing note
                console.log('Updating existing note:', noteId); // Debug log
                const response = await fetch(`${API_BASE_URL}/api/notes/${noteId}`, {
                    method: "PUT",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(noteData)
                });

                console.log('Update response status:', response.status); // Debug log

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Failed to update note");
                }

                const updatedNote = await response.json();
                console.log('Note updated successfully:', updatedNote); // Debug log
                setNotes(notes.map(note => 
                    note._id === noteId 
                        ? { ...note, ...updatedNote.note }
                        : note
                ));
            } else {
                // Create new note
                console.log('Creating new note...'); // Debug log
                const response = await fetch(`${API_BASE_URL}/api/notes`, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(noteData)
                });

                console.log('Create response status:', response.status); // Debug log

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error('Error response:', errorData); // Debug log
                    throw new Error(errorData.error || "Failed to create note");
                }

                const newNote = await response.json();
                console.log('New note created:', newNote); // Debug log
                setNotes(prevNotes => [newNote.note, ...prevNotes]);
            }
            
            // Close modal only if the operation was successful
            setOpenAddEditModel({ isShown: false, type: "add", data: null });
        } catch (err) {
            console.error('Error in handleSaveNote:', err); // Debug log
            setError(err.message || "Failed to save note. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // ✅ Function to TOGGLE PIN
    const handlePinNote = async (id) => {
        try {
            setError(null);
            const token = localStorage.getItem("token");
            const note = notes.find(n => n._id === id);
            
            const response = await fetch(`${API_BASE_URL}/api/notes/${id}/pin`, {
                method: "PATCH",
                ...getDefaultOptions(token),
                body: JSON.stringify({ isPinned: !note.isPinned })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || "Failed to update pin status");
            }

            setNotes(notes.map(note => note._id === id ? { ...note, isPinned: !note.isPinned } : note));
        } catch (err) {
            handleApiError(err);
        }
    };

    // ✅ Function to DELETE Note
    const handleDeleteNote = async (id) => {
        try {
            setError(null);
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_BASE_URL}/api/notes/${id}`, {
                method: "DELETE",
                ...getDefaultOptions(token)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || "Failed to delete note");
            }

            setNotes(notes.filter(note => note._id !== id));
        } catch (err) {
            handleApiError(err);
        }
    };

    // ✅ Function to open Add/Edit modal
    const handleOpenModal = (type, note = null) => {
        setError(null); // Clear any previous errors
        setOpenAddEditModel({
            isShown: true,
            type: type,
            data: note
        });
    };

    // ✅ Function to close modal
    const handleCloseModal = () => {
        setError(null); // Clear any previous errors
        setOpenAddEditModel({
            isShown: false,
            type: "add",
            data: null
        });
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
                {/* Content Container */}
                <div className="w-full max-w-6xl mx-auto">
                    {isLoading ? (
                        <div className="text-center mt-20">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                            <p className="text-lg text-purple-600 mt-2">Loading your notes...</p>
                        </div>
                    ) : notes.length === 0 ? (
                        // Empty State Message
                        <div className="text-center mt-20 p-8 bg-white bg-opacity-90 rounded-xl shadow-lg max-w-md mx-auto">
                            <h2 className="text-2xl font-bold text-purple-700 mb-4">Welcome to Your Notes App! 📝</h2>
                            <p className="text-gray-600 mb-6">Start creating your first note!</p>
                            <button
                                onClick={() => handleOpenModal("add")}
                                className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors duration-300"
                            >
                                Create Your First Note
                            </button>
                        </div>
                    ) : (
                        // Notes Grid
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                            {/* Pinned Notes Section */}
                            {notes.some(note => note.isPinned) && (
                                <div className="col-span-full">
                                    <h2 className="text-xl font-semibold mb-3 text-purple-700">📌 Pinned Notes</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {notes
                                            .filter(note => note.isPinned)
                                            .map(note => (
                                                <NoteCard
                                                    key={note._id}
                                                    note={note}
                                                    onEdit={() => handleOpenModal("edit", note)}
                                                    onDelete={() => handleDeleteNote(note._id)}
                                                    onPin={() => handlePinNote(note._id)}
                                                />
                                            ))}
                                    </div>
                                </div>
                            )}

                            {/* Other Notes Section */}
                            {notes.some(note => !note.isPinned) && (
                                <div className="col-span-full mt-6">
                                    <h2 className="text-xl font-semibold mb-3 text-purple-700">📝 Other Notes</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {notes
                                            .filter(note => !note.isPinned)
                                            .map(note => (
                                                <NoteCard
                                                    key={note._id}
                                                    note={note}
                                                    onEdit={() => handleOpenModal("edit", note)}
                                                    onDelete={() => handleDeleteNote(note._id)}
                                                    onPin={() => handlePinNote(note._id)}
                                                />
                                            ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Floating Action Button for adding new note */}
                    <button
                        onClick={() => handleOpenModal("add")}
                        className="fixed bottom-8 right-8 w-14 h-14 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition-colors duration-300 flex items-center justify-center text-2xl"
                    >
                        +
                    </button>

                    {/* Add/Edit Note Modal */}
                    {openAddEditModal.isShown && (
                        <Modal
                            isOpen={openAddEditModal.isShown}
                            onRequestClose={handleCloseModal}
                            style={{
                                overlay: {
                                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                    zIndex: 1000
                                },
                                content: {
                                    top: '50%',
                                    left: '50%',
                                    right: 'auto',
                                    bottom: 'auto',
                                    marginRight: '-50%',
                                    transform: 'translate(-50%, -50%)',
                                    padding: 0,
                                    border: 'none',
                                    background: 'transparent'
                                }
                            }}
                        >
                            <AddEditNotes
                                onClose={handleCloseModal}
                                onSave={handleSaveNote}
                                initialData={openAddEditModal.data}
                                type={openAddEditModal.type}
                            />
                        </Modal>
                    )}
                </div>
            </div>
        </>
    );
};

export default Home;
