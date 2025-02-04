document.getElementById("access-course").addEventListener("click", () => {
    window.location.href = "course.html"; // Replace with actual course page
  });
  
  document.getElementById("start-exam").addEventListener("click", () => {
    const confirmStart = confirm(
      "Are you ready to begin the exam? Please note that you have 60 minutes to complete it."
    );
  
    if (confirmStart) {
      alert("Starting exam...");
      // TO DO: Implement exam questions and timer functionality
      console.log("Exam started.");
      window.location.href = "exam-questions.html"; // Replace with actual exam questions page
    } else {
      alert("Take your time and start when you feel ready.");
    }
  });