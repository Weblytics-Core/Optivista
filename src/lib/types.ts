
export type SiteImage = {
  id: string;
  name: string;
  description: string;
  url: string;
  category: 'nature' | 'architecture' | 'portrait' | 'abstract';
  aiHint: string;
};

export interface UserProfileData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  photoURL?: string;
  role: 'admin' | 'user';
  isAdmin: boolean;
  isVerified: boolean;
}

export interface ImageDownload {
    id: string;
    userId: string;
    userEmail: string;
    userName: string;
    imageId: string;
    imageName:string;
    imageUrl: string;
    downloadDate: any;
}
