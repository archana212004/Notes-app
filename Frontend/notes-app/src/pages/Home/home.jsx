import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import NoteCard from "../../components/Cards/NoteCard";
import { MdAdd } from "react-icons/md";
import AddEditNotes from "./AddEditNotes";
import Modal from "react-modal";
import backgroundImage from "../../assets/background.jpg"; // Import background image

const Home = () => {

    const [openAddEditModal, setOpenAddEditModel] = useState({
        isShown: false,
        type: "add",
        data: null,
    });

    return (
        <>
            <Navbar />

            {/* Background Image Wrapper */}
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

                <div className="container mx-auto">
                    <div className="grid grid-cols-3 gap-4 mt-8">
                        <NoteCard
                            title="Meeting on 2nd Jan"
                            date="02-01-2026"
                            content="Meeting on 2nd Jan"
                            tags="#meeting"
                            isPinned={true}
                            onEdit={() => {}}
                            onDelete={() => {}}
                            onPinNote={() => {}}
                        />

                        <NoteCard
                            title="Project Deadline"
                            date="10-02-2026"
                            content="Finalize project submission"
                            tags="#work"
                            isPinned={false}
                            onEdit={() => {}}
                            onDelete={() => {}}
                            onPinNote={() => {}}
                        />

                        <NoteCard
                            title="Doctor's Appointment"
                            date="15-03-2026"
                            content="Visit doctor at 4 PM"
                            tags="#health"
                            isPinned={true}
                            onEdit={() => {}}
                            onDelete={() => {}}
                            onPinNote={() => {}}
                        />

                        <NoteCard
                            title="Grocery Shopping"
                            date="20-03-2026"
                            content="Buy vegetables, milk, and eggs"
                            tags="#personal"
                            isPinned={false}
                            onEdit={() => {}}
                            onDelete={() => {}}
                            onPinNote={() => {}}
                        />
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
                    <AddEditNotes />
                </Modal>
            </div>
        </>
    );
};

export default Home;
