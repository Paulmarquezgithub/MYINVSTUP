// certificationexam.js
document.addEventListener("DOMContentLoaded", function () {
  // Handle the "Access Course" button click event
  const accessCourseBtn = document.getElementById("access-course");
  if (accessCourseBtn) {
    accessCourseBtn.addEventListener("click", () => {
      window.location.href = "course.html"; // Navigate to the course page
    });
  }

  // Handle the "Start Exam" button click event
  const startExamBtn = document.getElementById("start-exam");
  if (startExamBtn) {
    startExamBtn.addEventListener("click", () => {
      const message = "Are you ready to begin the exam? Please note that you have 60 minutes to complete it.";
      if (confirm(message)) {
        alert("Starting exam...");
        console.log("Exam started.");
        window.location.href = "exam-questions.html"; // Navigate to the exam questions page
      } else {
        alert("Take your time and start when you feel ready.");
      }
    });
  }

  // Additional header or dynamic navigation functionality can be added here
});