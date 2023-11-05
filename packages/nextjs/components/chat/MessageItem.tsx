import { Message, TransactionType } from ".";
import { defaultAbiCoder, keccak256 } from "ethers/lib/utils";
import moment from "moment";
import { FiCheck, FiPlay } from "react-icons/fi";
import { useInvoice } from "~~/hooks/usePayment";

const generateInvoiceId = (chatId: string, cid: string, sender?: string): `0x${string}` => {
  if (!chatId || !cid || !sender) return "0x";
  const combinedData = defaultAbiCoder.encode(["string", "string", "address"], [chatId, cid, sender]);

  return keccak256(combinedData) as `0x${string}`;
};

export const MessageItem = ({
  message,
  address,
  openTransactionModal,
  chatId,
}: {
  message: Message;
  address: string | undefined;
  chatId: string;
  openTransactionModal: (message: Message, _invoiceId: string, amount: string | undefined) => void;
}) => {
  const isRequest = message.transaction?.type === TransactionType.REQUEST;
  const isDirectSend = message.transaction?.type === TransactionType.DIRECT_SEND;
  // keccak256([chatId, message.cid, address])
  const invoiceId = generateInvoiceId(chatId, message.cid, message.from);
  const shouldPay = message.from !== address;
  const { isPaid } = useInvoice(invoiceId);

  return (
    <div className={`chat ${message.from === address ? "chat-end" : "chat-start"}`}>
      {isRequest ? (
        <div className="chat-bubble bg-base-200 text-white p-3 rounded-lg shadow-md">
          💰 Requested{" "}
          <span className="font-bold">
            {message?.transaction?.amount} {message?.transaction?.token}
          </span>
          {/* {message.from !== address && */}
          <>
            {isPaid ? (
              <button className="ml-2 bg-base-500 text-white px-2 py-1 rounded shadow hover:bg-accent transition-all">
                <FiCheck className="text-primary h-6 w-6" />
              </button>
            ) : (
              <>
                {shouldPay && (
                  <button
                    onClick={() => {
                      openTransactionModal(message, invoiceId, message?.transaction?.amount);
                    }}
                    className="ml-2 bg-base-500 text-white px-2 py-1 rounded shadow hover:bg-accent transition-all"
                  >
                    <FiPlay className="text-primary h-6 w-6" />
                  </button>
                )}
              </>
            )}
          </>
          {/* } */}
        </div>
      ) : (
        <>
          {isDirectSend ? (
            <div className="chat-bubble bg-base-200 text-white p-3 rounded-lg shadow-md">
              {isPaid ? (
                <>
                  💰 {shouldPay ? "Received" : "Sent"}{" "}
                  <span className="font-bold">
                    {message?.transaction?.amount} {message?.transaction?.token}
                  </span>
                  <button className="ml-2 bg-base-500 text-white px-2 py-1 rounded shadow hover:bg-accent transition-all">
                    <FiCheck className="text-primary h-6 w-6" />
                  </button>
                </>
              ) : (
                <>
                  💰 Sending{" "}
                  <span className="font-bold">
                    {message?.transaction?.amount} {message?.transaction?.token}
                  </span>
                </>
              )}
            </div>
          ) : (
            <div className="chat-bubble">{message.content}</div>
          )}
        </>
      )}

      {/*
        <div className="chat-image avatar">
          <div className="w-10 rounded-full">
        <img
          src={me}
          alt="User Avatar"
        />
      </div>
        </div>
        {/* {message.from !== signer?._address && (
      <div className="chat-header text-white">
        {beautifyAddress(message.from)}
      </div>
    )} */}
      <div className="chat-footer opacity-50 text-white">
        <time className="text-xs opacity-50">{moment.unix(message.timestamp).fromNow()}</time>
      </div>
    </div>
  );
};
