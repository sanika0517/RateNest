const StarRating = ({ value, onChange, readonly = false, size = "md" }) => {
    const stars = [1, 2, 3, 4, 5];

    return (
        <div className={`star-rating star-rating-${size}`} role={readonly ? "img" : "group"} aria-label={`Rating: ${value || 0} out of 5`}>
            {stars.map((star) => (
                <button
                    key={star}
                    type="button"
                    className={`star-btn ${star <= value ? "active" : ""}`}
                    onClick={() => !readonly && onChange?.(star)}
                    disabled={readonly}
                    aria-label={`${star} star${star > 1 ? "s" : ""}`}
                >
                    ★
                </button>
            ))}
        </div>
    );
};

export default StarRating;
