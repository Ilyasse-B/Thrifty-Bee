import React, { useEffect, useState } from 'react';
import Star from './Star.js';
import './review.css';

const Review = ({ listingId, userId, isBuyerReview }) => {
    const [reviews, setReviews] = useState([]);
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const fetchReviews = async () => {
            try {
              const endpoint = isBuyerReview
                ? `http://127.0.0.1:5000/get_reviews_buyer?user_id=${userId}`
                : `http://127.0.0.1:5000/get_reviews_seller?listing_id=${listingId}`;
      
              const response = await fetch(endpoint);
              const data = await response.json();
      
              if (data.reviews) {
                setReviews(data.reviews);
                setUserName(data.user_name);
              } else {
                setReviews([]);
              }
            } catch (error) {
              console.error("Error fetching reviews:", error);
            }
          };

        fetchReviews();
    }, [listingId, userId, isBuyerReview]);

    return (
        <div className="review-container">
            <h2 className="review-title">Reviews for {userName || "this User"}</h2>
            {reviews.length > 0 ? (
                reviews.map((review, index) => (
                <div key={index} className="review-box">
                    <div className="review-header">
                        <strong>{isBuyerReview ? review.seller_name : review.buyer_name}</strong>
                        {/* Render stars */}
                      <div className="star-container">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} number={i + 1} starClick={false} />
                        ))}
                      </div>
                    </div>
                    <p className="review-description">{review.description}</p>
                </div>
        ))
      ) : (
        <p className="no-reviews">This user has no reviews</p>
      )}
        </div>
    );
};

export default Review;
