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
        <div className="login-modal">
          <div className="login-content">
            <h2>Admin Login</h2>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Login</button>
            {error && <p className="error">{error}</p>}
          </div>
        </div>
      )}
      {isAuthenticated && (
        <>
          <div className="toggle-buttons">
            <button onClick={() => setActiveSection('visitors')}>Visitors</button>
            <button onClick={() => setActiveSection('concerns')}>Concerns</button>
            <button onClick={() => setActiveSection('ratings')}>Ratings</button>
          </div>
          {activeSection === 'visitors' && (
            <div className="admin-section">
              <h2>Visitors</h2>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Visit Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visitors.slice(0, 20).map((visitor, index) => (
                      <tr key={index}>
                        <td>{visitor.name}</td>
                        <td>{visitor.email}</td>
                        <td>{visitor.visitDate}</td>
                        <td>
                          <button onClick={() => handleDeleteVisitor(visitor.id)}>Delete</button>
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
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Student ID</th>
                      <th>Details</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedConcern ? (
                      <tr>
                        <td>{selectedConcern.student_id}</td>
                        <td>{selectedConcern.details}</td>
                        <td>{selectedConcern.status}</td>
                        <td>
                          <button onClick={() => setSelectedConcern(null)}>Close</button>
                        </td>
                      </tr>
                    ) : (
                      concerns.map((concern, index) => (
                        <tr key={index}>
                          <td>{concern.student_id}</td>
                          <td>{concern.details}</td>
                          <td>{concern.status}</td>
                          <td>
                            <button onClick={() => handleViewConcern(concern)}>View More</button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              {selectedConcern && (
                <div className="concern-details">
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
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>User ID</th>
                      <th>Rating</th>
                      <th>Feedback</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ratings.slice(0, 20).map((rating, index) => (
                      <tr key={index}>
                        <td>{rating.user_id}</td>
                        <td>{rating.rating}</td>
                        <td>{rating.feedback}</td>
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