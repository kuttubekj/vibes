import { Message } from "../chat";
import { beautifyAddress } from "~~/utils/helpers";

export function TransactionModal({
  message,
  isOpen,
  onClose,
  onConfirm,
  loading,
}: {
  message: Message | undefined;
  isOpen: boolean;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <div
      className={`fixed z-50 top-0 left-0 w-full h-full ${isOpen ? "block" : "hidden"}`}
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 p-5 bg-black rounded-lg">
        <p className="text-white mb-4">You are about to send:</p>
        <div className="mb-4">
          <strong className="text-white">Amount:</strong> {message?.transaction?.amount}
        </div>
        <div className="mb-4">
          <strong className="text-white">Token:</strong> {message?.transaction?.token}
        </div>
        <div className="mb-4">
          <strong className="text-white">To Address:</strong> {beautifyAddress(message?.to)}
        </div>
        <button className="btn btn-primary w-full mb-2" onClick={() => onConfirm()} disabled={loading}>
          Send
          {loading && <span className="loading loading-dots loading-sm"></span>}
        </button>

        <button className="btn mt-2 w-full" onClick={onClose} disabled={loading}>
          Cancel
        </button>
      </div>
    </div>
  );
}
