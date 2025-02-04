document.addEventListener("DOMContentLoaded", () => {
    // Fetch user data from local storage or redirect to login
    const user = JSON.parse(localStorage.getItem("user"));
  
    if (!user) {
      window.location.href = "account.html"; // Redirect to login if not logged in
      return;
    }
  
    // Populate user details
    document.getElementById("profile-username").textContent = user.username;
    document.getElementById("profile-avatar").src = user.avatar || "assets/images/default-avatar.png";
    document.getElementById("username").textContent = user.username;
    document.getElementById("email").textContent = user.email;
  
    // Example of fetching balance
    fetch("/api/user/profile", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch profile data");
        return response.json();
      })
      .then((data) => {
        document.getElementById("user-balance").textContent = `$${data.balance.toFixed(2)}`;
      })
      .catch((error) => {
        console.error("Error fetching profile data:", error);
        document.getElementById("user-balance").textContent = "Error loading balance";
      });
  
    // Logout functionality
    document.getElementById("logout-btn").addEventListener("click", () => {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      window.location.href = "account.html";
    });
  });
  