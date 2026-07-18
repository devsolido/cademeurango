import { supabase } from './config.js';

export async function login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    });
    if (error) throw error;
    return data;
}

export async function cadastrar(email, password, matricula) {
    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
            data: { matricula: matricula }
        }
    });
    if (error) throw error;
    return data;
}

export async function logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
}

export async function getSessao(options = {}) {
    const { retry = true, maxAttempts = 6, delayMs = 250 } = options;

    let lastError = null;

    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
        try {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (error) throw error;
            if (session) return session;
        } catch (error) {
            lastError = error;
        }

        if (!retry || attempt === maxAttempts - 1) {
            break;
        }

        await new Promise(resolve => setTimeout(resolve, delayMs));
    }

    if (lastError) throw lastError;
    return null;
}

export function subscribeAuth(callback) {
    return supabase.auth.onAuthStateChange((event, session) => {
        callback({ event, session });
    });
}