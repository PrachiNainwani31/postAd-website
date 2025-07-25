export default function StatusDropdown({ status, onChange }) {
  return (
    <select value={status} onChange={e => onChange(e.target.value)}>
      {['Pending','Approved','Rejected'].map(s => (
        <option key={s} value={s.toLowerCase()}>{s}</option>
      ))}
    </select>
  );
}
