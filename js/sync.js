function normalizeSnapshot(snapshot = {}) {
    return {
        auxilios: Array.isArray(snapshot.auxilios) ? snapshot.auxilios : [],
        meses: Array.isArray(snapshot.meses) ? snapshot.meses : [],
        gastos: Array.isArray(snapshot.gastos) ? snapshot.gastos : [],
        auxilio: snapshot.auxilio || null,
        updatedAt: snapshot.updatedAt || new Date().toISOString(),
        userId: snapshot.userId || null
    };
}

function sanitizeDetails(details = {}) {
    const safeDetails = { ...details };
    if (safeDetails.userId) {
        safeDetails.userId = String(safeDetails.userId).slice(0, 6) + '...';
    }
    if (safeDetails.token) {
        delete safeDetails.token;
    }
    return safeDetails;
}

export function logSistema(eventName, details = {}) {
    const safeDetails = sanitizeDetails(details);
    console.groupCollapsed(`%c[Cadê Meu Rango] ${eventName}`, 'color:#22C55E;font-weight:700');
    console.info(safeDetails);
    console.groupEnd();
}

export function getSnapshotKey(userId = 'anonymous') {
    return `cademeurango:snapshot:${String(userId || 'anonymous')}`;
}

export function saveSnapshot(userId, state = {}) {
    if (!userId) return null;
    const snapshot = normalizeSnapshot({ ...state, userId, updatedAt: new Date().toISOString() });
    localStorage.setItem(getSnapshotKey(userId), JSON.stringify(snapshot));
    return snapshot;
}

export function loadSnapshot(userId) {
    if (!userId) return null;
    try {
        const raw = localStorage.getItem(getSnapshotKey(userId));
        if (!raw) return null;
        return normalizeSnapshot(JSON.parse(raw));
    } catch (error) {
        console.warn('[cademeurango] Falha ao ler snapshot local:', error);
        return null;
    }
}

export function clearSnapshot(userId) {
    if (!userId) return;
    localStorage.removeItem(getSnapshotKey(userId));
}
