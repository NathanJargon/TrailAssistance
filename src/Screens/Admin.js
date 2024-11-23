import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, doc, getDoc, deleteDoc } from 'firebase/firestore';
import './styles/Admin.css';

const Admin = () => {
  const [visitors, setVisitors] = useState([]);
  const [concerns, setConcerns] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [selectedConcern, setSelectedConcern] = useState(null);
  const [activeSection, setActiveSection] = useState('visitors');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const db = getFirestore();

  useEffect(() => {
    if (isAuthenticated) {
      const fetchVisitors = async () => {
        const visitorsCollection = collection(db, 'visitors');
        const visitorsSnapshot = await getDocs(visitorsCollection);
        const visitorsList = visitorsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setVisitors(visitorsList);
      };

      const fetchConcerns = async () => {
        const concernsCollection = collection(db, 'concerns');
        const concernsSnapshot = await getDocs(concernsCollection);
        const concernsList = concernsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setConcerns(concernsList);
      };

      const fetchRatings = async () => {
        const ratingsCollection = collection(db, 'ratings');
        const ratingsSnapshot = await getDocs(ratingsCollection);
        const ratingsList = ratingsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRatings(ratingsList);
      };

      fetchVisitors();
      fetchConcerns();
      fetchRatings();
    }
  }, [db, isAuthenticated]);

  const handleDeleteVisitor = async (id) => {
    await deleteDoc(doc(db, 'visitors', id));
    setVisitors(visitors.filter(visitor => visitor.id !== id));
  };

  const handleDeleteConcern = async (id) => {
    await deleteDoc(doc(db, 'concerns', id));
    setConcerns(concerns.filter(concern => concern.id !== id));
  };

  const handleViewConcern = (concern) => {
    setSelectedConcern(concern);
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
            <button onClick={() => setActiveSection('visitors')} className="admin-button">Visitors</button>
            <button onClick={() => setActiveSection('concerns')} className="admin-button">Concerns</button>
            <button onClick={() => setActiveSection('ratings')} className="admin-button">Ratings</button>
          </div>
          {activeSection === 'visitors' && (
            <div className="admin-section">
              <h2>Visitors</h2>
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th className="admin-th">Name</th>
                      <th className="admin-th">Email</th>
                      <th className="admin-th">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visitors.slice(0, 20).map((visitor, index) => (
                      <tr key={index}>
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
                      <th className="admin-th">Details</th>
                      <th className="admin-th">Status</th>
                      <th className="admin-th">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedConcern ? (
                      <tr>
                        <td className="admin-td">{selectedConcern.student_id}</td>
                        <td className="admin-td">{selectedConcern.details}</td>
                        <td className="admin-td">{selectedConcern.status}</td>
                        <td className="admin-td">
                          <button onClick={() => setSelectedConcern(null)} className="admin-button">Close</button>
                        </td>
                      </tr>
                    ) : (
                      concerns.map((concern, index) => (
                        <tr key={index}>
                          <td className="admin-td">{concern.student_id}</td>
                          <td className="admin-td">{concern.details}</td>
                          <td className="admin-td">{concern.status}</td>
                          <td className="admin-td">
                            <button onClick={() => handleViewConcern(concern)} className="admin-button">View More</button>
                            <button onClick={() => handleDeleteConcern(concern.id)} className="admin-button">Delete</button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              {selectedConcern && (
                <div className="admin-concern-details">
                  <h3>Concern Details</h3>
                  <p><strong>Student ID:</strong> {selectedConcern.student_id}</p>
                  <p><strong>Details:</strong> {selectedConcern.details}</p>
                  <p><strong>Status:</strong> {selectedConcern.status}</p>
                  <p><strong>Additional Info:</strong> {JSON.stringify(selectedConcern.additional_info)}</p>
                  <p><strong>Purpose of Visit:</strong> {selectedConcern.purpose_of_visit}</p>
                  <p><strong>Appointment Date:</strong> {selectedConcern.appointment_date}</p>
                  <p><strong>Preferred Contact Method:</strong> {selectedConcern.preferred_contact_method}</p>
                  <p><strong>Urgency Level:</strong> {selectedConcern.urgency_level}</p>
                  <p><strong>Additional Comments:</strong> {selectedConcern.additional_comments}</p>
                </div>
              )}
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
                    </tr>
                  </thead>
                  <tbody>
                    {ratings.slice(0, 20).map((rating, index) => (
                      <tr key={index}>
                        <td className="admin-td">{rating.user_id}</td>
                        <td className="admin-td">{rating.rating}</td>
                        <td className="admin-td">{rating.feedback}</td>
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