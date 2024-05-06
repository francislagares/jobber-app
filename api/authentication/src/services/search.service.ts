import { getDocumentById } from '@authentication/elastic';

export const gigById = async (index: string, gigId: string) => {
  const gig = await getDocumentById(index, gigId);

  return gig;
};
