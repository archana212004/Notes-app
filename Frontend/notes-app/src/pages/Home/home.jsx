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

// Add these styles at the top of the file, after the imports
const modalStyles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
    },
    content: {
        position: 'relative',
        top: 'auto',
        left: 'auto',
        right: 'auto',
        bottom: 'auto',
        margin: '20px',
        padding: 0,
        border: 'none',
        background: 'transparent',
        maxWidth: '500px',
        width: '100%'
    }
};

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
            
            console.log('Fetching notes...');
            const response = await fetch(`${API_BASE_URL}/api/notes`, {
                method: "GET",
                ...getDefaultOptions(token)
            });

            const data = await response.json();
            console.log('Fetched notes:', data);

            if (!response.ok || !data.success) {
                throw new Error(data.error || "Failed to fetch notes");
            }

            setNotes(data.notes || []);
        } catch (err) {
            console.error('Error fetching notes:', err);
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

            const url = noteId 
                ? `${API_BASE_URL}/api/notes/${noteId}`
                : `${API_BASE_URL}/api/notes`;

            console.log('Making request to:', url);
            console.log('With data:', noteData);

            const response = await fetch(url, {
                method: noteId ? "PUT" : "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(noteData)
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.error || `Failed to ${noteId ? 'update' : 'create'} note`);
            }

            console.log('Response data:', data);
            
            // Close modal only if operation was successful
            setOpenAddEditModel({ isShown: false, type: "add", data: null });
            // Fetch notes again to ensure we have the latest data
            await fetchNotes();
            return true;
        } catch (err) {
            console.error('Error in handleSaveNote:', err);
            setError(err.message || "Failed to save note. Please try again.");
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // ✅ Function to TOGGLE PIN
    const handlePinNote = async (id) => {
        try {
            setIsLoading(true);
            setError(null);
            const token = localStorage.getItem("token");
            
            const response = await fetch(`${API_BASE_URL}/api/notes/${id}/pin`, {
                method: "PATCH",
                ...getDefaultOptions(token)
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.error || "Failed to update pin status");
            }

            // Update local state with the new note data
            setNotes(prevNotes => prevNotes.map(note => 
                note._id === id ? data.note : note
            ));
        } catch (err) {
            handleApiError(err);
        } finally {
            setIsLoading(false);
        }
    };

    // ✅ Function to DELETE Note
    const handleDeleteNote = async (id) => {
        try {
            setIsLoading(true);
            setError(null);
            const token = localStorage.getItem("token");
            
            const response = await fetch(`${API_BASE_URL}/api/notes/${id}`, {
                method: "DELETE",
                ...getDefaultOptions(token)
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.error || "Failed to delete note");
            }

            // Update local state by removing the deleted note
            setNotes(prevNotes => prevNotes.filter(note => note._id !== id));
        } catch (err) {
            handleApiError(err);
        } finally {
            setIsLoading(false);
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
                {/* Add Note Button */}
                <div className="w-full max-w-6xl mx-auto mb-6">
                    <button
                        onClick={() => handleOpenModal("add")}
                        className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-300 flex items-center space-x-2"
                    >
                        <span>Add Note</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="w-full max-w-6xl mx-auto mb-6">
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                            <span className="block sm:inline">{error}</span>
                        </div>
                    </div>
                )}

                {/* Notes Grid */}
                <div className="w-full max-w-6xl mx-auto">
                    {isLoading ? (
                        <div className="text-center mt-20">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                            <p className="text-lg text-purple-600 mt-2">Loading your notes...</p>
                        </div>
                    ) : notes.length === 0 ? (
                        <div className="text-center mt-20">
                            <p className="text-xl text-gray-600">No notes yet. Click "Add Note" to create one!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {notes.map(note => (
                                <NoteCard
                                    key={note._id}
                                    note={note}
                                    onEdit={() => handleOpenModal("edit", note)}
                                    onDelete={() => handleDeleteNote(note._id)}
                                    onPin={() => handlePinNote(note._id)}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Add/Edit Modal */}
                <Modal
                    isOpen={openAddEditModal.isShown}
                    onRequestClose={handleCloseModal}
                    style={modalStyles}
                    contentLabel="Add/Edit Note"
                >
                    <AddEditNotes
                        type={openAddEditModal.type}
                        initialData={openAddEditModal.data}
                        onClose={handleCloseModal}
                        onSave={handleSaveNote}
                    />
                </Modal>
            </div>
        </>
    );
};

export default Home;
