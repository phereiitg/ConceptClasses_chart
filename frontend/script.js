document.addEventListener("DOMContentLoaded", function() {
    const API_BASE = window.API_BASE || "http://localhost:8000";
    const subjectList = document.getElementById("subject-list");

    fetch(`${API_BASE}/subjects`)
        .then(response => response.json())
        .then(subjects => {
            subjects.forEach(subject => {
                const listItem = document.createElement("li");
                const link = document.createElement("a");
                link.href = `${subject}/${subject}.html`;
                link.textContent = subject.charAt(0).toUpperCase() + subject.slice(1); // Capitalize first letter
                listItem.appendChild(link);
                subjectList.appendChild(listItem);
            });
        })
        .catch(error => {
            console.error("Error fetching subjects:", error);
            subjectList.innerHTML = "<li>Could not load subjects.</li>";
        });
});