export default function UserRow({ user, onDelete, onViewAds }) {
  return (
    <tr>
      <td>{user.name}</td>
      <td>{user.email}</td>
      <td><button onClick={() => onDelete(user._id)}>Delete User</button></td>
      <td><button onClick={() => onViewAds(user._id)}>Ads</button></td>
    </tr>
  );
}
