/**
 * FHIR App Interceptor - Auto Mode
 * Automatically clicks Apps button and Infera app when Progress Notes loads
 */

// Immediate log to verify script is loading
console.warn('[FHIR INTERCEPTOR] Script file loaded at:', window.location.href);

(function() {
    'use strict';

    const CONFIG = {
        // Apps button selector
        appsButtonSelector: 'button.btnpnbottompanel[ng-click="launchFHIRapppopu()"]',
        // Infera app selector
        appSelector: 'div.image-block[emrid="qikkOYWW+Dg="]',
        // URL pattern to identify FHIR app
        urlPattern: /inferscience\.com/i,
        // Progress Notes indicator - must have encounter dropdown to be Progress Notes
        progressNotesIndicator: 'span[ng-bind="currentEnc.val"]',
        // Delay before auto-click (ms)
        autoClickDelay: 2000
    };

    let isWatching = false;
    let observer = null;
    let hasClicked = false;
    let lastEncounterValue = null;

    console.log('[FHIR] === VERSION v10 - SIMPLE POLLING ===');

    // Simple polling - just look for the Apps button
    function startPolling() {
        console.log('[FHIR] Starting polling for Apps button...');

        setInterval(function() {
            checkAndClick();
        }, 1000);
    }

    function checkAndClick() {
        const appsButton = document.querySelector(CONFIG.appsButtonSelector);
        const encounterSpan = document.querySelector(CONFIG.progressNotesIndicator);

        // Get current encounter value for change detection
        const currentEncounter = encounterSpan ? encounterSpan.textContent.trim() : null;

        // Reset if encounter changed
        if (lastEncounterValue !== null && currentEncounter !== lastEncounterValue) {
            console.log('[FHIR] Encounter changed, resetting...');
            hasClicked = false;
        }
        lastEncounterValue = currentEncounter;

        // If Apps button exists and we haven't clicked yet, click it
        if (appsButton && !hasClicked) {
            console.log('[FHIR] Apps button found! Clicking...');
            hasClicked = true;
            appsButton.click();

            // Wait for modal and click Infera app
            waitForAppAndClick();
        }
    }

    function waitForAppAndClick() {
        let attempts = 0;
        const maxAttempts = 20; // 10 seconds max

        const checkInterval = setInterval(function() {
            attempts++;

            const inferaApp = document.querySelector(CONFIG.appSelector);

            if (inferaApp) {
                console.log('[FHIR] Infera app found - auto-clicking...');
                clearInterval(checkInterval);

                // Start watching for iframe URL BEFORE clicking
                isWatching = true;
                startWatching();

                // Click the app
                setTimeout(function() {
                    inferaApp.click();
                    console.log('[FHIR] Infera app clicked');
                }, 500);

            } else if (attempts >= maxAttempts) {
                console.log('[FHIR] Timeout waiting for Infera app');
                clearInterval(checkInterval);
                isProcessing = false;
            }
        }, 500);
    }

    function startWatching() {
        console.log('[FHIR] Watching for iframe URL...');

        observer = new MutationObserver(function(mutations) {
            for (const mutation of mutations) {
                if (mutation.type === 'attributes' &&
                    mutation.target.tagName === 'IFRAME' &&
                    mutation.attributeName === 'src') {

                    const iframe = mutation.target;
                    const src = iframe.src;

                    if (src && CONFIG.urlPattern.test(src)) {
                        console.log('[FHIR] *** GOT THE URL! ***');
                        console.log('[FHIR] URL:', src);

                        // Close the eCW modal
                        closeFhirModal(iframe);

                        // Send to background script
                        sendToBackground(src);

                        stopWatching();
                        return;
                    }
                }

                for (const node of mutation.addedNodes) {
                    if (node.nodeType === 1) {
                        let iframe = null;
                        let src = null;

                        if (node.tagName === 'IFRAME' && node.src && CONFIG.urlPattern.test(node.src)) {
                            iframe = node;
                            src = node.src;
                        } else if (node.querySelectorAll) {
                            const iframes = node.querySelectorAll('iframe');
                            for (const f of iframes) {
                                if (f.src && CONFIG.urlPattern.test(f.src)) {
                                    iframe = f;
                                    src = f.src;
                                    break;
                                }
                            }
                        }

                        if (iframe && src) {
                            console.log('[FHIR] *** FOUND IFRAME WITH URL! ***');
                            closeFhirModal(iframe);
                            sendToBackground(src);
                            stopWatching();
                            return;
                        }
                    }
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['src']
        });

        setTimeout(function() {
            if (isWatching) {
                console.log('[FHIR] Watcher timeout');
                stopWatching();
            }
        }, 30000);
    }

    function stopWatching() {
        if (observer) {
            observer.disconnect();
            observer = null;
        }
        isWatching = false;
        isProcessing = false;
        console.log('[FHIR] Stopped watching, ready for next encounter');
    }

    function closeFhirModal(iframe) {
        console.log('[FHIR] Closing FHIR modal via close button...');

        // First try the specific eCW FHIR close button
        const ecwCloseBtn = document.querySelector('i[ng-click="closeFHIRResultListpopup()"]');
        if (ecwCloseBtn) {
            console.log('[FHIR] eCW FHIR close button found, clicking...');
            ecwCloseBtn.click();
            // Also close the Apps modal after a delay
            setTimeout(function() {
                closeAppsModal();
            }, 100);
            return;
        }

        // Fallback: find modal and its close button
        let modal = iframe.closest('.modal');
        if (!modal) modal = iframe.closest('[role="dialog"]');
        if (!modal) modal = iframe.closest('[class*="popup"]');

        if (modal) {
            // Find and click the close button - try multiple selectors
            const closeBtn = modal.querySelector(
                'i.icon-close-white, i[title="Close"], ' +
                '.close, .btn-close, [data-dismiss="modal"], ' +
                'button.close, .modal-header .close, ' +
                '[aria-label="Close"], .close-btn'
            );

            if (closeBtn) {
                console.log('[FHIR] Close button found, clicking...');
                closeBtn.click();
            }
        }

        // Also close the Apps modal
        setTimeout(function() {
            closeAppsModal();
        }, 100);
    }

    function closeAppsModal() {
        // Try the eCW specific close button first
        const ecwCloseBtn = document.querySelector('i[ng-click="closeFHIRResultListpopup()"]');
        if (ecwCloseBtn) {
            console.log('[FHIR] Closing Apps modal via eCW close button');
            ecwCloseBtn.click();
            return;
        }

        // Fallback: Try to close the FHIR apps selection modal using close button only
        const appsModals = document.querySelectorAll('.modal.in, .modal.show, .modal[style*="display: block"]');
        appsModals.forEach(function(modal) {
            const closeBtn = modal.querySelector(
                'i.icon-close-white, i[title="Close"], ' +
                '.close, .btn-close, [data-dismiss="modal"], ' +
                'button.close, .modal-header .close, ' +
                '[aria-label="Close"]'
            );
            if (closeBtn) {
                console.log('[FHIR] Closing Apps modal via close button');
                closeBtn.click();
            }
        });
    }

    function getEncounterDate() {
        const encSpan = document.querySelector('span[ng-bind="currentEnc.val"]');
        if (encSpan) {
            const text = encSpan.textContent.trim();
            // Extract date from beginning (format: MM/DD/YYYY)
            const dateMatch = text.match(/^(\d{1,2}\/\d{1,2}\/\d{4})/);
            if (dateMatch) {
                console.log('[FHIR] Encounter date found:', dateMatch[1]);
                return dateMatch[1];
            }
        }
        console.log('[FHIR] Encounter date not found');
        return null;
    }

    function appendEncounterDate(url) {
        const encounterDate = getEncounterDate();
        if (encounterDate) {
            const separator = url.includes('?') ? '&' : '?';
            return url + separator + 'encounter_date=' + encodeURIComponent(encounterDate);
        }
        return url;
    }

    function sendToBackground(url) {
        console.log('[FHIR] Sending URL to background...');

        // Append encounter date to URL
        const urlWithDate = appendEncounterDate(url);
        console.log('[FHIR] URL with encounter date:', urlWithDate);

        chrome.runtime.sendMessage({
            action: 'FHIR_LOAD_URL',
            url: urlWithDate
        }, function(response) {
            console.log('[FHIR] Background response:', response);
        });

        chrome.storage.local.set({
            'infera_fhir_launch_url': urlWithDate,
            'infera_fhir_launch_timestamp': Date.now()
        });
    }

    // Listen for blade URL from background
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if (request.action === 'FHIR_BLADE_READY') {
            console.log('[FHIR] Blade URL ready:', request.bladeUrl);
            showBladeNotification(request.bladeUrl);
        }
    });

    function showBladeNotification(bladeUrl) {
        const existingBar = document.getElementById('infera-blade-bar');
        if (existingBar) existingBar.remove();

        const bar = document.createElement('div');
        bar.id = 'infera-blade-bar';
        bar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 12px 20px;
            z-index: 999999;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            font-family: Arial, sans-serif;
        `;

        bar.innerHTML = `
            <span style="font-weight: bold;">✓ Infera Results Ready</span>
            <div>
                <button id="infera-view-btn" style="
                    background: white;
                    color: #667eea;
                    border: none;
                    padding: 8px 20px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: bold;
                    margin-right: 10px;
                ">View Results</button>
                <button id="infera-close-btn" style="
                    background: transparent;
                    color: white;
                    border: 1px solid white;
                    padding: 8px 15px;
                    border-radius: 4px;
                    cursor: pointer;
                ">×</button>
            </div>
        `;

        document.body.appendChild(bar);

        document.getElementById('infera-view-btn').onclick = function() {
            window.open(bladeUrl, '_blank');
        };

        document.getElementById('infera-close-btn').onclick = function() {
            bar.remove();
        };
    }

    // Initialize
    startPolling();

    console.log('[FHIR] Ready - Polling mode enabled');
})();
