document.addEventListener("DOMContentLoaded", () => {
  // ------------------ Initialization ------------------
  let user = JSON.parse(localStorage.getItem("user"));
  if (!user || isNaN(Number(user.balance))) {
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

  // ------------------ UI Update ------------------
  function updateProfileDisplay() {
    document.getElementById("username").textContent = user.username;
    document.getElementById("email").textContent = user.email;
    document.getElementById("profile-avatar").src = user.avatar || "assets/images/default-avatar.png";
    document.getElementById("user-balance").textContent = `$${Number(user.balance).toFixed(2)}`;
  }
  updateProfileDisplay();

  document.getElementById("logout-btn").addEventListener("click", () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "account.html";
  });

  // ------------------ Simulated Time Setup ------------------
  let simulatedNow = new Date();
  let lastRealTime = Date.now();
  let timeMultiplier = 1;

  // Speed control button listeners update the multiplier.
  document.querySelectorAll("#speed-controls button").forEach(btn => {
    btn.addEventListener("click", () => {
      timeMultiplier = Number(btn.getAttribute("data-speed"));
      document.querySelectorAll("#speed-controls button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });

  // ------------------ Investment Calculations ------------------
  // Annualized accrued interest based on elapsed time.
  function calculateAccrued(principal, expectedReturn, investmentDate, estimatedEnd) {
    const now = simulatedNow;
    const start = new Date(investmentDate);
    const end = new Date(estimatedEnd);
    const totalDuration = end - start;
    const elapsed = Math.min(now - start, totalDuration);
    const elapsedYears = elapsed / (1000 * 60 * 60 * 24 * 365); // Convert milliseconds to years
    return principal * expectedReturn * elapsedYears;
  }

  // ------------------ Render Investments ------------------
  function renderInvestments() {
    const investmentsList = document.getElementById("investments-list");
    investmentsList.innerHTML = ""; // Clear existing content
    let investments = JSON.parse(localStorage.getItem("investments")) || [];
    console.log("Rendering investments:", investments);

    if (investments.length === 0) {
      investmentsList.innerHTML = "<p>You have no active investments.</p>";
      return;
    }

    investments.forEach((investment, index) => {
      const now = simulatedNow;
      const investDate = new Date(investment.date);
      const estimatedEnd = new Date(investment.estimatedEnd);
      const principal = investment.amount;
      const accrued = calculateAccrued(principal, investment.expectedReturn, investment.date, investment.estimatedEnd);

      // Calculate timeline metrics.
      const totalDurationDays = Math.round((estimatedEnd - investDate) / (1000 * 60 * 60 * 24));
      let elapsedDays = Math.round((now - investDate) / (1000 * 60 * 60 * 24));
      if (elapsedDays < 0) elapsedDays = 0;
      let remainingDays = totalDurationDays - elapsedDays;
      if (remainingDays < 0) remainingDays = 0;
      const progressFraction = totalDurationDays > 0 ? Math.min(elapsedDays / totalDurationDays, 1) : 0;
      const progressPercent = (progressFraction * 100).toFixed(0);

      // Decide current sell value.
      let currentSellValue;
      if (now < estimatedEnd) {
        currentSellValue = principal + (accrued * 0.5);
      } else {
        currentSellValue = principal + accrued;
      }

      // Create a container element for the investment.
      const itemDiv = document.createElement("div");
      itemDiv.classList.add("investment-item");

      // Investment heading.
      const header = document.createElement("h4");
      header.textContent = investment.startupName;
      itemDiv.appendChild(header);

      // Investment details.
      const metricsDiv = document.createElement("div");
      metricsDiv.classList.add("investment-metrics");
      metricsDiv.innerHTML = `
        <p><strong>Amount Invested:</strong> $${principal.toFixed(2)}</p>
        <p><strong>Investment Date:</strong> ${investDate.toLocaleDateString()}</p>
        <p><strong>Estimated End:</strong> ${estimatedEnd.toLocaleDateString()} (Total: ${totalDurationDays} days)</p>
        <p><strong>Timeline:</strong> ${elapsedDays} days elapsed, ${remainingDays} days remaining</p>
        <p><strong>Expected Return:</strong> ${(investment.expectedReturn * 100).toFixed(0)}% per annum</p>
        <p><strong>Accrued Interest:</strong> $${accrued.toFixed(2)}</p>
        <p><strong>Potential Revenue:</strong> $${investment.potentialRevenue.toFixed(2)}</p>
        <p><strong>Current Sell Value:</strong> $${currentSellValue.toFixed(2)}</p>
      `;
      itemDiv.appendChild(metricsDiv);

      // Timeline progress bar.
      const progressContainer = document.createElement("div");
      progressContainer.classList.add("progress-container");
      const progressBar = document.createElement("div");
      progressBar.classList.add("progress-bar");
      progressBar.style.width = `${progressPercent}%`;
      progressContainer.appendChild(progressBar);
      itemDiv.appendChild(progressContainer);

      // Action buttons.
      const actionDiv = document.createElement("div");
      actionDiv.classList.add("action-buttons");
      if (now >= estimatedEnd) {
        const redeemBtn = document.createElement("button");
        redeemBtn.classList.add("action-btn");
        redeemBtn.textContent = "Redeem";
        redeemBtn.addEventListener("click", () => redeemInvestment(index, investment));
        actionDiv.appendChild(redeemBtn);
      }
      const sellBtn = document.createElement("button");
      sellBtn.classList.add("action-btn", "sell");
      sellBtn.textContent = "Sell";
      sellBtn.addEventListener("click", () => sellInvestment(index, investment));
      actionDiv.appendChild(sellBtn);
      itemDiv.appendChild(actionDiv);

      investmentsList.appendChild(itemDiv);
    });
  }

  // ------------------ Investment Actions ------------------
  function redeemInvestment(index, investment) {
    const principal = investment.amount;
    const accrued = calculateAccrued(principal, investment.expectedReturn, investment.date, investment.estimatedEnd);
    const redemptionAmount = principal + accrued;
    user.balance = Number(user.balance) + redemptionAmount;
    localStorage.setItem("user", JSON.stringify(user));
    updateProfileDisplay();

    let investments = JSON.parse(localStorage.getItem("investments")) || [];
    investments.splice(index, 1);
    localStorage.setItem("investments", JSON.stringify(investments));
    renderInvestments();
    updateTimelineChart();
    alert(`Redeemed $${redemptionAmount.toFixed(2)} (principal + accrued interest).`);
  }

  function sellInvestment(index, investment) {
    const principal = investment.amount;
    const accrued = calculateAccrued(principal, investment.expectedReturn, investment.date, investment.estimatedEnd);
    const now = simulatedNow;
    const estimatedEnd = new Date(investment.estimatedEnd);
    let saleAmount;
    if (now < estimatedEnd) {
      saleAmount = principal + (accrued * 0.5);
    } else {
      saleAmount = principal + accrued;
    }
    user.balance = Number(user.balance) + saleAmount;
    localStorage.setItem("user", JSON.stringify(user));
    updateProfileDisplay();

    let investments = JSON.parse(localStorage.getItem("investments")) || [];
    investments.splice(index, 1);
    localStorage.setItem("investments", JSON.stringify(investments));
    renderInvestments();
    updateTimelineChart();
    alert(`Investment sold for $${saleAmount.toFixed(2)}.`);
  }
  // ------------------ Storage Change Listener ------------------
  window.addEventListener("storage", () => {
    user = JSON.parse(localStorage.getItem("user")) || user;
    user.balance = Number(user.balance);
    updateProfileDisplay();
    renderInvestments();
    updateRevenueChart();
    updateTimelineChart();
  });

  // ------------------ Test Investment Button (for development) ------------------
  document.getElementById("add-test-investment").addEventListener("click", () => {
    const now = new Date();
    const daysToAdd = 200; // Test investment duration of 200 days.
    const estimatedEnd = new Date(now.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
    let investments = JSON.parse(localStorage.getItem("investments")) || [];
    investments.push({
      startupName: "Test Startup",
      amount: 100,
      date: now.toISOString(),
      expectedReturn: 0.1,
      estimatedEnd: estimatedEnd.toISOString(),
      potentialRevenue: 100 * (1 + 0.1 * (daysToAdd / 365))
    });
    localStorage.setItem("investments", JSON.stringify(investments));
    renderInvestments();
    updateRevenueChart();
    updateTimelineChart();
    alert("Test investment added.");
  });

  // ------------------ Initial Rendering ------------------
  renderInvestments();
  updateRevenueChart();
  updateTimelineChart();
});