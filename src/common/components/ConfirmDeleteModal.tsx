interface Props {
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDeleteModal({ onConfirm, onCancel }: Props) {
  return (
    <div className="modal">
      <div className="modalBox">
        <h3>Silinsin?</h3>
        <p>Bu kateqoriya silinəcək.</p>

        <button onClick={onConfirm}>Bəli</button>
        <button onClick={onCancel}>Ləğv et</button>
      </div>
    </div>
  );
}