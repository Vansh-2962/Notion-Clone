export function getUploadErrorMessage(error: Error) {
  if (error.message.includes("FileSizeMismatch")) {
    return "The selected image is too large. Please select an image under 4MB."
  }

  if (error.message.includes("FileTypeMismatch")) {
    return "Please upload a supported image format."
  }

  if (error.message.includes("TooManyFiles")) {
    return "You can only upload one image at a time."
  }

  if (error.message.includes("Unauthorized")) {
    return "You must be signed in to upload files."
  }

  return "Upload failed. Please try again."
}
