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

export async function getSessao() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
}