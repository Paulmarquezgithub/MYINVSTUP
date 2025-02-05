document.addEventListener("DOMContentLoaded", () => {
    // Retrieve user data; if not found or if balance is not a valid number,
    // initialize with a default account with a balance of $10,000.
    let user = JSON.parse(localStorage.getItem("user"));
    if (!user || isNaN(Number(user.balance))) {
      alert("No user found, setting up a default account with $10,000.");
      user = {
        username: "John Doe",
        email: "john.doe@example.com",
        balance: 10000,
        avatar: "assets/images/default-avatar.png"
      };
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      user.balance = Number(user.balance);
    }
  
    // Utility: Update user's balance in localStorage and notify other pages.
    function updateUserBalance(newBalance) {
      user.balance = Number(newBalance);
      localStorage.setItem("user", JSON.stringify(user));
      window.dispatchEvent(new Event("storage"));
    }
  
    // Map startup names to expected return rates.
    function getExpectedReturn(startupName) {
      if (startupName === "Green Energy Co.") return 0.05;
      if (startupName === "Tech Innovators") return 0.10;
      if (startupName === "BioGenix") return 0.20;
      return 0;
    }
  
    // Set invest button listeners.
    const investButtons = document.querySelectorAll(".invest-btn");
    investButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const startupName = btn.parentElement.querySelector("h3").textContent;
        let investAmount = prompt(`Enter the amount you want to invest in ${startupName}:`);
        if (!investAmount) return;
        investAmount = Number(investAmount);
        if (isNaN(investAmount) || investAmount <= 0) {
          alert("Please enter a valid positive number.");
          return;
        }
        if (investAmount > user.balance) {
          alert("Insufficient balance to invest that amount.");
          return;
        }
  
        const newBalance = Number(user.balance) - investAmount;
        updateUserBalance(newBalance);
  
        // Generate a random project duration between 180 and 365 days.
        const now = new Date();
        const daysToAdd = Math.floor(Math.random() * (365 - 180 + 1)) + 180;
        const durationInYears = daysToAdd / 365;
        const estimatedEnd = new Date(now.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
  
        const expectedReturn = getExpectedReturn(startupName);
        // Corrected potentialRevenue calculation based on time duration.
        const potentialRevenue = investAmount * (1 + expectedReturn * durationInYears);
  
        let investments = JSON.parse(localStorage.getItem("investments")) || [];
        investments.push({
          startupName: startupName,
          amount: investAmount,
          date: now.toISOString(),
          expectedReturn: expectedReturn,
          estimatedEnd: estimatedEnd.toISOString(),
          potentialRevenue: potentialRevenue
        });
        localStorage.setItem("investments", JSON.stringify(investments));
  
        alert(`You invested $${investAmount.toFixed(2)} in ${startupName}. New balance: $${newBalance.toFixed(2)}.`);
      });
    });
  });