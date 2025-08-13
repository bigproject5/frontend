const Base_URL = 'http://localhost:8080';

export async function admin_login_api(postData) {
    const response = await fetch(`${Base_URL}/api/operation/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
    })
    return response.json();
}

export async function worker_login_api(postData) {
    const response = await fetch(`${Base_URL}/api/operation/workers/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
    })
    return response.json();
}

export async function Signup_api(postData, reCaptchaToken) {
    const response = await fetch(`${Base_URL}/api/operation/admin/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            ...postData,
            reCaptchaToken: reCaptchaToken
        }),
    })
    return response.json();
}

export async function getUserInfo(accessToken) {
    const response = await fetch(`${Base_URL}/api/operation/workers/profile`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${accessToken}` }
    })
    return await response.json();
}

export async function fetchCurrentUser(accessToken) {
    const response = await fetch(`${Base_URL}/api/operation/me`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${accessToken}` }
    })
    return await response.json();
}