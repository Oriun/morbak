export interface User {
  id: string;
  avatar: string | null
  name: string;
  currentRoom: string | null;
  socketId: string;
  createdAt: number;
}

export interface CreateUser {
  name: string;
  socketId: string;
}

export interface UpdateUser {
  name?: string;
  avatar?: string | null
  currentRoom?: string | null;
  socketId?: string;
}
