// Main JavaScript file for PDF Chat App

document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on a success page (has success message) and hide any lingering overlay
    const successMessage = document.querySelector('.alert-success');
    if (successMessage) {
        hideProgressOverlay();
        // Reset button state
        const uploadBtn = document.querySelector('.upload-btn');
        if (uploadBtn) {
            uploadBtn.innerHTML = '<i class="fas fa-rocket"></i> Upload and Process PDF';
            uploadBtn.disabled = false;
        }
    }
    
    // File input handling
    const fileInput = document.getElementById('pdf-input');
    const fileLabel = document.querySelector('.file-input-label');
    const uploadForm = document.getElementById('pdf-upload-form');
    const uploadBtn = document.querySelector('.upload-btn');
    
    if (fileInput && fileLabel) {
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const fileName = file.name;
                const fileSize = (file.size / 1024 / 1024).toFixed(2); // MB
                fileLabel.innerHTML = `<i class="fas fa-file-pdf"></i> ${fileName} (${fileSize} MB)`;
                fileLabel.classList.add('file-selected');
            } else {
                fileLabel.innerHTML = '<i class="fas fa-file-pdf"></i> Choose PDF File';
                fileLabel.classList.remove('file-selected');
            }
        });
    }

    // Form submission handling
    if (uploadForm && uploadBtn) {
        uploadForm.addEventListener('submit', function(e) {
            const file = fileInput?.files[0];
            if (!file) {
                e.preventDefault();
                alert('Please select a PDF file first.');
                return;
            }

            // Show progress overlay
            showProgressOverlay();
            
            // Display file info in progress modal
            const fileSizeMB = file.size / 1024 / 1024;
            updateProgressMessage(`📄 Processing "${file.name}" (${fileSizeMB.toFixed(2)} MB)...`);
            
            // Show file details
            const fileInfo = document.getElementById('file-info');
            const fileDetails = document.getElementById('file-details');
            if (fileInfo && fileDetails) {
                fileDetails.textContent = `File: ${file.name} | Size: ${fileSizeMB.toFixed(2)} MB | Type: ${file.type}`;
                fileInfo.style.display = 'block';
            }
            
            // Start realistic progress simulation based on file size
            const estimatedTimeMS = Math.max(15000, fileSizeMB * 5000); // At least 15 seconds, 5 seconds per MB
            simulateRealisticProgress(estimatedTimeMS);
            
            // Show loading state on button
            uploadBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing PDF...';
            uploadBtn.disabled = true;
            
            // No timeout - let the server processing complete naturally
            // The progress overlay will be hidden when the server responds
        });
    }

    // Progress overlay functions
    function showProgressOverlay() {
        const overlay = document.getElementById('progress-overlay');
        if (overlay) {
            overlay.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }

    function hideProgressOverlay() {
        const overlay = document.getElementById('progress-overlay');
        if (overlay) {
            overlay.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    function updateProgress(step, message, percentage) {
        const progressMessage = document.getElementById('progress-message');
        const progressBar = document.getElementById('progress-bar');
        const progressPercentage = document.getElementById('progress-percentage');
        const steps = document.querySelectorAll('.step');

        // Update message
        if (progressMessage) {
            progressMessage.textContent = message;
        }

        // Update progress bar
        if (progressBar && progressPercentage) {
            progressBar.style.width = percentage + '%';
            progressPercentage.textContent = Math.round(percentage) + '%';
        }

        // Update step indicators
        steps.forEach((stepEl, index) => {
            stepEl.classList.remove('active', 'completed');
            if (index < step - 1) {
                stepEl.classList.add('completed');
            } else if (index === step - 1) {
                stepEl.classList.add('active');
            }
        });
    }

    function updateProgressMessage(message) {
        const progressMessage = document.getElementById('progress-message');
        if (progressMessage) {
            progressMessage.textContent = message;
        }
    }

    function simulateRealisticProgress(estimatedTimeMS) {
        // More realistic progress steps with variable timing
        const progressSteps = [
            { step: 1, message: '📄 Reading PDF document...', percentage: 5, delay: 1000 },
            { step: 1, message: '📖 Extracting text content...', percentage: 15, delay: 2000 },
            { step: 2, message: '✂️ Creating text chunks...', percentage: 25, delay: 1500 },
            { step: 3, message: '🧠 Initializing AI models...', percentage: 30, delay: 3000 },
            { step: 3, message: '🔄 Generating embeddings (this may take a while)...', percentage: 35, delay: 0 },
            // Dynamic embedding steps will be added here
            { step: 4, message: '� Preparing upload to database...', percentage: 85, delay: 1000 },
            { step: 4, message: '📤 Uploading to Pinecone database...', percentage: 90, delay: 0 },
            // Dynamic upload steps will be added here
            { step: 4, message: '✅ Finalizing setup...', percentage: 98, delay: 1000 }
        ];

        let currentStep = 0;
        let currentInterval;

        const runProgressStep = () => {
            if (currentStep < progressSteps.length) {
                const { step, message, percentage, delay } = progressSteps[currentStep];
                updateProgress(step, message, percentage);
                currentStep++;

                // Special handling for embedding step (step 3)
                if (message.includes('Generating embeddings') && currentStep < progressSteps.length) {
                    // Simulate embedding progress from 35% to 85%
                    simulateEmbeddingProgress(() => {
                        // Continue with upload steps after embeddings
                        currentStep = progressSteps.findIndex(s => s.step === 4);
                        setTimeout(runProgressStep, 500);
                    });
                    return;
                }

                // Special handling for upload step (step 4)
                if (message.includes('Uploading to Pinecone') && currentStep < progressSteps.length) {
                    // Simulate upload progress from 90% to 98%
                    simulateUploadProgress(() => {
                        setTimeout(runProgressStep, 500);
                    });
                    return;
                }

                if (delay > 0) {
                    setTimeout(runProgressStep, delay);
                } else {
                    setTimeout(runProgressStep, 500);
                }
            } else {
                updateProgress(4, '🎉 Processing complete!', 100);
            }
        };

        // Start the progress simulation
        setTimeout(runProgressStep, 500);
    }

    function simulateEmbeddingProgress(onComplete) {
        let embeddingProgress = 35;
        const maxEmbedding = 85;
        const interval = setInterval(() => {
            embeddingProgress += Math.random() * 3 + 1; // Random increment between 1-4
            if (embeddingProgress >= maxEmbedding) {
                embeddingProgress = maxEmbedding;
                clearInterval(interval);
                updateProgress(3, '✅ Embeddings generated successfully!', embeddingProgress);
                setTimeout(onComplete, 1000);
                return;
            }
            updateProgress(3, `🔄 Generating embeddings... ${Math.round(embeddingProgress)}%`, embeddingProgress);
        }, 1500); // Update every 1.5 seconds
    }

    function simulateUploadProgress(onComplete) {
        let uploadProgress = 90;
        const maxUpload = 98;
        let batchCount = 1;
        const interval = setInterval(() => {
            uploadProgress += Math.random() * 2 + 0.5; // Random increment between 0.5-2.5
            if (uploadProgress >= maxUpload) {
                uploadProgress = maxUpload;
                clearInterval(interval);
                updateProgress(4, '✅ Upload completed successfully!', uploadProgress);
                setTimeout(onComplete, 1000);
                return;
            }
            updateProgress(4, `📤 Uploading batch ${batchCount}... ${Math.round(uploadProgress)}%`, uploadProgress);
            batchCount++;
        }, 2000); // Update every 2 seconds
    }

    // Chat form handling
    const chatForms = document.querySelectorAll('.chat-form');
    chatForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const submitBtn = form.querySelector('button[type="submit"]');
            const questionInput = form.querySelector('input[name="question"]');
            
            if (!questionInput?.value.trim()) {
                e.preventDefault();
                alert('Please enter a question.');
                return;
            }

            // Show loading state
            if (submitBtn) {
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Thinking...';
                submitBtn.disabled = true;
            }
        });
    });

    // Auto-focus on question input if present
    const questionInput = document.getElementById('user-question');
    if (questionInput && !window.location.hash) {
        setTimeout(() => {
            questionInput.focus();
        }, 100);
    }

    // Smooth scrolling for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + Enter to submit forms
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            const activeForm = document.querySelector('form:focus-within');
            if (activeForm) {
                activeForm.submit();
            }
        }
        
        // Escape to clear input
        if (e.key === 'Escape') {
            const activeInput = document.activeElement;
            if (activeInput && activeInput.tagName === 'INPUT') {
                activeInput.value = '';
            }
        }
    });

    // Close alerts functionality
    document.querySelectorAll('.alert').forEach(alert => {
        const closeBtn = document.createElement('button');
        closeBtn.className = 'alert-close';
        closeBtn.innerHTML = '<i class="fas fa-times"></i>';
        closeBtn.setAttribute('aria-label', 'Close alert');
        closeBtn.style.cssText = `
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: none;
            border: none;
            cursor: pointer;
            opacity: 0.7;
            transition: opacity 0.3s ease;
        `;
        
        closeBtn.addEventListener('click', () => {
            alert.style.opacity = '0';
            alert.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                alert.remove();
            }, 300);
        });
        
        closeBtn.addEventListener('mouseover', () => {
            closeBtn.style.opacity = '1';
        });
        
        closeBtn.addEventListener('mouseout', () => {
            closeBtn.style.opacity = '0.7';
        });
        
        alert.style.position = 'relative';
        alert.appendChild(closeBtn);
    });

    // Add entrance animations for better UX
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.message, .alert, .feature-card, .source-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Utility functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 2rem;
        right: 2rem;
        background: var(--white);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        padding: 1rem;
        box-shadow: var(--shadow);
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        max-width: 300px;
    `;
    
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close" style="margin-left: auto; background: none; border: none; cursor: pointer;"><i class="fas fa-times"></i></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
    
    // Manual close
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.remove();
    });
}

// Global functions
window.fillQuestion = function(question) {
    const questionInput = document.getElementById('user-question');
    if (questionInput) {
        questionInput.value = question;
        questionInput.focus();
        questionInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
};

// Export for other scripts
window.ChatPDF = {
    showNotification
};