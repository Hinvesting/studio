/**
 * Represents a Pixabay image.
 */
export interface PixabayImage {
  /**
   * The unique identifier for the image.
   */
  id: string;
  /**
   * The URL of the image.
   */
  url: string;
  /**
   * The user who uploaded the image.
   */
  user: string;
}

/**
 * Asynchronously retrieves images from Pixabay based on a query.
 *
 * @param query The search query.
 * @returns A promise that resolves to an array of PixabayImage objects.
 */
export async function getPixabayImages(query: string): Promise<PixabayImage[]> {
  // TODO: Implement this by calling the Pixabay API.
  // Using Picsum for placeholder images based on the query for variety
  console.log(`Mock Pixabay search for: ${query}`); // Log the query for debugging

  // Generate some pseudo-random IDs based on the query to make placeholders somewhat unique
  const baseId = query.length * 2000; // Different base from Pexels

  return [
    {
      id: `pixabay-${baseId + 1}`,
      url: `https://picsum.photos/seed/pixabay-${baseId + 1}-${query}/400/300`,
      user: 'Alice Brown',
    },
    {
      id: `pixabay-${baseId + 2}`,
      url: `https://picsum.photos/seed/pixabay-${baseId + 2}-${query}/400/300`,
      user: 'Bob Williams',
    },
     {
      id: `pixabay-${baseId + 3}`,
      url: `https://picsum.photos/seed/pixabay-${baseId + 3}-${query}/400/300`,
      user: 'Charlie Davis',
    },
  ];
}
