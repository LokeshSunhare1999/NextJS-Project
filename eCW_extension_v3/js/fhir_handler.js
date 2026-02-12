/**
 * FHIR Authentication Handler
 * Handles FHIR authentication data and makes API calls
 * Use this in your caregap.js or other extension code
 */

const FHIRHandler = {

    // Store auth data
    authData: null,

    /**
     * Initialize the handler
     */
    init: function() {
        console.log('[FHIR Handler] Initializing...');

        // Listen for FHIR auth completion events
        window.addEventListener('Infera:FHIR:AuthComplete', (event) => {
            console.log('[FHIR Handler] Auth complete event received');
            this.handleAuthComplete(event.detail);
        });

        // Check if there's existing auth data in storage
        this.checkExistingAuth();
    },

    /**
     * Check for existing auth data in chrome.storage
     */
    checkExistingAuth: function() {
        chrome.storage.local.get(['infera_fhir_auth', 'infera_fhir_auth_timestamp'], (result) => {
            if (result.infera_fhir_auth) {
                const timestamp = result.infera_fhir_auth_timestamp || 0;
                const age = Date.now() - timestamp;
                const maxAge = 60 * 60 * 1000; // 1 hour

                if (age < maxAge) {
                    console.log('[FHIR Handler] Found valid existing auth data');
                    this.authData = result.infera_fhir_auth;
                } else {
                    console.log('[FHIR Handler] Existing auth data is too old, clearing');
                    this.clearAuth();
                }
            }
        });
    },

    /**
     * Handle authentication completion
     */
    handleAuthComplete: function(authData) {
        console.log('[FHIR Handler] Processing auth data...');

        if (authData.status === 'error') {
            console.error('[FHIR Handler] Auth error:', authData.error);
            this.handleAuthError(authData);
            return;
        }

        // Store auth data
        this.authData = authData;

        console.log('[FHIR Handler] Auth successful');
        console.log('[FHIR Handler] Patient ID:', authData.patientId);
        console.log('[FHIR Handler] FHIR Server:', authData.fhirServer);

        // Now you can trigger your extension functionality
        this.triggerExtensionWorkflow();
    },

    /**
     * Handle authentication error
     */
    handleAuthError: function(errorData) {
        console.error('[FHIR Handler] Authentication failed:', errorData.error);

        // Show error to user
        alert('FHIR Authentication failed: ' + (errorData.error || 'Unknown error'));

        // Clear any existing auth
        this.clearAuth();
    },

    /**
     * Trigger your extension workflow with FHIR data
     */
    triggerExtensionWorkflow: function() {
        console.log('[FHIR Handler] Triggering extension workflow...');

        // Example: Fetch patient data from FHIR server
        this.fetchPatientData()
            .then((patientData) => {
                console.log('[FHIR Handler] Patient data fetched:', patientData);

                // Now trigger your existing extension functionality
                // For example, if you use caregap.loadInferaApp:
                if (typeof caregap !== 'undefined' && caregap.loadInferaApp) {
                    // Store the FHIR patient data for caregap to use
                    window.inferaFHIRPatientData = patientData;
                    caregap.loadInferaApp();
                }
            })
            .catch((error) => {
                console.error('[FHIR Handler] Error fetching patient data:', error);
            });
    },

    /**
     * Fetch patient data from FHIR server
     */
    fetchPatientData: async function() {
        if (!this.authData || !this.authData.accessToken) {
            throw new Error('No access token available');
        }

        const patientId = this.authData.patientId;
        const fhirServer = this.authData.fhirServer;

        console.log('[FHIR Handler] Fetching patient data for:', patientId);

        try {
            const response = await fetch(`${fhirServer}/Patient/${patientId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `${this.authData.tokenType} ${this.authData.accessToken}`,
                    'Accept': 'application/fhir+json'
                }
            });

            if (!response.ok) {
                throw new Error(`FHIR API error: ${response.status} ${response.statusText}`);
            }

            const patientData = await response.json();
            return patientData;

        } catch (error) {
            console.error('[FHIR Handler] Error fetching patient:', error);
            throw error;
        }
    },

    /**
     * Generic FHIR API request
     */
    fhirRequest: async function(resourcePath, options = {}) {
        if (!this.authData || !this.authData.accessToken) {
            throw new Error('No access token available');
        }

        const fhirServer = this.authData.fhirServer;
        const url = `${fhirServer}/${resourcePath}`;

        const defaultOptions = {
            method: options.method || 'GET',
            headers: {
                'Authorization': `${this.authData.tokenType} ${this.authData.accessToken}`,
                'Accept': 'application/fhir+json',
                'Content-Type': 'application/fhir+json',
                ...options.headers
            }
        };

        if (options.body) {
            defaultOptions.body = JSON.stringify(options.body);
        }

        console.log('[FHIR Handler] Making FHIR request:', url);

        try {
            const response = await fetch(url, defaultOptions);

            if (!response.ok) {
                throw new Error(`FHIR API error: ${response.status} ${response.statusText}`);
            }

            return await response.json();

        } catch (error) {
            console.error('[FHIR Handler] FHIR request error:', error);
            throw error;
        }
    },

    /**
     * Search for resources
     */
    searchResources: async function(resourceType, searchParams = {}) {
        const queryString = new URLSearchParams(searchParams).toString();
        const resourcePath = queryString ? `${resourceType}?${queryString}` : resourceType;

        return await this.fhirRequest(resourcePath);
    },

    /**
     * Get patient conditions
     */
    getPatientConditions: async function() {
        if (!this.authData || !this.authData.patientId) {
            throw new Error('No patient ID available');
        }

        return await this.searchResources('Condition', {
            'patient': this.authData.patientId,
            '_sort': '-date'
        });
    },

    /**
     * Get patient observations
     */
    getPatientObservations: async function(category = null) {
        if (!this.authData || !this.authData.patientId) {
            throw new Error('No patient ID available');
        }

        const params = {
            'patient': this.authData.patientId,
            '_sort': '-date'
        };

        if (category) {
            params['category'] = category;
        }

        return await this.searchResources('Observation', params);
    },

    /**
     * Get patient medications
     */
    getPatientMedications: async function() {
        if (!this.authData || !this.authData.patientId) {
            throw new Error('No patient ID available');
        }

        return await this.searchResources('MedicationRequest', {
            'patient': this.authData.patientId,
            '_sort': '-authoredon'
        });
    },

    /**
     * Clear authentication data
     */
    clearAuth: function() {
        this.authData = null;
        chrome.storage.local.remove(['infera_fhir_auth', 'infera_fhir_auth_timestamp'], () => {
            console.log('[FHIR Handler] Auth data cleared');
        });
    },

    /**
     * Check if authenticated
     */
    isAuthenticated: function() {
        return this.authData && this.authData.accessToken;
    },

    /**
     * Get current access token
     */
    getAccessToken: function() {
        return this.authData ? this.authData.accessToken : null;
    },

    /**
     * Get patient ID
     */
    getPatientId: function() {
        return this.authData ? this.authData.patientId : null;
    },

    /**
     * Get FHIR server URL
     */
    getFHIRServer: function() {
        return this.authData ? this.authData.fhirServer : null;
    }
};

// Initialize when script loads
FHIRHandler.init();
