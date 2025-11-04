import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../firebase';

// Validate resume file
export const validateResumeFile = (file) => {
  if (!file) {
    return { valid: false, error: 'No file selected' };
  }

  // Check file type
  if (file.type !== 'application/pdf') {
    return { valid: false, error: 'Please upload a PDF file' };
  }

  // Check file size (max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  if (file.size > maxSize) {
    return { valid: false, error: 'Resume must be less than 5MB' };
  }

  return { valid: true, error: null };
};

// Upload resume to Firebase Storage
export const uploadResume = (file, userId, onProgress) => {
  return new Promise((resolve, reject) => {
    // Validate file first
    const validation = validateResumeFile(file);
    if (!validation.valid) {
      reject(new Error(validation.error));
      return;
    }

    // Create storage reference with timestamp to avoid conflicts
    const timestamp = Date.now();
    const filename = `${timestamp}_${file.name}`;
    const storageRef = ref(storage, `resumes/${userId}/${filename}`);

    // Create upload task
    const uploadTask = uploadBytesResumable(storageRef, file);

    // Monitor upload progress
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) {
          onProgress(progress);
        }
      },
      (error) => {
        console.error('Upload error:', error);
        reject(error);
      },
      async () => {
        try {
          // Get download URL after successful upload
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve({
            url: downloadURL,
            filename: file.name
          });
        } catch (error) {
          reject(error);
        }
      }
    );
  });
};

// Delete resume from Firebase Storage
export const deleteResume = async (resumeUrl) => {
  try {
    if (!resumeUrl) return false;

    // Extract storage path from URL
    const storageRef = ref(storage, resumeUrl);
    await deleteObject(storageRef);
    return true;
  } catch (error) {
    console.error('Delete error:', error);
    return false;
  }
};