document.addEventListener("DOMContentLoaded", () => {
  // Vérifie et initialise les données utilisateur
  let user = JSON.parse(localStorage.getItem("user"));
  if (!user || isNaN(Number(user.balance))) {
    user = {
      username: "John Doe",
      email: "john.doe@example.com",
      balance: 10000,
      avatar: "assets/images/default-avatar.png"
    };
    localStorage.setItem("user", JSON.stringify(user));
    alert("No user found, a default account with $10,000 has been created.");
  } else {
    user.balance = Number(user.balance);
  }
  
  // Met à jour l'affichage des informations utilisateur dans l'en-tête
  function updateAccountDisplay() {
    const accountEl = document.getElementById("account-info");
    if (accountEl) {
      accountEl.textContent = `Welcome, ${user.username} | Balance: $${user.balance.toLocaleString()}`;
    }
  }
  
  updateAccountDisplay();
  
  // Fonction pour mettre à jour le solde utilisateur
  function updateUserBalance(newBalance) {
    user.balance = Number(newBalance);
    localStorage.setItem("user", JSON.stringify(user));
    updateAccountDisplay();
    window.dispatchEvent(new Event("storage"));
  }
  
  // Fonction de récupération du taux de rendement selon la startup
  function getExpectedReturn(startupName) {
    switch(startupName) {
      case "Green Energy Co.":
        return 0.05;
      case "Tech Innovators":
        return 0.10;
      case "BioGenix":
        return 0.20;
      default:
        return 0;
    }
  }
  
  // Ecouteurs pour les boutons d'investissement
  const investButtons = document.querySelectorAll(".invest-btn");
  investButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const startupName = btn.getAttribute("data-startup");
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
      
      // Mise à jour du solde et calcul de l'investissement
      const newBalance = user.balance - investAmount;
      updateUserBalance(newBalance);
      
      // Génération d'une durée aléatoire (entre 180 et 365 jours)
      const now = new Date();
      const daysToAdd = Math.floor(Math.random() * (365 - 180 + 1)) + 180;
      const durationYears = daysToAdd / 365;
      const estimatedEnd = new Date(now.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
      
      const expectedReturn = getExpectedReturn(startupName);
      const potentialRevenue = investAmount * (1 + expectedReturn * durationYears);
      
      // Sauvegarde des détails de l'investissement
      const investments = JSON.parse(localStorage.getItem("investments")) || [];
      investments.push({
        startupName: startupName,
        amount: investAmount,
        date: now.toISOString(),
        expectedReturn: expectedReturn,
        estimatedEnd: estimatedEnd.toISOString(),
        potentialRevenue: potentialRevenue
      });
      localStorage.setItem("investments", JSON.stringify(investments));
      
      alert(`You invested $${investAmount.toFixed(2)} in ${startupName}.\nNew balance: $${newBalance.toFixed(2)}`);
    });
  });
});