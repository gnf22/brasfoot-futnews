// src/components/UserList.tsx
import React from 'react';

interface UserListProps {
  users: { id: string; name: string }[];
}

const UserList: React.FC<UserListProps> = ({ users }) => {
  return (
    <ul>
      {users.map(user => (
        <div key={user.id}>
          <li>{user.name}</li>
        </div>
      ))}
    </ul>
  );
};

export default UserList;
