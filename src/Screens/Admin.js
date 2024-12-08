import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, doc, getDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import './styles/Admin.css';

const Admin = () => {
  const [students, setStudents] = useState([]);
  const [concerns, setConcerns] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [selectedConcern, setSelectedConcern] = useState(null);
  const [activeSection, setActiveSection] = useState('students');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const db = getFirestore();

  useEffect(() => {
    if (isAuthenticated) {
      const fetchStudents = async () => {
        const studentsCollection = collection(db, 'students');
        const studentsSnapshot = await getDocs(studentsCollection);
        const studentsList = studentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        studentsList.sort((a, b) => a.student_id - b.student_id);
        setStudents(studentsList);
      };

      const fetchConcerns = async () => {
        const concernsCollection = collection(db, 'concerns');
        const concernsSnapshot = await getDocs(concernsCollection);
        const concernsList = concernsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        concernsList.sort((a, b) => b.created_at.toMillis() - a.created_at.toMillis());
        setConcerns(concernsList);
      };

      const fetchRatings = async () => {
        const ratingsCollection = collection(db, 'ratings');
        const ratingsSnapshot = await getDocs(ratingsCollection);
        const ratingsList = ratingsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        ratingsList.sort((a, b) => b.created_at.toMillis() - a.created_at.toMillis());
        setRatings(ratingsList);
      };

      fetchStudents();
      fetchConcerns();
      fetchRatings();
    }
  }, [db, isAuthenticated]);

  const handleDeleteVisitor = async (id) => {
    await deleteDoc(doc(db, 'students', id));
    setStudents(students.filter(visitor => visitor.id !== id));
  };

  const handleDeleteConcern = async (id) => {
    await deleteDoc(doc(db, 'concerns', id));
    setConcerns(concerns.filter(concern => concern.id !== id));
  };

  const handleViewConcern = (concern) => {
    setSelectedConcern(concern);
    setActiveSection('viewConcern');
  };

  const handleLogin = async () => {
    try {
      const adminDoc = doc(db, 'admins', email);
      const adminSnapshot = await getDoc(adminDoc);
      if (adminSnapshot.exists()) {
        const adminData = adminSnapshot.data();
        if (adminData.pass === password) {
          setIsAuthenticated(true);
        } else {
          setError('Invalid password');
        }
      } else {
        setError('No admin found with this email');
      }
    } catch (error) {
      setError('Error logging in');
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    let date;
    if (timestamp instanceof Timestamp) {
      date = timestamp.toDate();
    } else if (typeof timestamp === 'string' || timestamp instanceof Date) {
      date = new Date(timestamp);
    } else {
      return 'Invalid timestamp';
    }
    return date.toLocaleString();
  };

  return (
    <div className="admin-page">
      {!isAuthenticated && (
        <div className="admin-login-modal">
          <div className="admin-login-content">
            <h2 className="admin-login-title">Admin Login</h2>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="admin-login-input"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="admin-login-input"
            />
            <button onClick={handleLogin} className="admin-login-button">Login</button>
            {error && <p className="admin-error">{error}</p>}
          </div>
        </div>
      )}
      {isAuthenticated && (
        <>
          <div className="admin-toggle-buttons">
            <button onClick={() => setActiveSection('students')} className="admin-button">Students</button>
            <button onClick={() => setActiveSection('concerns')} className="admin-button">Concerns</button>
            <button onClick={() => setActiveSection('ratings')} className="admin-button">Ratings</button>
          </div>
          {activeSection === 'students' && (
            <div className="admin-section">
              <h2>Students</h2>
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th className="admin-th">Student ID</th>
                      <th className="admin-th">Name</th>
                      <th className="admin-th">Email</th>
                      <th className="admin-th">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.slice(0, 20).map((visitor, index) => (
                      <tr key={index}>
                        <td className="admin-td">{visitor.student_id}</td>
                        <td className="admin-td">{visitor.name}</td>
                        <td className="admin-td">{visitor.email}</td>
                        <td className="admin-td">
                          <button onClick={() => handleDeleteVisitor(visitor.id)} className="admin-button">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {activeSection === 'concerns' && (
            <div className="admin-section">
              <h2>Concerns</h2>
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th className="admin-th">Student ID</th>
                      <th className="admin-th">Concern</th>
                      <th className="admin-th">Status</th>
                      <th className="admin-th">Created At</th>
                      <th className="admin-th">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {concerns.map((concern, index) => (
                      <tr key={index}>
                        <td className="admin-td">{concern.student_id}</td>
                        <td className="admin-td">{concern.details}</td>
                        <td className="admin-td">{concern.status}</td>
                        <td className="admin-td">{formatTimestamp(concern.created_at)}</td>
                        <td className="admin-td">
                          <button onClick={() => handleViewConcern(concern)} className="admin-button">View More</button>
                          <button onClick={() => handleDeleteConcern(concern.id)} className="admin-button">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {activeSection === 'viewConcern' && selectedConcern && (
            <div className="admin-section">
              <h3>Concern Details</h3>
              <div className="admin-concern-details-container">
                <div className="admin-concern-detail-box">
                  <h3>Concern</h3>
                  <p>{selectedConcern.details}</p>
                </div>
                <div className="admin-concern-detail-box">
                  <h3>Status</h3>
                  <p>{selectedConcern.status}</p>
                </div>
                <div className="admin-concern-detail-box">
                  <h3>Created At</h3>
                  <p>{selectedConcern.created_at ? formatTimestamp(selectedConcern.created_at) : 'N/A'}</p>
                </div>
                <div className="admin-concern-detail-box">
                  <h3>Email</h3>
                  <p>{selectedConcern.email}</p>
                </div>
                <div className="admin-concern-detail-box">
                  <h3>Preferred Contact Method</h3>
                  <p>{selectedConcern.preferred_contact_method}</p>
                </div>
                <div className="admin-concern-detail-box">
                  <h3>Purpose of Visit</h3>
                  <p>{selectedConcern.purpose_of_visit}</p>
                </div>
                <div className="admin-concern-detail-box">
                  <h3>Student Type</h3>
                  <p>{selectedConcern.student_type}</p>
                </div>
                <div className="admin-concern-detail-box">
                  <h3>Time of Entry</h3>
                  <p>{selectedConcern.time_of_entry ? formatTimestamp(selectedConcern.time_of_entry) : 'N/A'}</p>
                </div>
                <div className="admin-concern-detail-box">
                  <h3>Updated At</h3>
                  <p>{selectedConcern.updated_at ? formatTimestamp(selectedConcern.updated_at) : 'N/A'}</p>
                </div>
                <div className="admin-concern-detail-box">
                  <h3>Urgency Level</h3>
                  <p>{selectedConcern.urgency_level}</p>
                </div>
                <div className="admin-concern-detail-box">
                  <h3>Additional Comments</h3>
                  <p>{selectedConcern.additional_comments}</p>
                </div>
                <div className="admin-concern-detail-box">
                  <h3>Appointment Date</h3>
                  <p>{selectedConcern.appointment_date ? formatTimestamp(selectedConcern.appointment_date) : 'N/A'}</p>
                </div>
                <div className="admin-concern-detail-box">
                  <h3>Additional Info</h3>
                  <div className="admin-additional-info">
                    {selectedConcern.additional_info && Object.keys(selectedConcern.additional_info).length > 0 ? (
                      Object.entries(selectedConcern.additional_info).map(([key, value], index) => (
                        <div key={index} className="admin-additional-info-item">
                          <strong>{key}:</strong> {value}
                        </div>
                      ))
                    ) : (
                      null
                    )}
                  </div>
                </div>
              </div>
              <button onClick={() => setActiveSection('concerns')} className="admin-button admin-back-button">Back to Concerns</button>
            </div>
          )}
          {activeSection === 'ratings' && (
            <div className="admin-section">
              <h2>Ratings</h2>
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th className="admin-th">User ID</th>
                      <th className="admin-th">Rating</th>
                      <th className="admin-th">Feedback</th>
                      <th className="admin-th">Created At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ratings.slice(0, 20).map((rating, index) => (
                      <tr key={index}>
                        <td className="admin-td">{rating.user_id}</td>
                        <td className="admin-td">{rating.rating}</td>
                        <td className="admin-td">{rating.feedback}</td>
                        <td className="admin-td">{formatTimestamp(rating.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Admin;