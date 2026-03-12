/**
 * FHIR Debug Helper
 * Run this in the browser console to inspect eCW's FHIR app configuration
 *
 * Usage:
 * 1. Open eCW in browser
 * 2. Click the "Apps" button
 * 3. Open browser console (F12)
 * 4. Type: FHIRDebugHelper.inspectAppsModal()
 */

const FHIRDebugHelper = {

    /**
     * Inspect the Apps modal to find your app's configuration
     */
    inspectAppsModal: function() {
        console.log('=== FHIR Apps Modal Inspector ===');

        // Find the app element
        const appElement = document.querySelector('div.image-block[emrid="qikkOYWW+Dg="]');

        if (!appElement) {
            console.error('❌ App element not found! Make sure the Apps modal is open.');
            console.log('💡 Try clicking the "Apps" button first');
            return;
        }

        console.log('✅ App element found:', appElement);
        console.log('');

        // Inspect all attributes
        console.log('📋 Element Attributes:');
        Array.from(appElement.attributes).forEach(attr => {
            console.log(`  ${attr.name} = "${attr.value}"`);
        });
        console.log('');

        // Look for parent elements that might contain URL
        console.log('🔍 Searching for Launch URL in parent elements...');
        let currentElement = appElement;
        let depth = 0;

        while (currentElement && depth < 5) {
            console.log(`  Level ${depth}:`, currentElement.tagName, currentElement.className);

            // Check for data attributes
            Array.from(currentElement.attributes).forEach(attr => {
                if (attr.name.includes('url') || attr.name.includes('launch') || attr.name.includes('href')) {
                    console.log(`    ⭐ Found potential URL: ${attr.name} = "${attr.value}"`);
                }
            });

            // Check for links or iframes
            const links = currentElement.querySelectorAll('a[href]');
            links.forEach(link => {
                if (link.href.includes('inferscience') || link.href.includes('fhir') || link.href.includes('launch')) {
                    console.log(`    ⭐ Found link: ${link.href}`);
                }
            });

            const iframes = currentElement.querySelectorAll('iframe[src]');
            iframes.forEach(iframe => {
                console.log(`    ⭐ Found iframe: ${iframe.src}`);
            });

            currentElement = currentElement.parentElement;
            depth++;
        }
        console.log('');

        // Check Angular scope if available
        this.inspectAngularScope(appElement);

        // Look for modal or dialog container
        this.inspectModalContainer();

        // Search for FHIR-related JavaScript variables
        this.inspectFHIRVariables();

        console.log('=== End of Inspection ===');
        console.log('');
        console.log('💡 Tips:');
        console.log('  - Look for attributes containing "url", "launch", or "href"');
        console.log('  - Check the Angular scope if eCW uses Angular');
        console.log('  - Monitor network requests when clicking your app');
        console.log('  - Use: FHIRDebugHelper.monitorNetworkRequests()');
    },

    /**
     * Inspect Angular scope if available
     */
    inspectAngularScope: function(element) {
        console.log('🅰️  Checking Angular Scope...');

        if (typeof angular === 'undefined') {
            console.log('  ⚠️  Angular not detected');
            return;
        }

        try {
            const angularElement = angular.element(element);
            const scope = angularElement.scope();

            if (scope) {
                console.log('  ✅ Angular scope found');

                // Look for vendor data
                if (scope.vendor) {
                    console.log('  📦 Vendor data:', scope.vendor);

                    if (scope.vendor.launchUrl) {
                        console.log('  ⭐⭐⭐ LAUNCH URL FOUND:', scope.vendor.launchUrl);
                    }
                }

                // Look for other relevant properties
                const relevantKeys = ['app', 'fhir', 'launch', 'url', 'vendor', 'config'];
                relevantKeys.forEach(key => {
                    if (scope[key]) {
                        console.log(`  Found scope.${key}:`, scope[key]);
                    }
                });

                // Print all scope keys
                console.log('  All scope keys:', Object.keys(scope).filter(k => !k.startsWith('$')));
            } else {
                console.log('  ⚠️  No scope found on element');
            }
        } catch (e) {
            console.log('  ❌ Error inspecting Angular scope:', e.message);
        }
        console.log('');
    },

    /**
     * Inspect modal container
     */
    inspectModalContainer: function() {
        console.log('🪟 Checking Modal Container...');

        const modalSelectors = [
            '.modal',
            '[role="dialog"]',
            '.modal-dialog',
            '.fhir-apps-modal',
            '#fhirAppsModal'
        ];

        modalSelectors.forEach(selector => {
            const modal = document.querySelector(selector);
            if (modal) {
                console.log(`  ✅ Found modal with selector: ${selector}`);

                // Look for iframes in the modal
                const iframes = modal.querySelectorAll('iframe');
                iframes.forEach((iframe, index) => {
                    console.log(`    Iframe ${index + 1}:`, iframe.src || 'no src');
                });

                // Look for links
                const links = modal.querySelectorAll('a[href*="launch"], a[href*="fhir"]');
                links.forEach((link, index) => {
                    console.log(`    Link ${index + 1}:`, link.href);
                });
            }
        });
        console.log('');
    },

    /**
     * Search for FHIR-related JavaScript variables
     */
    inspectFHIRVariables: function() {
        console.log('🔍 Searching for FHIR Variables in window...');

        const searchTerms = ['fhir', 'launch', 'vendor', 'app', 'smart'];

        searchTerms.forEach(term => {
            const matches = Object.keys(window).filter(key =>
                key.toLowerCase().includes(term.toLowerCase())
            );

            if (matches.length > 0) {
                console.log(`  Variables matching "${term}":`, matches);
                matches.forEach(key => {
                    const value = window[key];
                    if (typeof value === 'object' && value !== null && !value.nodeType) {
                        console.log(`    ${key}:`, value);
                    }
                });
            }
        });
        console.log('');
    },

    /**
     * Monitor network requests to find the launch URL
     */
    monitorNetworkRequests: function() {
        console.log('🌐 Network Request Monitor Started');
        console.log('Now click your FHIR app and watch for requests...');
        console.log('');

        // Intercept fetch
        const originalFetch = window.fetch;
        window.fetch = function(...args) {
            const url = args[0];
            if (typeof url === 'string' && (url.includes('fhir') || url.includes('launch') || url.includes('inferscience'))) {
                console.log('🌐 FETCH:', url);
            }
            return originalFetch.apply(this, args);
        };

        // Intercept XMLHttpRequest
        const originalOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(method, url, ...args) {
            if (url.includes('fhir') || url.includes('launch') || url.includes('inferscience')) {
                console.log('🌐 XHR:', method, url);
            }
            return originalOpen.apply(this, [method, url, ...args]);
        };

        console.log('✅ Network monitor active');
        console.log('💡 To stop monitoring, reload the page');
    },

    /**
     * Monitor for iframe creation
     */
    monitorIframeCreation: function() {
        console.log('📺 Iframe Creation Monitor Started');
        console.log('Now click your FHIR app and watch for iframe creation...');
        console.log('');

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.tagName === 'IFRAME') {
                        console.log('📺 IFRAME CREATED:');
                        console.log('  src:', node.src);
                        console.log('  id:', node.id);
                        console.log('  class:', node.className);
                        console.log('  element:', node);

                        if (node.src && (node.src.includes('fhir') || node.src.includes('launch') || node.src.includes('inferscience'))) {
                            console.log('  ⭐⭐⭐ THIS MIGHT BE YOUR FHIR APP IFRAME!');
                        }
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        console.log('✅ Iframe monitor active');
        console.log('💡 To stop monitoring: FHIRDebugHelper.stopMonitoring()');

        this.iframeObserver = observer;
    },

    /**
     * Stop monitoring
     */
    stopMonitoring: function() {
        if (this.iframeObserver) {
            this.iframeObserver.disconnect();
            console.log('✅ Iframe monitoring stopped');
        }
    },

    /**
     * Click the Apps button programmatically
     */
    clickAppsButton: function() {
        const appsButton = document.querySelector('button.btnpnbottompanel[ng-click="launchFHIRapppopu()"]');

        if (appsButton) {
            console.log('✅ Apps button found, clicking...');
            appsButton.click();

            setTimeout(() => {
                this.inspectAppsModal();
            }, 1000);
        } else {
            console.error('❌ Apps button not found');
            console.log('💡 Make sure you are on the Progress Notes page');
        }
    },

    /**
     * Test click interception
     */
    testClickInterception: function() {
        console.log('🎯 Testing Click Interception...');

        const appElement = document.querySelector('div.image-block[emrid="qikkOYWW+Dg="]');

        if (!appElement) {
            console.error('❌ App element not found! Open the Apps modal first.');
            return;
        }

        // Add test click listener
        document.body.addEventListener('click', function testListener(e) {
            const target = e.target.closest('div.image-block[emrid="qikkOYWW+Dg="]');
            if (target) {
                console.log('🎯 CLICK DETECTED on Infera app!');
                console.log('  Target:', target);
                console.log('  Event phase:', e.eventPhase);
                console.log('  Default prevented:', e.defaultPrevented);

                // Remove test listener after first click
                document.body.removeEventListener('click', testListener, true);
            }
        }, true); // Use capture phase

        console.log('✅ Test listener added');
        console.log('💡 Now click your app in the modal');
    },

    /**
     * Get all event listeners on an element (Chrome only)
     */
    getEventListeners: function(element) {
        if (!element) {
            element = document.querySelector('div.image-block[emrid="qikkOYWW+Dg="]');
        }

        if (!element) {
            console.error('❌ Element not found');
            return;
        }

        // This only works in Chrome DevTools console
        if (typeof getEventListeners !== 'undefined') {
            const listeners = getEventListeners(element);
            console.log('Event listeners on element:', listeners);
            return listeners;
        } else {
            console.log('⚠️  getEventListeners() is only available in Chrome DevTools console');
            console.log('Please copy this code and run it in the DevTools console');
        }
    },

    /**
     * Run all diagnostic tests
     */
    runAllTests: function() {
        console.log('🚀 Running All Diagnostic Tests...');
        console.log('');

        this.clickAppsButton();

        setTimeout(() => {
            this.monitorNetworkRequests();
            this.monitorIframeCreation();
        }, 2000);

        console.log('');
        console.log('✅ Diagnostics running');
        console.log('💡 Click your app now to see what happens');
    }
};

// Make available globally
window.FHIRDebugHelper = FHIRDebugHelper;

console.log('');
console.log('🔧 FHIR Debug Helper Loaded');
console.log('');
console.log('Available commands:');
console.log('  FHIRDebugHelper.inspectAppsModal()      - Inspect the Apps modal');
console.log('  FHIRDebugHelper.clickAppsButton()       - Click Apps button and inspect');
console.log('  FHIRDebugHelper.monitorNetworkRequests() - Monitor network requests');
console.log('  FHIRDebugHelper.monitorIframeCreation() - Monitor iframe creation');
console.log('  FHIRDebugHelper.testClickInterception() - Test click detection');
console.log('  FHIRDebugHelper.runAllTests()           - Run all diagnostic tests');
console.log('');
console.log('💡 Tip: Open the Apps modal first, then run FHIRDebugHelper.inspectAppsModal()');
console.log('');
