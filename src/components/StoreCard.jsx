const StoreCard = ({ store, onRate }) => {
    return (
        <div className="store-card">

            <div className="store-card-top">

                <div className="store-icon">
                    {store.name.charAt(0).toUpperCase()}
                </div>

                <div>
                    <h3>{store.name}</h3>

                    <p className="store-address">
                        📍 {store.address}
                    </p>
                </div>

            </div>

            <div className="store-rating">

                <span className="star">★</span>

                <strong>
                    {Number(store.average_rating).toFixed(1)}
                </strong>

                <span className="rating-count">
                    ({store.total_ratings} ratings)
                </span>

            </div>

            <div className="store-footer">

                <span>
                    {store.email}
                </span>

                <button onClick={() => onRate(store)}>
                    Rate Store
                </button>

            </div>

        </div>
    );
};

export default StoreCard;