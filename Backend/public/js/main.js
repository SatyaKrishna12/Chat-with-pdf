document.addEventListener("DOMContentLoaded", function() {
    // Add loading states to forms
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const submitButton = form.querySelector('button[type="submit"]');
            if (submitButton) {
                const originalText = submitButton.textContent;
                submitButton.textContent = '⏳ Processing...';
                submitButton.disabled = true;
                
                // Re-enable after a timeout in case of error
                setTimeout(() => {
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                }, 30000); // 30 seconds timeout
            }
        });
    });
    
    // Add file input preview
    const fileInput = document.getElementById('pdf-input');
    if (fileInput) {
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            const label = document.querySelector('.file-input-label');
            
            if (file) {
                label.textContent = `📎 Selected: ${file.name}`;
                label.style.background = 'linear-gradient(45deg, #2ed573, #1abc9c)';
            } else {
                label.textContent = '📎 Choose PDF File';
                label.style.background = 'linear-gradient(45deg, #667eea, #764ba2)';
            }
        });
    }
    
    // Auto-focus on question inputs
    const questionInputs = document.querySelectorAll('input[name="question"]');
    if (questionInputs.length > 0) {
        questionInputs[questionInputs.length - 1].focus();
    }
    
    // Add smooth scrolling to new question section
    const newQuestionSection = document.querySelector('.new-question-section');
    if (newQuestionSection) {
        newQuestionSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
});