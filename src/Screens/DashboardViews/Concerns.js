import React, { useState } from 'react';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

const Concerns = ({ currentUser }) => {
  const [concern, setConcern] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState({});
  const db = getFirestore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert('You must be logged in to submit a concern.');
      return;
    }

    try {
      await addDoc(collection(db, 'concerns'), {
        student_id: currentUser.uid,
        details: concern,
        student_type: currentUser.role || 'default',
        additional_info: additionalInfo,
        time_of_entry: serverTimestamp(),
        status: 'in-progress',
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      });
      alert('Concern/Request submitted successfully!');
      setConcern('');
      setAdditionalInfo({});
    } catch (error) {
      console.error('Error submitting concern: ', error);
      alert('Failed to submit concern. Please try again.');
    }
  };

  const handleAdditionalInfoChange = (e) => {
    setAdditionalInfo({
      ...additionalInfo,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="dashboard-form">
      <h2>Submit Your Concern/Request</h2>
      <hr />
      <div className="dashboard-input-group">
        <textarea
          placeholder="Enter your concern or request here..."
          value={concern}
          onChange={(e) => setConcern(e.target.value)}
          required
          className="dashboard-textarea"
        />
      </div>
      {currentUser && currentUser.role === 'undergraduate' && (
        <div className="dashboard-input-group">
          <label htmlFor="program">Program:</label>
          <input
            type="text"
            id="program"
            name="program"
            value={additionalInfo.program || ''}
            onChange={handleAdditionalInfoChange}
            required
          />
          <label htmlFor="year_of_study">Year of Study:</label>
          <input
            type="number"
            id="year_of_study"
            name="year_of_study"
            value={additionalInfo.year_of_study || ''}
            onChange={handleAdditionalInfoChange}
            required
          />
          <label htmlFor="major">Major:</label>
          <input
            type="text"
            id="major"
            name="major"
            value={additionalInfo.major || ''}
            onChange={handleAdditionalInfoChange}
            required
          />
        </div>
      )}
      {currentUser && currentUser.role === 'graduate' && (
        <div className="dashboard-input-group">
          <label htmlFor="program">Program:</label>
          <input
            type="text"
            id="program"
            name="program"
            value={additionalInfo.program || ''}
            onChange={handleAdditionalInfoChange}
            required
          />
          <label htmlFor="field_of_study">Field of Study:</label>
          <input
            type="text"
            id="field_of_study"
            name="field_of_study"
            value={additionalInfo.field_of_study || ''}
            onChange={handleAdditionalInfoChange}
            required
          />
          <label htmlFor="advisor">Advisor:</label>
          <input
            type="text"
            id="advisor"
            name="advisor"
            value={additionalInfo.advisor || ''}
            onChange={handleAdditionalInfoChange}
            required
          />
        </div>
      )}
      {(!currentUser || !currentUser.role || currentUser.role === 'default') && (
        <div className="dashboard-input-group">
          <label htmlFor="additional_info">Additional Info:</label>
          <input
            type="text"
            id="additional_info"
            name="additional_info"
            value={additionalInfo.additional_info || ''}
            onChange={handleAdditionalInfoChange}
            required
          />
        </div>
      )}
      <button type="submit" className="dashboard-submit-btn">
        Submit
      </button>
    </form>
  );
};

export default Concerns;