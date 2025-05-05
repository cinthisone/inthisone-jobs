// Global variables for CKEditor instances
window.descriptionEditor = null;
window.coverLetterEditor = null;

// Simple function for AI job processing - accessible globally
function processAIJobPosting() {
    console.log('processAIJobPosting function called');
    
    // Get the job posting text and resume ID
    var jobPostingTextarea = document.getElementById('job_posting');
    var resumeSelect = document.getElementById('resume_id');
    
    if (!jobPostingTextarea) {
        console.error('Could not find job_posting textarea');
        alert('Error: Could not find job posting field');
        return false;
    }
    
    var jobPostingText = jobPostingTextarea.value.trim();
    var resumeId = resumeSelect ? resumeSelect.value : null;
    
    // Convert resume ID to number if it exists and isn't "None"
    if (resumeId && resumeId !== "0") {
        resumeId = parseInt(resumeId);
    } else {
        resumeId = null;
    }
    
    if (!jobPostingText) {
        alert('Please paste a job posting first');
        return false;
    }
    
    console.log('Using resume ID:', resumeId);
    
    // Show processing state
    var submitBtn = document.getElementById('ai-assist-button');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Processing...';
    }
    
    // Create AJAX request
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/parse-job', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    
    // Get CSRF token from the AI form
    const csrfToken = document.getElementById('ai_csrf_token');
    if (csrfToken) {
        xhr.setRequestHeader('X-CSRFToken', csrfToken.value);
    }
    
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
                    // Set pay range if available
                    if (data.pay_range) {
                        document.getElementById('pay_range').value = data.pay_range;
                    }
                    // Set job URL if available
                    if (data.job_url) {
                        document.getElementById('job_url').value = data.job_url;
                    }
                    
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
            submitBtn.textContent = 'Add using AI';
        }
    };
    
    xhr.onerror = function() {
        console.error('Network error occurred');
        alert('Network error. Please check your connection and try again.');
        
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Add using AI';
        }
    };
    
    // Send the request with resume_id if available
    xhr.send(JSON.stringify({ 
        text: jobPostingText,
        resume_id: resumeId
    }));
    return false;
}

