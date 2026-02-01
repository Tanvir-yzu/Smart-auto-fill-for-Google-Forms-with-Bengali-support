// Content script for Google Forms auto-fill
console.log('AutoFill Pro: Content script loaded for Google Forms');

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getFormFields') {
        const fields = detectFormFields();
        sendResponse({ fields: fields });
    }
    return true;
});

function detectFormFields() {
    const fields = [];
    
    // Detect text inputs
    document.querySelectorAll('input[type="text"], input[type="email"], input[type="date"]').forEach(input => {
        const container = input.closest('[role="listitem"], .Qr7Oae');
        const label = container?.querySelector('[role="heading"], .HoXoMd')?.textContent || '';
        
        fields.push({
            type: input.type,
            label: label,
            name: input.name,
            id: input.id
        });
    });
    
    // Detect radio groups
    document.querySelectorAll('[role="radiogroup"]').forEach(group => {
        const container = group.closest('[role="listitem"], .Qr7Oae');
        const label = container?.querySelector('[role="heading"], .HoXoMd')?.textContent || '';
        
        const options = Array.from(group.querySelectorAll('[role="radio"]')).map(radio => ({
            value: radio.getAttribute('aria-label') || radio.textContent,
            checked: radio.getAttribute('aria-checked') === 'true'
        }));
        
        fields.push({
            type: 'radio',
            label: label,
            options: options
        });
    });
    
    return fields;
}

// Auto-detect form on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFormDetection);
} else {
    initFormDetection();
}

function initFormDetection() {
    console.log('AutoFill Pro: Form detected', window.location.href);
    
    // Notify popup that we're on a form page
    chrome.runtime.sendMessage({
        action: 'formDetected',
        url: window.location.href,
        title: document.title
    }).catch(() => {});
}