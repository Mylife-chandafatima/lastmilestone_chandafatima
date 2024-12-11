// HTML Element References
const resumeForm = document.getElementById('resumeForm') as HTMLFormElement;
const resumeDisplay = document.getElementById('resume-display') as HTMLDivElement;
const shareableLinkContainer = document.getElementById('shareable-link-container') as HTMLDivElement;
const shareableLink = document.getElementById('shareable-link') as HTMLAnchorElement;
const downloadPdfButton = document.getElementById('download-pdf') as HTMLButtonElement;

const addEducationButton = document.getElementById('addEducation') as HTMLButtonElement;
const addWorkExperienceButton = document.getElementById('addWorkExperience') as HTMLButtonElement;
const addSkillButton = document.getElementById('addSkill') as HTMLButtonElement;

addEducationButton.addEventListener('click', addEducation);
addWorkExperienceButton.addEventListener('click', addWorkExperience);
addSkillButton.addEventListener('click', addSkill);

resumeForm.addEventListener('submit', generateResume);
downloadPdfButton.addEventListener('click', downloadResumeAsPDF);

// Functions to add more input fields
function addEducation() {
    const educationSection = document.getElementById('education-section') as HTMLDivElement;
    const educationGroup = document.createElement('div');
    educationGroup.classList.add('education-group');
    educationGroup.innerHTML = `
        <input type="text" class="education-input" placeholder="Degree" required />
        <input type="text" class="education-input" placeholder="School" required />
        <input type="text" class="education-input" placeholder="Year" required />
    `;
    educationSection.appendChild(educationGroup);
}

function addWorkExperience() {
    const workSection = document.getElementById('work-experience-section') as HTMLDivElement;
    const workGroup = document.createElement('div');
    workGroup.classList.add('work-experience-group');
    workGroup.innerHTML = `
        <input type="text" class="work-experience-input" placeholder="Company" required />
        <input type="text" class="work-experience-input" placeholder="Role" required />
        <input type="text" class="work-experience-input" placeholder="Years" required />
    `;
    workSection.appendChild(workGroup);
}

function addSkill() {
    const skillsSection = document.getElementById('skills-section') as HTMLDivElement;
    const skillInput = document.createElement('input');
    skillInput.type = 'text';
    skillInput.classList.add('skills-input');
    skillInput.placeholder = 'Skill';
    skillInput.required = true;
    skillsSection.appendChild(skillInput);
}

// Generate Resume Content
function generateResume(event: Event) {
    event.preventDefault();
    const formData = new FormData(resumeForm);

    // Compile resume content
    let resumeContent = `<h2>${formData.get('username')}</h2>`;
    resumeContent += `<p>Name: ${formData.get('name')}</p>`;
    resumeContent += `<p>Email: ${formData.get('email')}</p>`;
    resumeContent += `<p>Phone: ${formData.get('phone')}</p>`;
    
    resumeContent += '<h3>Education</h3><ul>';
    document.querySelectorAll('.education-group').forEach(group => {
        const degree = (group.querySelector('input[placeholder="Degree"]') as HTMLInputElement).value;
        const school = (group.querySelector('input[placeholder="School"]') as HTMLInputElement).value;
        const year = (group.querySelector('input[placeholder="Year"]') as HTMLInputElement).value;
        resumeContent += `<li>${degree}, ${school}, ${year}</li>`;
    });
    resumeContent += '</ul>';

    resumeContent += '<h3>Work Experience</h3><ul>';
    document.querySelectorAll('.work-experience-group').forEach(group => {
        const company = (group.querySelector('input[placeholder="Company"]') as HTMLInputElement).value;
        const role = (group.querySelector('input[placeholder="Role"]') as HTMLInputElement).value;
        const years = (group.querySelector('input[placeholder="Years"]') as HTMLInputElement).value;
        resumeContent += `<li>${company} - ${role} (${years})</li>`;
    });
    resumeContent += '</ul>';

    resumeContent += '<h3>Skills</h3><ul>';
    document.querySelectorAll('.skills-input').forEach(input => {
        const skill = (input as HTMLInputElement).value;
        resumeContent += `<li>${skill}</li>`;
    });
    resumeContent += '</ul>';

    resumeDisplay.innerHTML = resumeContent;
    shareableLinkContainer.style.display = 'block';

    // Create shareable link with username
    createShareableLink(formData.get('username') as string, resumeContent);
}

// Function to create shareable link
function createShareableLink(username: string, resumeContent: string) {
    const encodedContent = btoa(resumeContent); // Base64 encode the resume content
    const url = `${window.location.origin}${window.location.pathname}?user=${username}&data=${encodedContent}`;

    shareableLink.href = url;
    shareableLink.textContent = url;
}

// Load Resume from URL if data parameter is present
function loadResumeFromURL() {
    const params = new URLSearchParams(window.location.search);
    const resumeData = params.get('data');
    const username = params.get('user');
    
    if (resumeData) {
        const decodedContent = atob(resumeData);
        resumeDisplay.innerHTML = decodedContent;
        shareableLinkContainer.style.display = 'block';
        shareableLink.textContent = `${window.location.origin}${window.location.pathname}?user=${username}&data=${resumeData}`;
    }
}

// Function to download resume as PDF
function downloadResumeAsPDF() {
    const element = resumeDisplay;
    html2pdf()
        .from(element)
        .save('resume.pdf');
}

// Load resume data if available on page load
window.onload = loadResumeFromURL;