// Main document ready function
document.addEventListener('DOMContentLoaded', function() {
    // Get form elements
    const jobForm = document.getElementById('job-form');
    
    // Setup table sorting
    setupTableSorting();
    
    // Initialize CKEditor instances
    function initializeEditors() {
        // Only initialize if the elements exist and haven't been initialized yet
        const descriptionField = document.getElementById('description');
        const coverLetterField = document.getElementById('cover_letter');
        
        if (descriptionField && !window.descriptionEditor) {
            ClassicEditor
                .create(descriptionField)
                .then(function(editor) {
                    window.descriptionEditor = editor;
                    console.log('Description editor initialized');
                    
                    // Add change listener to sync with textarea
                    editor.model.document.on('change:data', function() {
                        descriptionField.value = editor.getData();
                        console.log('Description automatically synced');
                    });
                })
                .catch(function(error) {
                    console.error('Error initializing description editor:', error);
                });
        }
        
        if (coverLetterField && !window.coverLetterEditor) {
            ClassicEditor
                .create(coverLetterField)
                .then(function(editor) {
                    window.coverLetterEditor = editor;
                    console.log('Cover letter editor initialized');
                    
                    // Add change listener to sync with textarea
                    editor.model.document.on('change:data', function() {
                        coverLetterField.value = editor.getData();
                        console.log('Cover letter automatically synced');
                    });
                })
                .catch(function(error) {
                    console.error('Error initializing cover letter editor:', error);
                });
        }
    }
    
    // Initialize editors on page load
    initializeEditors();
    
    // Handle form submission
    if (jobForm) {
        // Create a manual synchronization function
        function syncEditors() {
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
        }
        
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
                    <td colspan="5" class="text-center py-4">
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
                        <td>
                            ${job.resume ? `<span class="badge bg-info">${job.resume.title}</span>` : 
                            '<span class="text-muted small">None</span>'}
                        </td>
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
    
    // Delete job confirmation
    function attachDeleteListeners() {
        const deleteButtons = document.querySelectorAll('.delete-job');
        deleteButtons.forEach(button => {
            button.addEventListener('click', function() {
                const jobId = this.getAttribute('data-id');
                if (confirm('Are you sure you want to delete this job application?')) {
                    try {
                        console.log(`Deleting job ID: ${jobId}`);
                        
                        // Create and submit a form with POST method for proper CSRF handling
                        const form = document.createElement('form');
                        form.method = 'POST';
                        form.action = `/jobs/delete/${jobId}`;
                        form.style.display = 'none';
                        
                        // Add CSRF token from our hidden form
                        const csrfToken = document.querySelector('#csrf-form input[name="csrf_token"]');
                        if (csrfToken) {
                            console.log('Found CSRF token, adding to form');
                            const csrfInput = document.createElement('input');
                            csrfInput.type = 'hidden';
                            csrfInput.name = 'csrf_token';
                            csrfInput.value = csrfToken.value;
                            form.appendChild(csrfInput);
                        } else {
                            console.warn('CSRF token not found!');
                        }
                        
                        document.body.appendChild(form);
                        form.submit();
                    } catch (error) {
                        console.error('Error in delete operation:', error);
                        alert('Error deleting job: ' + error.message);
                    }
                }
            });
        });
    }
    
    // Initialize delete listeners
    attachDeleteListeners();
    
    // Table sorting functionality
    function setupTableSorting() {
        const sortHeaders = document.querySelectorAll('.sortable');
        let currentSort = {
            column: null,
            direction: 'asc'
        };
        
        sortHeaders.forEach(header => {
            header.addEventListener('click', function() {
                const sortBy = this.getAttribute('data-sort');
                
                // Toggle sort direction if clicking on the same column
                if (currentSort.column === sortBy) {
                    currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
                } else {
                    currentSort.column = sortBy;
                    currentSort.direction = 'asc';
                }
                
                // Remove sorting classes from all headers
                sortHeaders.forEach(h => {
                    h.classList.remove('asc', 'desc');
                });
                
                // Add sorting class to current header
                this.classList.add(currentSort.direction);
                
                // Perform the sorting
                sortTable(sortBy, currentSort.direction);
            });
        });
    }
    
    function sortTable(column, direction) {
        const table = document.querySelector('.job-table');
        const tbody = document.getElementById('job-table-body');
        const rows = Array.from(tbody.querySelectorAll('tr'));
        
        // Skip if no rows to sort (except header)
        if (rows.length <= 1) return;
        
        // Sort the rows
        const sortedRows = rows.sort((a, b) => {
            let aValue, bValue;
            
            if (column === 'title') {
                aValue = a.cells[0].textContent.trim().toLowerCase();
                bValue = b.cells[0].textContent.trim().toLowerCase();
            } else if (column === 'company') {
                aValue = a.cells[1].textContent.trim().toLowerCase();
                bValue = b.cells[1].textContent.trim().toLowerCase();
            } else if (column === 'apply_date') {
                // Get date from data attribute if it exists
                aValue = a.cells[2].getAttribute('data-date') || a.cells[2].textContent.trim();
                bValue = b.cells[2].getAttribute('data-date') || b.cells[2].textContent.trim();
            } else {
                return 0; // No sorting if column not recognized
            }
            
            // Compare the values
            if (aValue < bValue) return direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return direction === 'asc' ? 1 : -1;
            return 0;
        });
        
        // Remove all existing rows
        while (tbody.firstChild) {
            tbody.removeChild(tbody.firstChild);
        }
        
        // Add sorted rows
        sortedRows.forEach(row => {
            tbody.appendChild(row);
        });
        
        // Re-attach event listeners
        attachDeleteListeners();
    }

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
