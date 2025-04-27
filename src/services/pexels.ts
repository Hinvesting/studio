/**
 * Represents a Pexels image.
 */
export interface PexelsImage {
  /**
   * The unique identifier for the image.
   */
  id: string;
  /**
   * The URL of the image.
   */
  url: string;
  /**
   * The photographer's name.
   */
  photographer: string;
}

/**
 * Asynchronously retrieves images from Pexels based on a query.
 * @param query The search query.
 * @returns A promise that resolves to an array of PexelsImage objects.
 */
export async function getPexelsImages(query: string): Promise<PexelsImage[]> {
  // TODO: Implement this by calling the Pexels API.
  // Using Picsum for placeholder images based on the query for variety
  console.log(`Mock Pexels search for: ${query}`); // Log the query for debugging

  // Generate some pseudo-random IDs based on the query to make placeholders somewhat unique
  const baseId = query.length * 1000;

  return [
    {
      id: `pexels-${baseId + 1}`,
      url: `https://picsum.photos/seed/pexels-${baseId + 1}-${query}/400/300`,
      photographer: 'John Doe',
    },
    {
      id: `pexels-${baseId + 2}`,
       url: `https://picsum.photos/seed/pexels-${baseId + 2}-${query}/400/300`,
      photographer: 'Jane Smith',
    },
     {
      id: `pexels-${baseId + 3}`,
      url: `https://picsum.photos/seed/pexels-${baseId + 3}-${query}/400/300`,
      photographer: 'Alex Johnson',
    },
  ];
}
