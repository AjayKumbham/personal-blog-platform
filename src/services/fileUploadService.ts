import { supabase } from '../lib/supabase';

export const fileUploadService = {
  // Upload resume file to Supabase storage
  async uploadResume(file: File): Promise<string> {
    const fileExt = file.name.split('.').pop();
    // Use crypto.randomUUID() for better security instead of timestamp
    const fileName = `resume-${crypto.randomUUID()}.${fileExt}`;
    const filePath = `resumes/${fileName}`;

    const { error } = await supabase.storage
      .from('uploads')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      throw new Error(`Failed to upload resume: ${error.message}`);
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('uploads')
      .getPublicUrl(filePath);
    return publicUrl;
  },

  // Delete old resume file
  async deleteResume(resumeUrl: string): Promise<void> {
    if (!resumeUrl) return;

    try {
      // Extract file path from URL
      const url = new URL(resumeUrl);
      const pathParts = url.pathname.split('/');
      
      // Find the index of 'uploads' in the path to get the correct file path
      const uploadsIndex = pathParts.findIndex(part => part === 'uploads');
      if (uploadsIndex === -1) {
        throw new Error('Invalid resume URL format');
      }
      
      // Get everything after 'uploads' bucket name
      const filePath = pathParts.slice(uploadsIndex + 1).join('/');
      
      if (!filePath) {
        throw new Error('Could not extract file path from URL');
      }

      console.log('Attempting to delete resume file:', filePath);

      const { error } = await supabase.storage
        .from('uploads')
        .remove([filePath]);

      if (error) {
        console.error('Failed to delete old resume:', error.message);
        throw new Error(`Failed to delete resume: ${error.message}`);
      }
      
      console.log('Successfully deleted resume file:', filePath);
    } catch (error) {
      console.error('Failed to delete resume:', error);
      throw error;
    }
  },

  // Validate file type and size
  validateResumeFile(file: File): { isValid: boolean; error?: string } {
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: 'Please upload a PDF or Word document (.pdf, .doc, .docx)'
      };
    }

    if (file.size > maxSize) {
      return {
        isValid: false,
        error: 'File size must be less than 5MB'
      };
    }

    return { isValid: true };
  }
};