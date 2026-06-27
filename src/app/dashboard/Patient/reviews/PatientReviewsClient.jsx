"use client";

import { useState } from "react";
import { MessageSquare, Star, Edit3, Trash2, Plus } from "lucide-react";

const PatientReviewsClient = ({ initialReviews, doctors, patientId }) => {
    const [reviews, setReviews] = useState(initialReviews);
    const [activeReview, setActiveReview] = useState(null);
    const [modalType, setModalType] = useState(null); // 'add' | 'edit' | 'delete'

    // ফর্ম স্টেটস
    const [selectedDoctorId, setSelectedDoctorId] = useState("");
    const [rating, setRating] = useState(5);
    const [reviewText, setReviewText] = useState("");

    const openModal = (type, review = null) => {
        setModalType(type);
        if (review) {
            setActiveReview(review);
            setRating(review.rating);
            setReviewText(review.reviewText);
        } else {
            // 🚀 doctors একটি অ্যারে এবং তার লেংথ আছে কিনা নিশ্চিত হওয়া
            setSelectedDoctorId(Array.isArray(doctors) && doctors.length > 0 ? doctors[0]._id : "");
            setRating(5);
            setReviewText("");
        }
    };

    const closeModal = () => {
        setModalType(null);
        setActiveReview(null);
    };

    // ➕ Action: Add Review
    const handleAddReview = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/reviews/add`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ patientId, doctorId: selectedDoctorId, rating, reviewText }),
            });
            if (res.ok) {
                // পেজ রিলোড বা স্টেট আপডেট করে নতুন ডেটা রিফ্লেক্ট করা
                window.location.reload();
            }
        } catch (error) {
            console.error(error);
        }
    };

    // 🔄 Action: Update Review
    const handleUpdateReview = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`http://localhost:5000/api/reviews/update/${activeReview._id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ rating, reviewText }),
            });
            if (res.ok) {
                setReviews(reviews.map(r => r._id === activeReview._id ? { ...r, rating, reviewText } : r));
                closeModal();
            }
        } catch (error) {
            console.error(error);
        }
    };

    // ❌ Action: Delete Review
    const handleDelete = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/reviews/delete/${activeReview._id}`, { method: "DELETE" });
            if (res.ok) {
                setReviews(reviews.filter(r => r._id !== activeReview._id));
                closeModal();
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="space-y-4">
            {/* নতুন রিভিউ দেওয়ার ট্রিগার বাটন */}
            <div className="flex justify-end">
                <button
                    onClick={() => openModal("add")}
                    className="flex items-center gap-1.5 bg-blue-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-blue-700 transition shadow-sm"
                >
                    <Plus className="size-4" /> Write A New Review
                </button>
            </div>

            {reviews.length === 0 ? (
                <div className="text-center py-16 bg-white border border-dashed rounded-2xl p-8 text-gray-400">
                    <MessageSquare className="size-12 mx-auto mb-3 opacity-30 text-blue-500" />
                    <p className="text-sm font-medium">You haven&apos;t submitted any reviews yet.</p>
                </div>
            ) : (
                /* 📱 🖥️ ১০০% রেসপন্সিভ রিভিউ গ্রিড/লিস্ট */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {reviews.map((rev) => (
                        <div key={rev._id} className="bg-white border rounded-2xl p-5 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition">
                            <div className="space-y-2">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-gray-800 text-base">{rev.doctorDetails?.doctorName || "Medical Practitioner"}</h3>
                                        <p className="text-[10px] text-gray-400 font-medium" suppressHydrationWarning>
                                            Posted on: {new Date(rev.reviewDate?.$date || rev.reviewDate).toISOString().split('T')[0]}
                                        </p>
                                    </div>

                                    {/* স্টার্স শোকেস */}
                                    <div className="flex items-center gap-0.5 text-amber-400 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100">
                                        <Star className="size-3 fill-amber-400" />
                                        <span className="text-xs font-bold text-amber-700">{rev.rating}</span>
                                    </div>
                                </div>

                                <p className="text-xs text-gray-600 leading-relaxed bg-zinc-50/50 p-3 rounded-xl border border-dashed">
                                    {`"${rev.reviewText}"`}
                                </p>
                            </div>

                            {/* অ্যাকশন বাটনসমূহ */}
                            <div className="flex justify-end items-center gap-2 pt-2 border-t border-zinc-100">
                                <button onClick={() => openModal("edit", rev)} className="flex items-center gap-1 px-3 py-1.5 border hover:bg-gray-50 text-gray-600 rounded-xl text-xs font-semibold transition">
                                    <Edit3 className="size-3.5" /> Edit
                                </button>
                                <button onClick={() => openModal("delete", rev)} className="flex items-center gap-1 px-3 py-1.5 border border-red-100 text-red-600 hover:bg-red-50 rounded-xl text-xs font-semibold transition">
                                    <Trash2 className="size-3.5" /> Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ─── 📦 HEROUI STYLE MODALS ─── */}
            {modalType && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border space-y-4 animate-in fade-in zoom-in-95 duration-200">

                        {/* ১. ADD / EDIT FORM MODAL */}
                        {(modalType === "add" || modalType === "edit") && (
                            <form onSubmit={modalType === "add" ? handleAddReview : handleUpdateReview} className="space-y-4">
                                <h3 className="text-lg font-bold text-gray-800 border-b pb-2">
                                    {modalType === "add" ? "Write a Practitioner Review" : "Modify Your Feedback"}
                                </h3>

                                {modalType === "add" && (
                                    <div>
                                        <label className="text-xs font-semibold text-gray-600 block mb-1">Select Doctor</label>
                                        <select
                                            value={selectedDoctorId}
                                            onChange={(e) => setSelectedDoctorId(e.target.value)}
                                            className="w-full border p-2.5 rounded-xl text-sm bg-gray-50 outline-none"
                                        >
                                            {/* 🚀 Array.isArray দিয়ে চেক করে লুপ চালানো হচ্ছে যাতে ক্র্যাশ না করে */}
                                            {Array.isArray(doctors) && doctors.map(doc => (
                                                <option key={doc._id} value={doc._id}>{doc.doctorName} ({doc.specialization})</option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                {/* স্টার রেটিং সিলেকশন */}
                                <div>
                                    <label className="text-xs font-semibold text-gray-600 block mb-1">Rating Score</label>
                                    <div className="flex gap-1.5">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setRating(star)}
                                                className="focus:outline-none"
                                            >
                                                <Star className={`size-6 ${star <= rating ? "text-amber-400 fill-amber-400" : "text-gray-200"}`} />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* রিভিউ টেক্সট এরিয়া */}
                                <div>
                                    <label className="text-xs font-semibold text-gray-600 block mb-1">Your Review / Experience</label>
                                    <textarea
                                        value={reviewText}
                                        onChange={(e) => setReviewText(e.target.value)}
                                        required
                                        rows={4}
                                        placeholder="Describe your appointment, friendliness, treatment quality..."
                                        className="w-full border p-3 rounded-xl text-xs bg-gray-50 focus:bg-white outline-none resize-none leading-relaxed"
                                    />
                                </div>

                                <div className="flex gap-2 pt-2">
                                    <button type="button" onClick={closeModal} className="w-full border py-2.5 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-50 transition">Cancel</button>
                                    <button type="submit" className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-semibold text-xs hover:bg-blue-700 transition">
                                        {modalType === "add" ? "Publish Review" : "Update Feedback"}
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* ২. DELETE CONFIRMATION MODAL */}
                        {modalType === "delete" && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-red-600 border-b pb-2">Delete Review?</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">
                                    Are you sure you want to permanently delete your review for <span className="font-bold text-gray-800">{activeReview?.doctorDetails?.doctorName}</span>? This item cannot be recovered.
                                </p>
                                <div className="flex gap-2 pt-2">
                                    <button onClick={closeModal} className="w-full border py-2.5 rounded-xl text-xs font-semibold text-gray-600 hover:bg-gray-50 transition">Keep It</button>
                                    <button onClick={handleDelete} className="w-full bg-red-600 text-white py-2.5 rounded-xl font-semibold text-xs hover:bg-red-700 transition">Yes, Remove</button>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            )}
        </div>
    );
};

export default PatientReviewsClient;