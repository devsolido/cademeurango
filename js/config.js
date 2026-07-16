import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const supabaseUrl = 'https://uajzghyivcjqyqbhbqnb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhanpnaHlpdmNqcXlxYmhicW5iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQyMjQ2NDUsImV4cCI6MjA5OTgwMDY0NX0.lvDXKIeXg1KZxyRGFfNmAE_ZEL0QtPJF0l52XcuntUU';

export const supabase = createClient(supabaseUrl, supabaseKey);