import { useScaffoldContractRead, useScaffoldContractWrite } from "./scaffold-eth";

export const usePaymentRequest = (amount = BigInt(0), chatId = "", cid = "") => {
  return useScaffoldContractWrite({
    contractName: "GrapeVine",
    functionName: "makePaymentRequest",
    args: [amount, chatId, cid],
    onBlockConfirmation: txnReceipt => {
      console.log("📦 Transaction blockHash", txnReceipt.blockHash);
    },
  });
};

export const usePayInvoice = (invoiceId = "0" as `0x${string}`, amount = "0" as `${number}`) => {
  return useScaffoldContractWrite({
    contractName: "GrapeVine",
    functionName: "payInvoice",
    args: [invoiceId],
    value: amount,
  });
};

export const usePayDirect = (to = "", chatId = "", cid = "") => {
  return useScaffoldContractWrite({
    contractName: "GrapeVine",
    functionName: "payDirect",
    args: [to, chatId, cid],
    value: "0",
  });
};

export const useInvoice = (invoiceId: `0x${string}`) => {
  const { data: invoice, isLoading } = useScaffoldContractRead({
    contractName: "GrapeVine",
    functionName: "invoices",
    args: [invoiceId],
  });

  return {
    isPaid: invoice?.[2],
    isLoading,
  };
};
