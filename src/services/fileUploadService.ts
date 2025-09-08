import { supabase } from '../lib/supabase';

export const fileUploadService = {
  // Upload resume file to Supabase storage
  async uploadResume(file: File): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `resume-${Date.now()}.${fileExt}`;
    const filePath = `resumes/${fileName}`;

    const { data, error } = await supabase.storage
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
      const filePath = pathParts.slice(-2).join('/'); // Get 'resumes/filename.pdf'

      const { error } = await supabase.storage
        .from('uploads')
        .remove([filePath]);

      if (error) {
        console.warn('Failed to delete old resume:', error.message);
      }
    } catch (error) {
      console.warn('Failed to parse resume URL for deletion:', error);
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