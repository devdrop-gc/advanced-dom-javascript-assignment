document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const submitBtn = document.getElementById('submitBtn');
    const formSuccess = document.getElementById('formSuccess');
    const historyContainer = document.getElementById('messageHistory');
    const emptyState = document.getElementById('emptyState');

    // --- Utility Functions ---

    /**
     * Debounces a function call.
     */
    const debounce = (func, delay) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    };

    /**
     * Gets messages from localStorage. Handles errors gracefully.
     */
    const getMessages = () => {
        try {
            const json = localStorage.getItem('contactMessages');
            return json ? JSON.parse(json) : [];
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return [];
        }
    };

    /**
     * Saves messages to localStorage. Handles errors gracefully.
     */
    const saveMessages = (messages) => {
        try {
            localStorage.setItem('contactMessages', JSON.stringify(messages));
        } catch (error) {
            console.error('Error writing to localStorage:', error);
        }
    };

    // --- Validation Logic ---

    /**
     * Validates a single input field (updates error message).
     */
    const validateField = (input) => {
        const errorElement = document.getElementById(input.id + 'Error');
        let error = '';

        if (input.validity.valueMissing) {
            error = 'This field is required.';
        } else if (input.id === 'name' && input.value.length > 0 && input.value.length < 2) {
            error = 'Name must be at least 2 characters.';
        } else if (input.id === 'message' && input.value.length > 0 && input.value.length < 10) {
            error = 'Message must be at least 10 characters.';
        } else if (input.id === 'email' && input.value.length > 0 && !/\S+@\S+\.\S+/.test(input.value)) {
             error = 'Please enter a valid email address.';
        }

        errorElement.textContent = error;
        return error === '';
    };

    /**
     * Validates the entire form and controls the submit button's disabled state.
     * @returns {boolean} True if all fields are valid.
     */
    const validateForm = () => {
        // Ensure all fields are checked to determine the overall form state
        const isValidName = validateField(nameInput);
        const isValidEmail = validateField(emailInput);
        const isValidMessage = validateField(messageInput);
        
        // CRITICAL: Set the button's disabled state based on ALL validation results
        const isFormValid = isValidName && isValidEmail && isValidMessage;
        submitBtn.disabled = !isFormValid;
        
        return isFormValid;
    };

    // Debounced validation function (300ms delay)
    const debouncedValidate = debounce(validateForm, 300); // Debounce validateForm instead of just validateField

    // --- Message History Rendering & Management ---

    /**
     * Renders all messages to the history container.
     */
    const renderMessages = () => {
        const messages = getMessages();
        historyContainer.innerHTML = '';
        
        if (messages.length === 0) {
            emptyState.style.display = 'block';
            historyContainer.appendChild(emptyState);
            return;
        }

        emptyState.style.display = 'none';

        messages.forEach((msg) => {
            const date = new Date(msg.timestamp);
            const formattedDate = date.toLocaleDateString('en-US', { 
                year: 'numeric', month: 'short', day: 'numeric', 
                hour: '2-digit', minute: '2-digit' 
            });

            const card = document.createElement('div');
            card.className = 'message-card';
            // Ensure unique ID is set correctly
            card.dataset.id = msg.timestamp; 

            card.innerHTML = `
                <button class="delete-btn" data-id="${msg.timestamp}">Delete</button>
                <p><strong>From:</strong> ${msg.name} (${msg.email})</p>
                <p><strong>Message:</strong> ${msg.message}</p>
                <p><strong>Sent:</strong> ${formattedDate}</p>
            `;
            historyContainer.prepend(card); // Prepend new messages to the top
            historyContainer.prepend(document.createElement('hr')); // Add separator above new message
        });
        
        // Remove the first HR since prepend added an extra one at the very top
        if (messages.length > 0) {
             const firstHr = historyContainer.querySelector('hr');
             if (firstHr) historyContainer.removeChild(firstHr);
        }
    };

    /**
     * Deletes a message by its timestamp ID.
     */
    const deleteMessage = (id) => {
        let messages = getMessages();
        messages = messages.filter(msg => msg.timestamp.toString() !== id);
        saveMessages(messages);
        renderMessages();
    };

    // --- Event Listeners ---

    // **CRITICAL FIX HERE**
    [nameInput, emailInput, messageInput].forEach(input => {
        // 1. Real-time validation for immediate error messages
        input.addEventListener('keyup', () => validateField(input));
        
        // 2. Debounced and full form validation to update button state
        // When user types or stops typing, we check the whole form state
        input.addEventListener('input', () => {
            validateField(input); // Immediate feedback for current field
            debouncedValidate();   // Debounced check to enable/disable button
        });
        
        // 3. Final check on blur (when leaving the field)
        input.addEventListener('blur', validateForm); // Check the whole form on blur
    });


    // Form Submission
    form.addEventListener('submit', (e) => {
        e.preventDefault(); 
        formSuccess.textContent = ''; 

        // CRITICAL: Ensure validation is run one final time before processing
        if (validateForm()) {
            const newMessage = {
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                message: messageInput.value.trim(),
                timestamp: Date.now()
            };

            const messages = getMessages();
            messages.unshift(newMessage); 
            saveMessages(messages);
            

            // Reset form and show success
            form.reset();
            submitBtn.disabled = true; 
            formSuccess.textContent = '✅ Message sent successfully and saved to history!';
            setTimeout(() => formSuccess.textContent = '', 5000);
            
            // Re-render after successful submission and form reset
            renderMessages();

            // Clear real-time errors after success
            document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
        } else {
             // If submission is attempted while form is invalid (e.g., button was briefly enabled then disabled)
             // Run validation again to ensure all error messages are visible.
             validateForm();
        }
    });

    // Event Delegation for Delete Buttons
    historyContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn')) {
            const id = e.target.dataset.id;
            deleteMessage(id);
        }
    });

    // Initial setup
    renderMessages();
    validateForm(); // Run once at load to set initial disabled state
});