import { useState } from "react";
import { TransactionType } from "../Chat";
import { parseUnits } from "viem";

export function TokenModal({
  isOpen,
  onClose,
  onConfirmSent,
  loading,
}: {
  isOpen: boolean;
  loading: boolean;
  onClose: () => void;
  onConfirmSent: (token: string, amount: string, type: TransactionType) => void;
}) {
  const [chosenToken, setChosenToken] = useState("ETH");
  const [tokenAmount, setTokenAmount] = useState("");
  const [activeTab, setActiveTab] = useState("send");

  const handleAmountChange = (e: any) => {
    const amount = e.target.value;
    if (!amount || amount.match(/^\d{1,}(\.\d{0,4})?$/)) {
      setTokenAmount(amount);
    }
  };

  const handleConfirm = (type: TransactionType) => {
    onConfirmSent(chosenToken, parseUnits(tokenAmount, 18), type);
  };

  return (
    <div
      className={`fixed z-50 top-0 left-0 w-full h-full ${isOpen ? "block" : "hidden"}`}
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 p-5 bg-black rounded-lg">
        <div className="flex justify-center mb-4">
          <button className={`mx-2 ${activeTab === "send" ? "underline" : ""}`} onClick={() => setActiveTab("send")}>
            Send
          </button>
          <button
            className={`mx-2 ${activeTab === "request" ? "underline" : ""}`}
            onClick={() => setActiveTab("request")}
          >
            Request
          </button>
        </div>
        <select onChange={e => setChosenToken(e.target.value)} className="input w-full mb-4">
          <option value="ETH">ETH</option>
        </select>

        <input
          value={tokenAmount}
          onChange={handleAmountChange}
          type="text"
          placeholder="Amount"
          className="input w-full mb-4"
        />

        {activeTab === "send" && (
          <button
            className="btn btn-primary w-full"
            disabled={loading}
            onClick={() => onConfirmSent(chosenToken, tokenAmount, TransactionType.DIRECT_SEND)}
          >
            Send
            {loading && <span className="loading loading-dots loading-sm"></span>}
          </button>
        )}

        {activeTab === "request" && (
          <button
            className="btn btn-primary w-full"
            disabled={loading}
            onClick={() => onConfirmSent(chosenToken, tokenAmount, TransactionType.REQUEST)}
          >
            Request
            {loading && <span className="loading loading-dots loading-sm"></span>}
          </button>
        )}

        <button className="btn mt-2 w-full" disabled={loading} onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}
