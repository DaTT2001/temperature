import { createClient } from '@supabase/supabase-js';
// Khởi tạo Supabase Client
const supabaseUrl = "https://aliuuqjtebclmkvjuvuv.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFsaXV1cWp0ZWJjbG1rdmp1dnV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE1ODc0MzEsImV4cCI6MjA1NzE2MzQzMX0.plInkKJO8d8u-NQgzkyXxvU9FcnESWe6Cuk0Ec8PUcI";
export const supabase = createClient(supabaseUrl, supabaseKey);