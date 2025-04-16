import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://aliuuqjtebclmkvjuvuv.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFsaXV1cWp0ZWJjbG1rdmp1dnV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE1ODc0MzEsImV4cCI6MjA1NzE2MzQzMX0.plInkKJO8d8u-NQgzkyXxvU9FcnESWe6Cuk0Ec8PUcI";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Helper function để format dữ liệu
export const formatTemperatureData = (record) => ({
  timestamp: new Date(record.timestamp).toLocaleTimeString(),
  sensors: [
    record.sensor1_temperature,
    record.sensor2_temperature,
    record.sensor3_temperature,
    record.sensor4_temperature,
    record.sensor5_temperature,
    record.sensor6_temperature,
    record.sensor7_temperature,
    record.sensor8_temperature,
  ],
});
