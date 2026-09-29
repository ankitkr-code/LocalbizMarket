export default function StatusBadge({ status }) {
  const statusStyles = {
    pending: { bg: "bg-amber-50", text: "text-amber-700", label: "Pending" },
    approved: { bg: "bg-emerald-50", text: "text-emerald-700", label: "Approved" },
    rejected: { bg: "bg-red-50", text: "text-red-700", label: "Rejected" },
    active: { bg: "bg-blue-50", text: "text-blue-700", label: "Active" }
  };

  const style = statusStyles[status] || statusStyles.pending;

  return (
    <span className={`inline-flex items-center rounded px-2 py-1 text-xs font-medium ${style.bg} ${style.text}`}>
      {style.label}
    </span>
  );
}
