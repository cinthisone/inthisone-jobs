document.addEventListener('DOMContentLoaded', function() {
    let descriptionEditor, coverLetterEditor;
    
    // Initialize CKEditor for job description
    if (document.querySelector('#description')) {
        ClassicEditor
            .create(document.querySelector('#description'))
            .then(editor => {
                descriptionEditor = editor;
            })
            .catch(error => {
                console.error('Description editor error:', error);
            });
    }
    
    // Initialize CKEditor for cover letter
    if (document.querySelector('#cover_letter')) {
        ClassicEditor
            .create(document.querySelector('#cover_letter'))
            .then(editor => {
                coverLetterEditor = editor;
            })
            .catch(error => {
                console.error('Cover letter editor error:', error);
            });
    }
    
    // Add form submission handler to capture CKEditor content
    const jobForm = document.getElementById('job-form');
    if (jobForm) {
        // Add event listener for the submit button directly
        const submitButton = jobForm.querySelector('input[type="submit"]');
        if (submitButton) {
            submitButton.addEventListener('click', function(e) {
                e.preventDefault(); // Prevent the default submit
                
                console.log('Save button clicked');
                
                // Update hidden inputs with CKEditor content before form submission
                if (descriptionEditor) {
                    document.getElementById('description').value = descriptionEditor.getData();
                }
                if (coverLetterEditor) {
                    document.getElementById('cover_letter').value = coverLetterEditor.getData();
                }
                
                console.log('Submitting form...');
                jobForm.submit(); // Manually submit the form
            });
        }
        
        // Also keep the form submission handler as a backup
        jobForm.addEventListener('submit', function(e) {
            console.log('Form submission event');
            // This is a backup in case the button click doesn't work
            if (!e.defaultPrevented) {
                // Update hidden inputs with CKEditor content before form submission
                if (descriptionEditor) {
                    document.getElementById('description').value = descriptionEditor.getData();
                }
                if (coverLetterEditor) {
                    document.getElementById('cover_letter').value = coverLetterEditor.getData();
                }
            }
        });
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
    
    // AI-assisted job entry
    const aiForm = document.getElementById('ai-job-form');
    if (aiForm) {
        aiForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const jobPostingText = document.getElementById('job_posting').value.trim();
            if (!jobPostingText) {
                showAlert('Please paste a job posting first', 'warning');
                return;
            }
            
            const submitBtn = aiForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Processing...';
            
            // Call the API endpoint to parse the job posting
            fetch('/api/parse-job', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: jobPostingText }),
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    showAlert(`Error: ${data.error}`, 'danger');
                } else {
                    // Populate the form fields with the parsed data
                    document.getElementById('title').value = data.title || '';
                    document.getElementById('company').value = data.company || '';
                    document.getElementById('apply_date').value = data.apply_date || '';
                    
                    // Update CKEditor content
                    if (descriptionEditor) {
                        descriptionEditor.setData(data.description || '');
                    } else {
                        document.getElementById('description').value = data.description || '';
                    }
                    
                    if (coverLetterEditor && data.cover_letter) {
                        coverLetterEditor.setData(data.cover_letter || '');
                    } else if (data.cover_letter) {
                        document.getElementById('cover_letter').value = data.cover_letter || '';
                    }
                    
                    showAlert('Job posting parsed successfully! Review and submit the form.', 'success');
                    
                    // Scroll to the form
                    document.getElementById('job-form').scrollIntoView({ behavior: 'smooth' });
                }
            })
            .catch(error => {
                console.error('Error parsing job posting:', error);
                showAlert('Failed to parse job posting. Please try again.', 'danger');
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            });
        });
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
