export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  if (imagePath.startsWith('http')) return imagePath;
  if (imagePath.startsWith('/uploads')) {
    return `${import.meta.env.VITE_API_URL}${imagePath}`;
  }
  return imagePath;
};
