document.addEventListener("DOMContentLoaded", () => {
  const nav = document.getElementById("dynamic-nav");
  const mainContent = document.querySelector("main");
  const certificationBtnContainer = document.getElementById("certification-btn-container");

  // **User Connection State**
  let isConnected = localStorage.getItem("user") !== null;

  // **Update Navigation Based on Connection State**
  const renderNavigation = () => {
    if (isConnected) {
      // Navigation for connected users
      nav.innerHTML = `
        <ul>
          <li><a href="index.html">Home</a></li>
          <li><a href="investments.html">Investments</a></li>
          <li><a href="certification.html">Certifications</a></li>
          <li><a href="profile.html">Profile</a></li>
          <li><button id="disconnect-btn" class="disconnect-btn">Disconnect</button></li>
        </ul>
      `;

      // Disconnect button functionality
      document.getElementById("disconnect-btn").addEventListener("click", () => {
        localStorage.removeItem("user");
        isConnected = false;
        window.location.href = "profile.html"; // Redirect to profile to prompt reconnection
        renderNavigation(); // Update navigation after disconnection
        renderCertificationButton(); // Update certification button after disconnection
      });
    } else {
      // Navigation for disconnected users
      nav.innerHTML = `
        <ul>
          <li><a href="index.html">Home</a></li>
          <li><a href="investments.html">Investments</a></li>
          <li><a href="certification.html">Certifications</a></li>
          <li><a href="account.html">Account</a></li>
        </ul>
      `;
    }
    renderCertificationButton(); // Render certification button based on user connection state
  };

  // **Render Certification Button Based on User Connection State**
  const renderCertificationButton = () => {
    if (isConnected) {
      certificationBtnContainer.innerHTML = `
        <button id="start-certification" class="btn btn-primary">Start Certification Exam</button>
      `;
      document.getElementById("start-certification").addEventListener("click", () => {
        window.location.href = "certificationexam.html";
      });
    } else {
      certificationBtnContainer.innerHTML = `
        <button id="login-to-certify" class="btn btn-primary" disabled>Please Log In to Access Certification Exam</button>
      `;
    }
  };

  // **Initialize Navigation and Certification Button**
  renderNavigation();
});