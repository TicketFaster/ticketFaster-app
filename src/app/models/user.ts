export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: 'admin' | 'user';
    profilePicture?: string;
    createdAt: string;
    updatedAt: string;
    wishlist: number[];
}
