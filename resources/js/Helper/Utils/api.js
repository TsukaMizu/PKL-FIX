const API_BASE_URL = 'https://api.example.com';

/**
 * Make a GET request to the specified endpoint.
 * @param {string} endpoint - The API endpoint.
 * @param {object} [params={}] - The query parameters.
 * @returns {Promise<object>} - The response data.
 */
export async function get(endpoint, params = {}) {
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
    });

    return response.json();
}

/**
 * Make a POST request to the specified endpoint.
 * @param {string} endpoint - The API endpoint.
 * @param {object} body - The request body.
 * @returns {Promise<object>} - The response data.
 */
export async function post(endpoint, body) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(body)
    });

    return response.json();
}

/**
 * Make a PUT request to the specified endpoint.
 * @param {string} endpoint - The API endpoint.
 * @param {object} body - The request body.
 * @returns {Promise<object>} - The response data.
 */
export async function put(endpoint, body) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(body)
    });

    return response.json();
}

/**
 * Make a DELETE request to the specified endpoint.
 * @param {string} endpoint - The API endpoint.
 * @returns {Promise<object>} - The response data.
 */
export async function del(endpoint) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
    });

    return response.json();
}