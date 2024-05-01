import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function Adminhome() {
  const [showPopup, setShowPopup] = useState(false);
  const [inputconfirmationCode, setConfirmationCode] = useState(""); // Use inputconfirmationCode instead of confirmationCode
  const navigate = useNavigate();
  const handleOpenPopup = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleConfirmationCodeChange = (e) => {
    setConfirmationCode(e.target.value);
  };

  const handleConfirmationCodeSubmit = async () => {
    const confirmationCode = sessionStorage.getItem('generatedCode');

    if (inputconfirmationCode === confirmationCode) {
      sessionStorage.setItem('confirmCode',inputconfirmationCode);
      alert("Successful");
    } else {
      navigate('/home');
      alert("Error");
    }
  };

  return (
    <div className="Align">
      <button onClick={handleOpenPopup}>Check Confirmation code</button>

      {/* Popup window */}
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h2>Enter Confirmation Code</h2>
            <input
              type="text"
              value={inputconfirmationCode}
              onChange={handleConfirmationCodeChange}
            />
            <button onClick={handleConfirmationCodeSubmit}>Submit</button>
            <button onClick={handleClosePopup}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
