import { useState } from "react";
import StarRating from "./StarRating";

const getRatingColor = (rating) => {
    if (rating >= 4) return "rating-high";
    if (rating >= 3) return "rating-mid";
    return "rating-low";
};

const StoreCard = ({ store, onSubmitRating, onUpdateRating, canRate = false }) => {
    const overall = Number(store.average_rating) || 0;
    const userRating = store.user_rating ? Number(store.user_rating) : null;
    const [selectedRating, setSelectedRating] = useState(userRating || 0);
    const [submitting, setSubmitting] = useState(false);
    const [feedback, setFeedback] = useState("");

    const handleSubmit = async () => {
        if (selectedRating < 1 || selectedRating > 5) {
            setFeedback("Please select a rating between 1 and 5.");
            return;
        }

        setSubmitting(true);
        setFeedback("");

        try {
            if (userRating) {
                await onUpdateRating(store.id, selectedRating);
                setFeedback("Rating updated!");
            } else {
                await onSubmitRating(store.id, selectedRating);
                setFeedback("Rating submitted!");
            }
        } catch (err) {
            setFeedback(err.response?.data?.message || "Failed to save rating.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <article className="store-card">
            <div className="store-card-header">
                <div className="store-avatar" aria-hidden="true">
                    {store.name.charAt(0).toUpperCase()}
                </div>
                <div className="store-info">
                    <h3 className="store-name">{store.name}</h3>
                    <p className="store-address">{store.address}</p>
                </div>
                <div className={`rating-badge ${getRatingColor(overall)}`}>
                    <span className="rating-star">★</span>
                    <span className="rating-value">
                        {overall > 0 ? overall.toFixed(1) : "—"}
                    </span>
                </div>
            </div>

            <div className="store-card-body">
                <div className="rating-row">
                    <span className="rating-label">Overall rating</span>
                    <StarRating value={Math.round(overall)} readonly size="sm" />
                    <span className="rating-count">
                        {store.total_ratings > 0
                            ? `(${store.total_ratings} ratings)`
                            : "(No ratings yet)"}
                    </span>
                </div>

                {canRate && <>
                    <div className="rating-row">
                        <span className="rating-label">Your rating</span>
                        {userRating ? <span className="your-rating">{userRating} / 5</span> : <span className="your-rating none">Not rated</span>}
                    </div>
                    <div className="rating-input-section">
                        <span className="rating-label">{userRating ? "Update your rating" : "Rate this store"}</span>
                        <StarRating value={selectedRating} onChange={setSelectedRating} />
                    </div>
                </>}

                {feedback && (
                    <p className={`rating-feedback ${feedback.includes("!") ? "success" : "error"}`}>
                        {feedback}
                    </p>
                )}
            </div>

            {canRate && <div className="store-card-footer">
                <button
                    type="button"
                    className="btn-rate"
                    onClick={handleSubmit}
                    disabled={submitting || selectedRating < 1}
                >
                    {submitting
                        ? "Saving..."
                        : userRating
                          ? "Update Rating"
                          : "Submit Rating"}
                </button>
            </div>}
        </article>
    );
};

export default StoreCard;
