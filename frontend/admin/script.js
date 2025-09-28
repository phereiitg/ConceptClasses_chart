document.addEventListener("DOMContentLoaded", function() {
    const API_BASE = window.API_BASE || "https://concept-classes-backend.onrender.com";
    const subjectList = document.getElementById("subject-list");
    const firstLi = document.querySelector("#subject-list li");


    fetch(`${API_BASE}/subjects`)
        .then(response => response.json())
        .then(subjects => {
            if (firstLi) {
                firstLi.remove(); // Remove the loading message
            }

            subjects.forEach(subject => {
                const listItem = document.createElement("li");
                const link = document.createElement("a");
                link.href = `/tree/tree.html?subject=${encodeURIComponent(subject.id)}`;
                link.textContent = subject.name;
                listItem.appendChild(link);
                subjectList.appendChild(listItem);
            });
        })
        .catch(error => {
            console.error("Error fetching subjects:", error);
            subjectList.innerHTML = "<li>Could not load subjects. Please reload the page.</li>";
        });
});