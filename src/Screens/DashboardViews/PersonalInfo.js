import React, { useState, useEffect } from 'react';
import './styles/PersonalInfo.css';
import { useDashboard } from '../Context/DashboardContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import next from '../../assets/next.png';

const PersonalInfo = ({ currentUser, onFormValid, onSaveInfo, onSaveAndNavigate }) => {
  const { userInfo, updateUserInfo } = useDashboard();
  const [localUserInfo, setLocalUserInfo] = useState(userInfo || currentUser || {});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (currentUser) {
        const userDoc = doc(db, 'visitors', currentUser.email);
        const userSnap = await getDoc(userDoc);
        if (userSnap.exists()) {
          setLocalUserInfo(userSnap.data());
        } else {
          console.log('No such document!');
        }
      }
    };

    fetchUserInfo();
  }, [currentUser]);

  useEffect(() => {
    console.log('Validating form with localUserInfo:', localUserInfo);
    validateForm(localUserInfo);
  }, [localUserInfo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedUserInfo = { ...localUserInfo, [name]: value };
    setLocalUserInfo(updatedUserInfo);

    // Clear the error for the specific field being edited
    if (errors[name]) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleBlur = () => {
    console.log('Updating user info:', localUserInfo);
    updateUserInfo(localUserInfo);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!localUserInfo.name) newErrors.name = 'Name is required';
    if (!localUserInfo.email) newErrors.email = 'Email is required';

    if (localUserInfo.role === 'undergraduate') {
      if (!localUserInfo.program) newErrors.program = 'Program is required';
      if (!localUserInfo.year_of_study) newErrors.year_of_study = 'Year of Study is required';
      if (!localUserInfo.major) newErrors.major = 'Major is required';
      if (!localUserInfo.status) newErrors.status = 'Status is required';
    } else if (localUserInfo.role === 'graduate') {
      if (!localUserInfo.program) newErrors.program = 'Program is required';
      if (!localUserInfo.field_of_study) newErrors.field_of_study = 'Field of Study is required';
      if (!localUserInfo.status) newErrors.status = 'Status is required';
      if (!localUserInfo.advisor) newErrors.advisor = 'Advisor is required';
    } else if (localUserInfo.role === 'alumni') {
      if (!localUserInfo.graduation_year) newErrors.graduation_year = 'Graduation Year is required';
      if (!localUserInfo.degree) newErrors.degree = 'Degree is required';
      if (!localUserInfo.current_employer) newErrors.current_employer = 'Current Employer is required';
      if (!localUserInfo.job_title) newErrors.job_title = 'Job Title is required';
    } else if (localUserInfo.role === 'exchange') {
      if (!localUserInfo.home_institution) newErrors.home_institution = 'Home Institution is required';
      if (!localUserInfo.program_duration) newErrors.program_duration = 'Program Duration is required';
      if (!localUserInfo.advisor) newErrors.advisor = 'Advisor is required';
    } else if (localUserInfo.role === 'non-degree') {
      if (!localUserInfo.reason_for_enrollment) newErrors.reason_for_enrollment = 'Reason for Enrollment is required';
      if (!localUserInfo.program_duration) newErrors.program_duration = 'Program Duration is required';
    } else if (localUserInfo.role === 'prospective') {
      if (!localUserInfo.interest_field) newErrors.interest_field = 'Interest Field is required';
      if (!localUserInfo.intended_program) newErrors.intended_program = 'Intended Program is required';
      if (!localUserInfo.inquiry_date) newErrors.inquiry_date = 'Inquiry Date is required';
      if (!localUserInfo.notes) newErrors.notes = 'Notes are required';
    } else if (localUserInfo.role === 'student_staff') {
      if (!localUserInfo.job_title) newErrors.job_title = 'Job Title is required';
      if (!localUserInfo.department) newErrors.department = 'Department is required';
      if (!localUserInfo.employment_start_date) newErrors.employment_start_date = 'Employment Start Date is required';
      if (!localUserInfo.employment_end_date) newErrors.employment_end_date = 'Employment End Date is required';
      if (!localUserInfo.employment_status) newErrors.employment_status = 'Employment Status is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const userDoc = doc(db, 'visitors', currentUser.email);
      await setDoc(userDoc, localUserInfo);
      alert('Information saved successfully!');
      onSaveInfo(localUserInfo);
      onSaveAndNavigate('concerns'); // Navigate to Personal Concerns after saving
    } catch (error) {
      console.error('Error saving information: ', error);
      alert('Save failed. Please try again.');
    }
  };

  const validateForm = (data) => {
    const isValid = data.name && data.email && (
      (data.role === 'undergraduate' && data.program && data.year_of_study && data.major && data.status) ||
      (data.role === 'graduate' && data.program && data.field_of_study && data.status && data.advisor) ||
      (data.role === 'alumni' && data.graduation_year && data.degree && data.current_employer && data.job_title) ||
      (data.role === 'exchange' && data.home_institution && data.program_duration && data.advisor) ||
      (data.role === 'non-degree' && data.reason_for_enrollment && data.program_duration) ||
      (data.role === 'prospective' && data.interest_field && data.intended_program && data.inquiry_date && data.notes) ||
      (data.role === 'student_staff' && data.job_title && data.department && data.employment_start_date && data.employment_end_date && data.employment_status)
    );
    onFormValid(isValid);
  };

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="personalinfo-container">
      <h2 className="personalinfo-title">Personal Information</h2>
      <div className="personalinfo-row">
        <div className="personalinfo-field">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={localUserInfo.name || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Name"
          />
          {errors.name && <span className="error">{errors.name}</span>}
        </div>
        <div className="personalinfo-field">
          <label>Email:</label>
          <input
            type="text"
            name="email"
            value={localUserInfo.email || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Email"
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>
      </div>
      {localUserInfo.role === 'undergraduate' && (
        <>
          <div className="personalinfo-row">
            <div className="personalinfo-field">
              <label>Program:</label>
              <input
                type="text"
                name="program"
                value={localUserInfo.program || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Program"
              />
              {errors.program && <span className="error">{errors.program}</span>}
            </div>
            <div className="personalinfo-field">
              <label>Year of Study:</label>
              <input
                type="text"
                name="year_of_study"
                value={localUserInfo.year_of_study || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Year of Study"
              />
              {errors.year_of_study && <span className="error">{errors.year_of_study}</span>}
            </div>
          </div>
          <div className="personalinfo-row">
            <div className="personalinfo-field">
              <label>Major:</label>
              <input
                type="text"
                name="major"
                value={localUserInfo.major || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Major"
              />
              {errors.major && <span className="error">{errors.major}</span>}
            </div>
            <div className="personalinfo-field">
              <label>Status:</label>
              <input
                type="text"
                name="status"
                value={localUserInfo.status || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Status"
              />
              {errors.status && <span className="error">{errors.status}</span>}
            </div>
          </div>
        </>
      )}
      {localUserInfo.role === 'graduate' && (
        <>
          <div className="personalinfo-row">
            <div className="personalinfo-field">
              <label>Program:</label>
              <input
                type="text"
                name="program"
                value={localUserInfo.program || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Program"
              />
              {errors.program && <span className="error">{errors.program}</span>}
            </div>
            <div className="personalinfo-field">
              <label>Field of Study:</label>
              <input
                type="text"
                name="field_of_study"
                value={localUserInfo.field_of_study || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Field of Study"
              />
              {errors.field_of_study && <span className="error">{errors.field_of_study}</span>}
            </div>
          </div>
          <div className="personalinfo-row">
            <div className="personalinfo-field">
              <label>Status:</label>
              <input
                type="text"
                name="status"
                value={localUserInfo.status || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Status"
              />
              {errors.status && <span className="error">{errors.status}</span>}
            </div>
            <div className="personalinfo-field">
              <label>Advisor:</label>
              <input
                type="text"
                name="advisor"
                value={localUserInfo.advisor || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Advisor"
              />
              {errors.advisor && <span className="error">{errors.advisor}</span>}
            </div>
          </div>
        </>
      )}
      {localUserInfo.role === 'alumni' && (
        <>
          <div className="personalinfo-row">
            <div className="personalinfo-field">
              <label>Graduation Year:</label>
              <input
                type="text"
                name="graduation_year"
                value={localUserInfo.graduation_year || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Graduation Year"
              />
              {errors.graduation_year && <span className="error">{errors.graduation_year}</span>}
            </div>
            <div className="personalinfo-field">
              <label>Degree:</label>
              <input
                type="text"
                name="degree"
                value={localUserInfo.degree || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Degree"
              />
              {errors.degree && <span className="error">{errors.degree}</span>}
            </div>
          </div>
          <div className="personalinfo-row">
            <div className="personalinfo-field">
              <label>Current Employer:</label>
              <input
                type="text"
                name="current_employer"
                value={localUserInfo.current_employer || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Current Employer"
              />
              {errors.current_employer && <span className="error">{errors.current_employer}</span>}
            </div>
            <div className="personalinfo-field">
              <label>Job Title:</label>
              <input
                type="text"
                name="job_title"
                value={localUserInfo.job_title || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Job Title"
              />
              {errors.job_title && <span className="error">{errors.job_title}</span>}
            </div>
          </div>
        </>
      )}
      {localUserInfo.role === 'exchange' && (
        <>
          <div className="personalinfo-row">
            <div className="personalinfo-field">
              <label>Home Institution:</label>
              <input
                type="text"
                name="home_institution"
                value={localUserInfo.home_institution || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Home Institution"
              />
              {errors.home_institution && <span className="error">{errors.home_institution}</span>}
            </div>
            <div className="personalinfo-field">
              <label>Program Duration:</label>
              <input
                type="text"
                name="program_duration"
                value={localUserInfo.program_duration || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Program Duration"
              />
              {errors.program_duration && <span className="error">{errors.program_duration}</span>}
            </div>
          </div>
          <div className="personalinfo-row">
            <div className="personalinfo-field">
              <label>Advisor:</label>
              <input
                type="text"
                name="advisor"
                value={localUserInfo.advisor || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Advisor"
              />
              {errors.advisor && <span className="error">{errors.advisor}</span>}
            </div>
          </div>
        </>
      )}
      {localUserInfo.role === 'non-degree' && (
        <>
          <div className="personalinfo-row">
            <div className="personalinfo-field">
              <label>Reason for Enrollment:</label>
              <input
                type="text"
                name="reason_for_enrollment"
                value={localUserInfo.reason_for_enrollment || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Reason for Enrollment"
              />
              {errors.reason_for_enrollment && <span className="error">{errors.reason_for_enrollment}</span>}
            </div>
            <div className="personalinfo-field">
              <label>Program Duration:</label>
              <input
                type="text"
                name="program_duration"
                value={localUserInfo.program_duration || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Program Duration"
              />
              {errors.program_duration && <span className="error">{errors.program_duration}</span>}
            </div>
          </div>
        </>
      )}
      {localUserInfo.role === 'prospective' && (
        <>
          <div className="personalinfo-row">
            <div className="personalinfo-field">
              <label>Interest Field:</label>
              <input
                type="text"
                name="interest_field"
                value={localUserInfo.interest_field || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Interest Field"
              />
              {errors.interest_field && <span className="error">{errors.interest_field}</span>}
            </div>
            <div className="personalinfo-field">
              <label>Intended Program:</label>
              <input
                type="text"
                name="intended_program"
                value={localUserInfo.intended_program || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Intended Program"
              />
              {errors.intended_program && <span className="error">{errors.intended_program}</span>}
            </div>
          </div>
          <div className="personalinfo-row">
            <div className="personalinfo-field">
              <label>Inquiry Date:</label>
              <input
                type="text"
                name="inquiry_date"
                value={localUserInfo.inquiry_date || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Inquiry Date"
              />
              {errors.inquiry_date && <span className="error">{errors.inquiry_date}</span>}
            </div>
            <div className="personalinfo-field">
              <label>Notes:</label>
              <input
                type="text"
                name="notes"
                value={localUserInfo.notes || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Notes"
              />
              {errors.notes && <span className="error">{errors.notes}</span>}
            </div>
          </div>
        </>
      )}
      {localUserInfo.role === 'student_staff' && (
        <>
          <div className="personalinfo-row">
            <div className="personalinfo-field">
              <label>Job Title:</label>
              <input
                type="text"
                name="job_title"
                value={localUserInfo.job_title || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Job Title"
              />
              {errors.job_title && <span className="error">{errors.job_title}</span>}
            </div>
            <div className="personalinfo-field">
              <label>Department:</label>
              <input
                type="text"
                name="department"
                value={localUserInfo.department || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Department"
              />
              {errors.department && <span className="error">{errors.department}</span>}
            </div>
          </div>
          <div className="personalinfo-row">
            <div className="personalinfo-field">
              <label>Employment Start Date:</label>
              <input
                type="text"
                name="employment_start_date"
                value={localUserInfo.employment_start_date || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Employment Start Date"
              />
              {errors.employment_start_date && <span className="error">{errors.employment_start_date}</span>}
            </div>
            <div className="personalinfo-field">
              <label>Employment End Date:</label>
              <input
                type="text"
                name="employment_end_date"
                value={localUserInfo.employment_end_date || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Employment End Date"
              />
              {errors.employment_end_date && <span className="error">{errors.employment_end_date}</span>}
            </div>
          </div>
          <div className="personalinfo-row">
            <div className="personalinfo-field">
              <label>Employment Status:</label>
              <input
                type="text"
                name="employment_status"
                value={localUserInfo.employment_status || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Employment Status"
              />
              {errors.employment_status && <span className="error">{errors.employment_status}</span>}
            </div>
          </div>
        </>
      )}
      <div className="save-button-container">
        <button className="save-button" onClick={handleSave}>
          Submit
          <img src={next} alt="Next Icon" className="next-icon" />
        </button>
      </div>
    </div>
  );
};

export default PersonalInfo;