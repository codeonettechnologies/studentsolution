import React from "react";

export default function AddCollege() {
  return (
    <div className="add-clg-frm">
      <div className="add-main">
        <form>
          <h3 className="form-title">Add College</h3>
          <div className="form-group">
            <label htmlFor="collegeName">College Name :</label>
            <input
              id="collegeName"
              type="text"
              placeholder="Enter college name"
              className="form-input"
            />
          </div>
          <button type="submit" className="submit-btn">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
