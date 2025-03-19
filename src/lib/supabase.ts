
import { createClient } from '@supabase/supabase-js';

// Get Supabase URL and anon key from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/*
Row Level Security Setup Instructions:

To fix the "new row violates row-level security policy" error:

1. Go to your Supabase dashboard -> Authentication -> Policies
2. For the "orders" table, create a new policy:
   - Policy name: "Enable inserts for authenticated users" 
   - Target roles: Leave blank to apply to all roles
   - Using expression: true
   - With check expression: true

This allows any user (including anonymous) to insert data into the orders table.
For a production app, you might want to set up more restrictive policies.

Storage Setup Instructions:

1. Go to your Supabase dashboard -> Storage
2. Create a new bucket called "payment-proofs"
3. Set the bucket access to "Public"
4. Add a policy for the bucket:
   - Policy name: "Allow public uploads"
   - Target roles: Leave blank to apply to all roles
   - Using expression: true
   - With check expression: true

This allows anyone to upload files to the bucket. In a production app,
you should restrict this further by creating more specific policies.
*/

// Helper function to upload payment proof to Supabase Storage
export const uploadPaymentProof = async (file: File, orderId: string): Promise<string | null> => {
  try {
    // Create a unique file name using order ID and timestamp
    const fileExt = file.name.split('.').pop();
    const fileName = `${orderId}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    // Upload the file to the payment-proofs bucket
    const { error, data } = await supabase.storage
      .from('payment-proofs')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Error uploading file:', error);
      return null;
    }

    // Get the public URL for the uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from('payment-proofs')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error in uploadPaymentProof:', error);
    return null;
  }
};
