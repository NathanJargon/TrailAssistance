import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Concerns.css';
import { getFirestore, collection, addDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import next from '../../assets/next.png';

const Concerns = ({ currentUser, onFormValid, onSaveInfo, onSaveAndNavigate }) => {
  const [concern, setConcern] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState({});
  const [purposeOfVisit, setPurposeOfVisit] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [preferredContactMethod, setPreferredContactMethod] = useState('');
  const [urgencyLevel, setUrgencyLevel] = useState('');
  const [additionalComments, setAdditionalComments] = useState('');
  const [errors, setErrors] = useState({});
  const db = getFirestore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (currentUser && currentUser.email) {
        const q = query(collection(db, 'concerns'), where('student_id', '==', currentUser.email));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data();
          setConcern(userData.details || '');
          setAdditionalInfo(userData.additional_info || {});
          setPurposeOfVisit(userData.purpose_of_visit || '');
          setAppointmentDate(userData.appointment_date || '');
          setPreferredContactMethod(userData.preferred_contact_method || '');
          setUrgencyLevel(userData.urgency_level || '');
          setAdditionalComments(userData.additional_comments || '');
        }
      }
    };

    fetchUserInfo();
  }, [currentUser, db]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert('You must be logged in to submit a concern.');
      return;
    }

    const newErrors = {};
    if (!purposeOfVisit) newErrors.purposeOfVisit = 'Purpose of visit is required';
    if (!appointmentDate) newErrors.appointmentDate = 'Appointment date is required';
    if (!preferredContactMethod) newErrors.preferredContactMethod = 'Preferred contact method is required';
    if (!urgencyLevel) newErrors.urgencyLevel = 'Urgency level is required';
    if (!concern) newErrors.concern = 'Concern/Request is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onFormValid(true);
    onSaveInfo({
      concern,
      additionalInfo,
      purposeOfVisit,
      appointmentDate,
      preferredContactMethod,
      urgencyLevel,
      additionalComments,
    });

    try {
      await addDoc(collection(db, 'concerns'), {
        student_id: currentUser.uid,
        email: currentUser.email,
        details: concern,
        student_type: currentUser.role || 'default',
        additional_info: additionalInfo,
        purpose_of_visit: purposeOfVisit,
        appointment_date: appointmentDate,
        preferred_contact_method: preferredContactMethod,
        urgency_level: urgencyLevel,
        additional_comments: additionalComments,
        time_of_entry: serverTimestamp(),
        status: 'in-progress',
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      });
      alert('Concern/Request submitted successfully!');
      setConcern('');
      setAdditionalInfo({});
      setPurposeOfVisit('');
      setAppointmentDate('');
      setPreferredContactMethod('');
      setUrgencyLevel('');
      setAdditionalComments('');
      onSaveAndNavigate('websiteFeedback');
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
    <form onSubmit={handleSubmit} className="concerns-form">
      <h2>Submit Your Concern/Request</h2>
      <hr />
      <div className="concerns-input-group">
        <div>
          <label htmlFor="purpose_of_visit">Purpose of Visit:</label>
          <input
            type="text"
            id="purpose_of_visit"
            name="purpose_of_visit"
            value={purposeOfVisit}
            onChange={(e) => setPurposeOfVisit(e.target.value)}
            required
          />
          {errors.purposeOfVisit && <span className="error-text">{errors.purposeOfVisit}</span>}
        </div>
        <div>
          <label htmlFor="appointment_date">Appointment Date and Time:</label>
          <input
            type="datetime-local"
            id="appointment_date"
            name="appointment_date"
            value={appointmentDate}
            onChange={(e) => setAppointmentDate(e.target.value)}
            required
          />
          {errors.appointmentDate && <span className="error-text">{errors.appointmentDate}</span>}
        </div>
      </div>
      <div className="concerns-input-group">
        <div>
          <label htmlFor="preferred_contact_method">Preferred Contact Method:</label>
          <input
            type="text"
            id="preferred_contact_method"
            name="preferred_contact_method"
            value={preferredContactMethod}
            onChange={(e) => setPreferredContactMethod(e.target.value)}
            required
          />
          {errors.preferredContactMethod && <span className="error-text">{errors.preferredContactMethod}</span>}
        </div>
        <div>
          <label htmlFor="urgency_level">Urgency Level:</label>
          <select
            id="urgency_level"
            name="urgency_level"
            value={urgencyLevel}
            onChange={(e) => setUrgencyLevel(e.target.value)}
            required
          >
            <option value="">Select Urgency Level</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          {errors.urgencyLevel && <span className="error-text">{errors.urgencyLevel}</span>}
        </div>
      </div>
      {currentUser && currentUser.role === 'undergraduate' && (
        <div className="concerns-input-group">
          <div>
            <label htmlFor="program">Program:</label>
            <input
              type="text"
              id="program"
              name="program"
              value={additionalInfo.program || ''}
              onChange={handleAdditionalInfoChange}
              required
            />
          </div>
          <div>
            <label htmlFor="year_of_study">Year of Study:</label>
            <input
              type="number"
              id="year_of_study"
              name="year_of_study"
              value={additionalInfo.year_of_study || ''}
              onChange={handleAdditionalInfoChange}
              required
            />
          </div>
          <div>
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
        </div>
      )}
      {currentUser && currentUser.role === 'graduate' && (
        <div className="concerns-input-group">
          <div>
            <label htmlFor="program">Program:</label>
            <input
              type="text"
              id="program"
              name="program"
              value={additionalInfo.program || ''}
              onChange={handleAdditionalInfoChange}
              required
            />
          </div>
          <div>
            <label htmlFor="field_of_study">Field of Study:</label>
            <input
              type="text"
              id="field_of_study"
              name="field_of_study"
              value={additionalInfo.field_of_study || ''}
              onChange={handleAdditionalInfoChange}
              required
            />
          </div>
          <div>
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
        </div>
      )}
      {(!currentUser || !currentUser.role || currentUser.role === 'default') && (
        <div className="concerns-input-group">
          <div>
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
        </div>
      )}
      <div className="concerns-input-group">
        <div>
          <label htmlFor="additional_comments">Additional Comments:</label>
          <textarea
            id="additional_comments"
            name="additional_comments"
            value={additionalComments}
            onChange={(e) => setAdditionalComments(e.target.value)}
            className="concerns-textarea"
          />
        </div>
      </div>
      <div className="concerns-input-group">
        <div>
          <label htmlFor="concern">Concern/Request:</label>
          <textarea
            id="concern"
            name="concern"
            value={concern}
            onChange={(e) => setConcern(e.target.value)}
            className="concerns-textarea"
            required
          />
          {errors.concern && <span className="error-text">{errors.concern}</span>}
        </div>
      </div>
      <button type="submit" className="concerns-submit-btn">
        Submit
        <img src={next} alt="Next Icon" className="next-icon" />
      </button>
    </form>
  );
};

export default Concerns;