const Base_URL = 'http://localhost:8080';

export async function adminLoginApi(postData) {
    const response = await fetch(`${Base_URL}/api/operation/login/admin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
    })
    return response.json();
}

export async function workerLoginApi(postData) {
    const response = await fetch(`${Base_URL}/api/operation/login/workers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
    })
    return response.json();
}

export async function signupApi(postData, reCaptchaToken) {
    const response = await fetch(`${Base_URL}/api/operation/signup/admin`, {
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

export async function devLoginApi() {
    const response = await fetch(`${Base_URL}/api/operation/login/dev`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    })
    return response.json();
}

export async function checkAdminLoginId(loginId) {
    const response = await fetch(`${Base_URL}/api/operation/admin/check-id`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            loginId: loginId
        }),

    })
    return response.json();
}

export async function editWorkerProfile(accessToken, data) {
    const response = await fetch(`${Base_URL}/api/operation/workers/edit`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}` },
        body: JSON.stringify(data)
    })
    return await response.json();
}

export async function getWorkerProfileByAdmin(accessToken, workerId) {
    // workerId가 유효하지 않은 경우 early return
    if (!workerId || workerId === 'undefined' || workerId === 'null') {
        console.warn('유효하지 않은 workerId로 API 호출 시도:', workerId);
        return null; // 또는 기본값 반환
    }

    try {
        const response = await fetch(`${Base_URL}/api/operation/workers/${workerId}`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('getWorkerProfileByAdmin 오류:', error);
        throw error;
    }
}

