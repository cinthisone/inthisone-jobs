document.addEventListener('DOMContentLoaded', function() {
    // Get our form elements
    const jobForm = document.getElementById('job-form');
    
    // Initialize CKEditor for description and cover letter fields
    // Make them available globally in this scope
    window.descriptionEditor = null;
    window.coverLetterEditor = null;
    
    // Initialize CKEditor instances with sync functionality
    const initializeEditors = function() {
        // Only initialize if the elements exist and haven't been initialized yet
        const descriptionField = document.getElementById('description');
        const coverLetterField = document.getElementById('cover_letter');
        
        if (descriptionField && !window.descriptionEditor) {
            ClassicEditor
                .create(descriptionField)
                .then(editor => {
                    window.descriptionEditor = editor;
                    console.log('Description editor initialized');
                    
                    // Add change listener to sync with textarea
                    editor.model.document.on('change:data', () => {
                        descriptionField.value = editor.getData();
                        console.log('Description automatically synced');
                    });
                })
                .catch(error => {
                    console.error('Error initializing description editor:', error);
                });
        }
        
        if (coverLetterField && !window.coverLetterEditor) {
            ClassicEditor
                .create(coverLetterField)
                .then(editor => {
                    window.coverLetterEditor = editor;
                    console.log('Cover letter editor initialized');
                    
                    // Add change listener to sync with textarea
                    editor.model.document.on('change:data', () => {
                        coverLetterField.value = editor.getData();
                        console.log('Cover letter automatically synced');
                    });
                })
                .catch(error => {
                    console.error('Error initializing cover letter editor:', error);
                });
        }
    };
    
    // Initialize editors on page load
    initializeEditors();
    
    // Use a different approach for form submission
    if (jobForm) {
        // Create a manual synchronization function
        const syncEditors = function() {
            console.log('Synchronizing CKEditor data with textareas');
            
            // Update description field
            if (window.descriptionEditor) {
                try {
                    const descriptionData = window.descriptionEditor.getData();
                    document.getElementById('description').value = descriptionData;
                    console.log('Synced description field with editor data');
                } catch (error) {
                    console.error('Error syncing description:', error);
                }
            }
            
            // Update cover letter field
            if (window.coverLetterEditor) {
                try {
                    const coverLetterData = window.coverLetterEditor.getData();
                    document.getElementById('cover_letter').value = coverLetterData;
                    console.log('Synced cover letter field with editor data');
                } catch (error) {
                    console.error('Error syncing cover letter:', error);
                }
            }
        };
        
        // Add a pre-submit event to the form to ensure CKEditor content is synced
        jobForm.addEventListener('submit', function(e) {
            // Don't prevent the default behavior - we want normal form submission
            console.log('Form submit event triggered');
            
            // Ensure editors are synced before submission
            syncEditors();
            
            console.log('Form data synchronized for submission');
            console.log('Form action:', jobForm.action);
            
            // Log form data for debugging
            const formData = new FormData(jobForm);
            console.log('Form contains these fields:');
            for (let pair of formData.entries()) {
                console.log(pair[0] + ': ' + pair[1]);
            }
            
            // Let the form submit naturally
            console.log('Continuing with normal form submission');
        });
        }
    }

    // Search functionality
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        const jobTableBody = document.getElementById('job-table-body');
        const loadingSpinner = document.getElementById('loading-spinner');
        
        searchInput.addEventListener('input', debounce(function() {
            const query = searchInput.value.trim();
            
            if (loadingSpinner) loadingSpinner.style.display = 'block';
            
            // Fetch filtered jobs
            fetch(`/jobs/search?q=${encodeURIComponent(query)}`)
                .then(response => response.json())
                .then(jobs => {
                    if (loadingSpinner) loadingSpinner.style.display = 'none';
                    updateJobTable(jobs);
                })
                .catch(error => {
                    console.error('Error searching jobs:', error);
                    if (loadingSpinner) loadingSpinner.style.display = 'none';
                });
        }, 300));
        
        function updateJobTable(jobs) {
            if (!jobTableBody) return;
            
            // Clear existing table rows
            jobTableBody.innerHTML = '';
            
            if (jobs.length === 0) {
                // No results found
                const emptyRow = document.createElement('tr');
                emptyRow.innerHTML = `
                    <td colspan="4" class="text-center py-4">
                        <div class="text-muted">No job applications found</div>
                    </td>
                `;
                jobTableBody.appendChild(emptyRow);
            } else {
                // Add job rows
                jobs.forEach(job => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${job.title}</td>
                        <td>${job.company}</td>
                        <td>${job.apply_date}</td>
                        <td class="text-right">
                            <a href="/jobs/view/${job.id}" class="btn btn-sm btn-outline-primary">View</a>
                            <a href="/jobs/edit/${job.id}" class="btn btn-sm btn-outline-secondary">Edit</a>
                            <button class="btn btn-sm btn-outline-danger delete-job" data-id="${job.id}">Delete</button>
                        </td>
                    `;
                    jobTableBody.appendChild(row);
                });
                
                // Re-attach delete event listeners
                attachDeleteListeners();
            }
        }
    }
    
// Simple global function for AI job processing - accessible from inline HTML
function processAIJobPosting() {
    console.log('processAIJobPosting function called');
    
    // Get the job posting text
    var jobPostingTextarea = document.getElementById('job_posting');
    if (!jobPostingTextarea) {
        console.error('Could not find job_posting textarea');
        alert('Error: Could not find job posting field');
        return false;
    }
    
    var jobPostingText = jobPostingTextarea.value.trim();
    if (!jobPostingText) {
        alert('Please paste a job posting first');
        return false;
    }
    
    // Show processing state
    var submitBtn = document.querySelector('#ai-job-form input[type="submit"]');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.value = 'Processing...';
    }
    
    // Create form data to send
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/parse-job', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    
    xhr.onload = function() {
        if (xhr.status === 200) {
            try {
                var data = JSON.parse(xhr.responseText);
                
                if (data.error) {
                    alert('Error: ' + data.error);
                } else {
                    console.log('Successfully parsed job posting:', data);
                    
                    // Fill in the form fields
                    document.getElementById('title').value = data.title || '';
                    document.getElementById('company').value = data.company || '';
                    document.getElementById('apply_date').value = data.apply_date || '';
                    
                    // Clean up existing editors if they exist
                    if (window.descriptionEditor) {
                        window.descriptionEditor.destroy();
                        window.descriptionEditor = null;
                    }
                    
                    if (window.coverLetterEditor) {
                        window.coverLetterEditor.destroy();
                        window.coverLetterEditor = null;
                    }
                    
                    // Set values directly to textareas
                    document.getElementById('description').value = data.description || '';
                    document.getElementById('cover_letter').value = data.cover_letter || '';
                    
                    // Reinitialize editors with new content
                    setTimeout(function() {
                        // Description editor
                        ClassicEditor
                            .create(document.getElementById('description'))
                            .then(function(editor) {
                                window.descriptionEditor = editor;
                            })
                            .catch(function(error) {
                                console.error('Error creating description editor:', error);
                            });
                        
                        // Cover letter editor
                        ClassicEditor
                            .create(document.getElementById('cover_letter'))
                            .then(function(editor) {
                                window.coverLetterEditor = editor;
                            })
                            .catch(function(error) {
                                console.error('Error creating cover letter editor:', error);
                            });
                        
                        // Show success message and scroll to form
                        alert('Job posting parsed successfully! Review and submit the form.');
                        document.getElementById('job-form').scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                }
            } catch (e) {
                console.error('Error parsing response:', e);
                alert('Failed to parse response from server.');
            }
        } else {
            console.error('Request failed. Status:', xhr.status);
            alert('Failed to process job posting. Please try again.');
        }
        
        // Reset button state
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.value = 'Add using AI';
        }
    };
    
    xhr.onerror = function() {
        console.error('Network error occurred');
        alert('Network error. Please check your connection and try again.');
        
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.value = 'Add using AI';
        }
    };
    
    // Send the request
    xhr.send(JSON.stringify({ text: jobPostingText }));
    return false;
}
    
    // Delete job confirmation
    function attachDeleteListeners() {
        const deleteButtons = document.querySelectorAll('.delete-job');
        deleteButtons.forEach(button => {
            button.addEventListener('click', function() {
                const jobId = this.getAttribute('data-id');
                if (confirm('Are you sure you want to delete this job application?')) {
                    const form = document.createElement('form');
                    form.method = 'POST';
                    form.action = `/jobs/delete/${jobId}`;
                    document.body.appendChild(form);
                    form.submit();
                }
            });
        });
    }
    
    // Initialize delete listeners
    attachDeleteListeners();
    
    // Helper functions
    function debounce(func, delay) {
        let timeoutId;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(context, args);
            }, delay);
        };
    }
    
    function showAlert(message, type) {
        const alertContainer = document.getElementById('alert-container');
        if (alertContainer) {
            const alert = document.createElement('div');
            alert.className = `alert alert-${type} alert-dismissible fade show`;
            alert.innerHTML = `
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            `;
            alertContainer.appendChild(alert);
            
            // Auto-dismiss after 5 seconds
            setTimeout(() => {
                alert.classList.remove('show');
                setTimeout(() => {
                    alertContainer.removeChild(alert);
                }, 150);
            }, 5000);
        }
    }
});
