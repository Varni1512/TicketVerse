import { User } from '../types';

export const mockUsers: User[] = [
  {
    id: 'u1',
    name: 'VarniKumar Patel',
    email: 'varni12@gmail.com',
    avatarUrl: 'https://i.pravatar.cc/150?u=u1'
  }
];

export const getCurrentUser = (): User => mockUsers[0];
