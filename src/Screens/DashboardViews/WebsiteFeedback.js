import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/WebsiteFeedback.css';
import { getFirestore, collection, addDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import next from '../../assets/next.png';
import thanks from '../../assets/thanks.png';

const WebsiteFeedback = ({ currentUser }) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const db = getFirestore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeedback = async () => {
      if (currentUser && currentUser.email) {
        const q = query(collection(db, 'ratings'), where('user_id', '==', currentUser.email));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const feedbackData = querySnapshot.docs[0].data();
          setRating(feedbackData.rating || 0);
          setFeedback(feedbackData.feedback || '');
          setSubmitted(true); // Directly show the success message if feedback exists
        }
      }
    };

    fetchFeedback();
  }, [currentUser, db]);

  const handleRatingChange = (e) => {
    setRating(e.target.value);
  };

  const handleFeedbackChange = (e) => {
    setFeedback(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert('You must be logged in to submit feedback.');
      return;
    }

    try {
      await addDoc(collection(db, 'ratings'), {
        user_id: currentUser.uid,
        rating: rating,
        feedback: feedback,
        created_at: serverTimestamp(),
      });
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting feedback: ', error);
      alert('Failed to submit feedback. Please try again.');
    }
  };

  return (
    <div className="website-feedback">
      {!submitted && <h2>Website Feedback</h2>}
      {!submitted ? (
        <form onSubmit={handleSubmit} className="feedback-form">
          <div className="feedback-input-group">
            <label htmlFor="rating">Rating:</label>
            <select id="rating" name="rating" value={rating} onChange={handleRatingChange} required>
              <option value="">Select Rating</option>
              <option value="1">1 - Very Poor</option>
              <option value="2">2 - Poor</option>
              <option value="3">3 - Average</option>
              <option value="4">4 - Good</option>
              <option value="5">5 - Excellent</option>
            </select>
          </div>
          <div className="feedback-input-group">
            <label htmlFor="feedback">Feedback:</label>
            <textarea
              id="feedback"
              name="feedback"
              value={feedback}
              onChange={handleFeedbackChange}
              required
            />
          </div>
          <button type="submit" className="feedback-submit-btn">
            Submit
            <img src={next} alt="Next Icon" className="next-icon" />
          </button>
        </form>
      ) : (
        <div className="success-message">
          <p>You have successfully written down your concerns. You can now log out!</p>
          <img src={thanks} alt="Thanks Icon" className="thanks-icon" />
        </div>
      )}
    </div>
  );
};

export default WebsiteFeedback;