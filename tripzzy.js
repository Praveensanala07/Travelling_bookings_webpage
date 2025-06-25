document.addEventListener('DOMContentLoaded', function() {
    console.log('tripzzy.js: DOMContentLoaded event fired. Script is starting.'); 
    const loginTrigger = document.getElementById('login-trigger');
    const popupOverlay = document.getElementById('login-popup-overlay');
    const closePopupButton = document.getElementById('close-popup-button');
    const loginForm = document.getElementById('login-form');
    const mobileInput = document.getElementById('mobile-number');
    console.log('tripzzy.js: loginTrigger element:', loginTrigger);
    console.log('tripzzy.js: popupOverlay element:', popupOverlay);
    console.log('tripzzy.js: closePopupButton element:', closePopupButton);
    console.log('tripzzy.js: loginForm element:', loginForm);
    console.log('tripzzy.js: mobileInput element:', mobileInput);
    function showPopup() {
        console.log('tripzzy.js: showPopup() function called.');
        if (popupOverlay) {
            popupOverlay.style.display = 'flex';
            console.log('tripzzy.js: popupOverlay.style.display set to "flex".'); 
        } else {
            console.error('tripzzy.js: ERROR in showPopup() - popupOverlay is null!'); 
        }
    }
    function hidePopup() {
        console.log('tripzzy.js: hidePopup() function called.');
        if (popupOverlay) {
            popupOverlay.style.display = 'none';
            console.log('tripzzy.js: popupOverlay.style.display set to "none".'); 
        } else {
            console.error('tripzzy.js: ERROR in hidePopup() - popupOverlay is null!'); 
        }
    }
    if (loginTrigger) {
        loginTrigger.addEventListener('click', function(event) {
            event.preventDefault();
            console.log('tripzzy.js: Login link clicked!');
            showPopup();
        });
    } else {
        console.error('tripzzy.js: CRITICAL ERROR - loginTrigger element (id="login-trigger") NOT FOUND. Click event cannot be attached.');
    }
    if (closePopupButton) {
        closePopupButton.addEventListener('click', function() {
            console.log('tripzzy.js: Close button clicked.');
            hidePopup();
        });
    } else {
        console.warn('tripzzy.js: WARNING - closePopupButton (id="close-popup-button") NOT FOUND.');
    }
    if (popupOverlay) {
        popupOverlay.addEventListener('click', function(event) {
            if (event.target === popupOverlay) {
                console.log('tripzzy.js: Clicked outside popup content.');
                hidePopup();
            }
        });
    }
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            console.log('tripzzy.js: Login form submitted.');
            const mobileNumber = mobileInput.value;

            if (mobileNumber && mobileNumber.length === 10 && /^[0-9]+$/.test(mobileNumber)) {
                alert('OTP would be sent to: +91 ' + mobileNumber);
                hidePopup();
                if (loginForm) loginForm.reset();
            } else {
                alert('Please enter a valid 10-digit mobile number.');
                if (mobileInput) mobileInput.focus();
            }
        });
    } else {
        console.warn('tripzzy.js: WARNING - loginForm (id="login-form") NOT FOUND.'); 
    }
    document.addEventListener('keydown', function(event) {
        if (event.key === "Escape" && popupOverlay && popupOverlay.style.display === 'flex') {
            console.log('tripzzy.js: Escape key pressed, closing popup.'); 
            hidePopup();
        }
    });
});
console.log('tripzzy.js: Script file parsed by browser.');
