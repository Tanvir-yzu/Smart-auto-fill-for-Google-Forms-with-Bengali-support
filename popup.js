// Default data structure for the attendance form
const defaultData = {
    studentName: '',
    date: new Date().toISOString().split('T')[0],
    email: '',
    course: 'Machine Learning',
    mentor: '',
    week: 'Week 8',
    module: '',
    hours: '৩ ঘন্টা+'
};

// Preset profiles
const profiles = {
    today: {
        ...defaultData,
        date: new Date().toISOString().split('T')[0]
    }
};

let currentPreset = 'today';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadSavedData();
    setupEventListeners();
    updateDateField();
});

function setupEventListeners() {
    // Preset buttons
    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentPreset = e.target.dataset.preset;
            
            if (currentPreset === 'today') {
                updateDateField();
            }
        });
    });
    
    // Main buttons
    document.getElementById('fillBtn').addEventListener('click', fillForm);
    document.getElementById('saveBtn').addEventListener('click', saveProfile);
    
    // Auto-update date if preset is today
    document.getElementById('dateField').addEventListener('change', () => {
        if (currentPreset === 'today') {
            document.querySelector('[data-preset="custom"]').click();
        }
    });
}

function updateDateField() {
    document.getElementById('dateField').value = new Date().toISOString().split('T')[0];
}

function getFormData() {
    return {
        studentName: document.getElementById('studentName').value,
        date: document.getElementById('dateField').value,
        email: document.getElementById('emailField').value,
        course: document.getElementById('courseSelect').value,
        mentor: document.getElementById('mentorSelect').value,
        week: document.getElementById('weekSelect').value,
        module: document.getElementById('moduleField').value,
        hours: document.getElementById('hoursSelect').value,
        speed: document.getElementById('speed').value,
        animate: document.getElementById('animate').checked,
        autoSubmit: document.getElementById('autoSubmit').checked
    };
}

async function fillForm() {
    const data = getFormData();
    
    // Validate required fields
    if (!data.studentName || !data.mentor || !data.module) {
        showStatus('Please fill in: Name, Mentor, and Module', 'error');
        return;
    }
    
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        if (!tab || !tab.url.includes('docs.google.com/forms')) {
            showStatus('Please open a Google Form first', 'error');
            return;
        }
        
        // Save current data
        chrome.storage.local.set({ savedData: data });
        
        // Execute script
        const results = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: autoFillGoogleForm,
            args: [data]
        });
        
        const result = results[0]?.result;
        
        if (result && result.success) {
            showStatus(`✅ Filled ${result.filledCount} fields successfully!`, 'success');
            
            if (data.autoSubmit && result.filledCount >= 6) {
                setTimeout(() => {
                    submitForm(tab.id);
                }, 1000);
            }
        } else {
            showStatus('⚠️ Some fields could not be filled', 'error');
        }
        
    } catch (error) {
        console.error('Fill error:', error);
        showStatus('❌ Error: ' + error.message, 'error');
    }
}

async function submitForm(tabId) {
    try {
        await chrome.scripting.executeScript({
            target: { tabId: tabId },
            func: () => {
                const submitBtn = document.querySelector('[jsname="M2UYVd"], [role="button"][type="submit"], .uArJ5e');
                if (submitBtn) {
                    submitBtn.click();
                    return true;
                }
                return false;
            }
        });
    } catch (e) {
        console.log('Auto-submit failed', e);
    }
}

function saveProfile() {
    const data = getFormData();
    chrome.storage.local.set({ savedData: data }, () => {
        showStatus('💾 Profile saved!', 'success');
    });
}

function loadSavedData() {
    chrome.storage.local.get(['savedData'], (result) => {
        if (result.savedData) {
            const data = result.savedData;
            document.getElementById('studentName').value = data.studentName || '';
            document.getElementById('dateField').value = data.date || new Date().toISOString().split('T')[0];
            document.getElementById('emailField').value = data.email || '';
            document.getElementById('courseSelect').value = data.course || 'Machine Learning';
            document.getElementById('mentorSelect').value = data.mentor || '';
            document.getElementById('weekSelect').value = data.week || 'Week 8';
            document.getElementById('moduleField').value = data.module || '';
            document.getElementById('hoursSelect').value = data.hours || '৩ ঘন্টা+';
        }
    });
}

function showStatus(message, type) {
    const status = document.getElementById('status');
    status.textContent = message;
    status.className = 'status ' + type;
    
    setTimeout(() => {
        status.className = 'status';
    }, 4000);
}

