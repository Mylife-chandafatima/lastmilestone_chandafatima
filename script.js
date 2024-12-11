// HTML Element References
var resumeForm = document.getElementById('resumeForm');
var resumeDisplay = document.getElementById('resume-display');
var shareableLinkContainer = document.getElementById('shareable-link-container');
var shareableLink = document.getElementById('shareable-link');
var downloadPdfButton = document.getElementById('download-pdf');
var addEducationButton = document.getElementById('addEducation');
var addWorkExperienceButton = document.getElementById('addWorkExperience');
var addSkillButton = document.getElementById('addSkill');
addEducationButton.addEventListener('click', addEducation);
addWorkExperienceButton.addEventListener('click', addWorkExperience);
addSkillButton.addEventListener('click', addSkill);
resumeForm.addEventListener('submit', generateResume);
downloadPdfButton.addEventListener('click', downloadResumeAsPDF);
// Functions to add more input fields
function addEducation() {
    var educationSection = document.getElementById('education-section');
    var educationGroup = document.createElement('div');
    educationGroup.classList.add('education-group');
    educationGroup.innerHTML = "\n        <input type=\"text\" class=\"education-input\" placeholder=\"Degree\" required />\n        <input type=\"text\" class=\"education-input\" placeholder=\"School\" required />\n        <input type=\"text\" class=\"education-input\" placeholder=\"Year\" required />\n    ";
    educationSection.appendChild(educationGroup);
}
function addWorkExperience() {
    var workSection = document.getElementById('work-experience-section');
    var workGroup = document.createElement('div');
    workGroup.classList.add('work-experience-group');
    workGroup.innerHTML = "\n        <input type=\"text\" class=\"work-experience-input\" placeholder=\"Company\" required />\n        <input type=\"text\" class=\"work-experience-input\" placeholder=\"Role\" required />\n        <input type=\"text\" class=\"work-experience-input\" placeholder=\"Years\" required />\n    ";
    workSection.appendChild(workGroup);
}
function addSkill() {
    var skillsSection = document.getElementById('skills-section');
    var skillInput = document.createElement('input');
    skillInput.type = 'text';
    skillInput.classList.add('skills-input');
    skillInput.placeholder = 'Skill';
    skillInput.required = true;
    skillsSection.appendChild(skillInput);
}
// Generate Resume Content
function generateResume(event) {
    event.preventDefault();
    var formData = new FormData(resumeForm);
    // Compile resume content
    var resumeContent = "<h2>".concat(formData.get('username'), "</h2>");
    resumeContent += "<p>Name: ".concat(formData.get('name'), "</p>");
    resumeContent += "<p>Email: ".concat(formData.get('email'), "</p>");
    resumeContent += "<p>Phone: ".concat(formData.get('phone'), "</p>");
    resumeContent += '<h3>Education</h3><ul>';
    document.querySelectorAll('.education-group').forEach(function (group) {
        var degree = group.querySelector('input[placeholder="Degree"]').value;
        var school = group.querySelector('input[placeholder="School"]').value;
        var year = group.querySelector('input[placeholder="Year"]').value;
        resumeContent += "<li>".concat(degree, ", ").concat(school, ", ").concat(year, "</li>");
    });
    resumeContent += '</ul>';
    resumeContent += '<h3>Work Experience</h3><ul>';
    document.querySelectorAll('.work-experience-group').forEach(function (group) {
        var company = group.querySelector('input[placeholder="Company"]').value;
        var role = group.querySelector('input[placeholder="Role"]').value;
        var years = group.querySelector('input[placeholder="Years"]').value;
        resumeContent += "<li>".concat(company, " - ").concat(role, " (").concat(years, ")</li>");
    });
    resumeContent += '</ul>';
    resumeContent += '<h3>Skills</h3><ul>';
    document.querySelectorAll('.skills-input').forEach(function (input) {
        var skill = input.value;
        resumeContent += "<li>".concat(skill, "</li>");
    });
    resumeContent += '</ul>';
    resumeDisplay.innerHTML = resumeContent;
    shareableLinkContainer.style.display = 'block';
    // Create shareable link with username
    createShareableLink(formData.get('username'), resumeContent);
}
// Function to create shareable link
function createShareableLink(username, resumeContent) {
    var encodedContent = btoa(resumeContent); // Base64 encode the resume content
    var url = "".concat(window.location.origin).concat(window.location.pathname, "?user=").concat(username, "&data=").concat(encodedContent);
    shareableLink.href = url;
    shareableLink.textContent = url;
}
// Load Resume from URL if data parameter is present
function loadResumeFromURL() {
    var params = new URLSearchParams(window.location.search);
    var resumeData = params.get('data');
    var username = params.get('user');
    if (resumeData) {
        var decodedContent = atob(resumeData);
        resumeDisplay.innerHTML = decodedContent;
        shareableLinkContainer.style.display = 'block';
        shareableLink.textContent = "".concat(window.location.origin).concat(window.location.pathname, "?user=").concat(username, "&data=").concat(resumeData);
    }
}
// Function to download resume as PDF
function downloadResumeAsPDF() {
    var element = resumeDisplay;
    html2pdf()
        .from(element)
        .save('resume.pdf');
}
// Load resume data if available on page load
window.onload = loadResumeFromURL;
