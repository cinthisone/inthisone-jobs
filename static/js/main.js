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
    
    // Use a simpler approach that directly synchronizes the CKEditor content with the textarea
    // Set up a save button handler to update CKEditor content before submission
    const saveButton = document.querySelector('input[type="submit"]');
    if (jobForm && saveButton) {
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
        
        // Sync data when the form loses focus
        jobForm.addEventListener('focusout', syncEditors);
        
        // Also sync data when any input changes
        jobForm.addEventListener('input', syncEditors);
        
        // And sync every 5 seconds as a backup
        setInterval(syncEditors, 5000);
        
        // Most importantly, sync right before submission
        saveButton.addEventListener('click', function(e) {
            // First synchronize
            syncEditors();
            
            // Give a small delay to ensure data is updated
            setTimeout(() => {
                console.log('Form data synchronized, continuing with submission');
            }, 50);
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
            
            const submitBtn = aiForm.querySelector('input[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.value = 'Processing...';
            
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
                    
                    // Destroy existing editor instances if they exist
                    if (window.descriptionEditor) {
                        window.descriptionEditor.destroy();
                        window.descriptionEditor = null;
                    }
                    
                    if (window.coverLetterEditor) {
                        window.coverLetterEditor.destroy();
                        window.coverLetterEditor = null;
                    }
                    
                    // Set textarea values directly before reinitializing
                    document.getElementById('description').value = data.description || '';
                    document.getElementById('cover_letter').value = data.cover_letter || '';
                    
                    // Reinitialize the editors with new content
                    setTimeout(() => {
                        // Initialize the CKEditor instances again
                        ClassicEditor
                            .create(document.getElementById('description'))
                            .then(editor => {
                                window.descriptionEditor = editor;
                                console.log('Description editor re-initialized with content');
                                
                                // Add change listener to sync with textarea
                                editor.model.document.on('change:data', () => {
                                    document.getElementById('description').value = editor.getData();
                                    console.log('Description automatically synced');
                                });
                            })
                            .catch(error => {
                                console.error('Error reinitializing description editor:', error);
                            });
                            
                        ClassicEditor
                            .create(document.getElementById('cover_letter'))
                            .then(editor => {
                                window.coverLetterEditor = editor;
                                console.log('Cover letter editor re-initialized with content');
                                
                                // Add change listener to sync with textarea
                                editor.model.document.on('change:data', () => {
                                    document.getElementById('cover_letter').value = editor.getData();
                                    console.log('Cover letter automatically synced');
                                });
                            })
                            .catch(error => {
                                console.error('Error reinitializing cover letter editor:', error);
                            });
                            
                        showAlert('Job posting parsed successfully! Review and submit the form.', 'success');
                        // Scroll to the form
                        document.getElementById('job-form').scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                }
            })
            .catch(error => {
                console.error('Error parsing job posting:', error);
                showAlert('Failed to parse job posting. Please try again.', 'danger');
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.value = 'Add using AI';
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
