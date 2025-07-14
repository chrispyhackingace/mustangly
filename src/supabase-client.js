import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
    "https://fmarufeqgyysutkexdor.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZtYXJ1ZmVxZ3l5c3V0a2V4ZG9yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5MDM4MzMsImV4cCI6MjA2NzQ3OTgzM30.O9sb2_DPnjddtpHUuyKNQEJx8uYBqmLQ23IXowQUmcU"
);