// This function runs in the context of the Google Form page
function autoFillGoogleForm(config) {
    return new Promise((resolve) => {
        let filledCount = 0;
        const filledElements = new Set();
        
        // Helper to trigger all necessary events
        function triggerEvents(element) {
            ['focus', 'input', 'change', 'blur'].forEach(eventType => {
                const event = new Event(eventType, { bubbles: true, cancelable: true });
                element.dispatchEvent(event);
            });
        }
        
        // Helper to fill text input with animation
        async function fillTextInput(element, value, shouldAnimate, speed) {
            if (!element || filledElements.has(element)) return false;
            
            // Scroll into view
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Highlight
            element.style.transition = 'all 0.3s';
            element.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.5)';
            element.style.borderColor = '#6366f1';
            
            if (shouldAnimate && speed > 1) {
                element.focus();
                const delay = (6 - parseInt(speed)) * 30;
                element.value = '';
                
                for (let i = 0; i < value.length; i++) {
                    element.value += value[i];
                    triggerEvents(element);
                    await new Promise(r => setTimeout(r, delay));
                }
            } else {
                element.value = value;
                triggerEvents(element);
            }
            
            filledElements.add(element);
            filledCount++;
            
            // Remove highlight
            setTimeout(() => {
                element.style.boxShadow = '';
                element.style.borderColor = '';
            }, 2000);
            
            return true;
        }
        
        // Helper to select radio button
        async function selectRadio(value, labelText) {
            // Find all radio containers
            const radioContainers = document.querySelectorAll('[role="radiogroup"], .oyXaNc, .lLfZXe');
            
            for (const container of radioContainers) {
                // Check if this container matches our target by looking at labels
                const questionLabel = container.closest('[role="listitem"], .Qr7Oae')?.textContent || '';
                
                // Check if this is the right question
                let isMatch = false;
                if (labelText.includes('course') && questionLabel.includes('কোর্স')) isMatch = true;
                if (labelText.includes('mentor') && questionLabel.includes('মেন্টর')) isMatch = true;
                if (labelText.includes('week') && questionLabel.includes('উইক')) isMatch = true;
                if (labelText.includes('hour') && questionLabel.includes('ঘন্টা')) isMatch = true;
                
                if (!isMatch) continue;
                
                // Find the radio option with matching text
                const options = container.querySelectorAll('[role="radio"], .Od2TWd, label');
                
                for (const option of options) {
                    const optionText = option.textContent || option.getAttribute('aria-label') || '';
                    
                    if (optionText.includes(value) || value.includes(optionText)) {
                        // Click the radio
                        option.click();
                        
                        // Also try to find the actual input
                        const radioInput = option.querySelector('input[type="radio"]') || 
                                          option.closest('[role="radio"]');
                        
                        if (radioInput && !filledElements.has(radioInput)) {
                            filledElements.add(radioInput);
                            filledCount++;
                            
                            // Visual feedback
                            option.style.transition = 'all 0.3s';
                            option.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.5)';
                            setTimeout(() => {
                                option.style.boxShadow = '';
                            }, 2000);
                        }
                        
                        await new Promise(r => setTimeout(r, 300));
                        return true;
                    }
                }
            }
            return false;
        }
        
        async function processForm() {
            // 1. Fill Email (usually auto-filled but let's ensure)
            const emailInputs = document.querySelectorAll('input[type="email"], input[name*="email"]');
            for (const input of emailInputs) {
                if (config.email && !input.value) {
                    await fillTextInput(input, config.email, config.animate, config.speed);
                }
            }
            
            // 2. Fill Date
            const dateInputs = document.querySelectorAll('input[type="date"]');
            for (const input of dateInputs) {
                if (config.date) {
                    await fillTextInput(input, config.date, false, 1); // No animation for date
                }
            }
            
            // 3. Fill Name (তোমার নাম)
            const allInputs = document.querySelectorAll('input[type="text"]');
            for (const input of allInputs) {
                const container = input.closest('[role="listitem"], .Qr7Oae');
                const label = container?.textContent || '';
                
                if (label.includes('নাম') || label.includes('Name')) {
                    await fillTextInput(input, config.studentName, config.animate, config.speed);
                    break;
                }
            }
            
            // 4. Select Course
            if (config.course) {
                await selectRadio(config.course, 'course');
            }
            
            // 5. Select Mentor
            if (config.mentor) {
                await selectRadio(config.mentor, 'mentor');
            }
            
            // 6. Select Week
            if (config.week) {
                await selectRadio(config.week, 'week');
            }
            
            // 7. Fill Module (মডিউল)
            for (const input of allInputs) {
                const container = input.closest('[role="listitem"], .Qr7Oae');
                const label = container?.textContent || '';
                
                if (label.includes('মডিউল') || label.includes('Module')) {
                    await fillTextInput(input, config.module, config.animate, config.speed);
                    break;
                }
            }
            
            // 8. Select Hours (ঘন্টা)
            if (config.hours) {
                await selectRadio(config.hours, 'hour');
            }
            
            resolve({
                success: filledCount > 0,
                filledCount: filledCount
            });
        }
        
        processForm();
    });
}