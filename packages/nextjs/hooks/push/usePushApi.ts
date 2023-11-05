import { useEffect, useRef, useState } from "react";
import { IFeeds, Message, PushAPI } from "@pushprotocol/restapi";
import { ENV } from "@pushprotocol/restapi/src/lib/constants";
import { ProposedEventNames } from "@pushprotocol/restapi/src/lib/pushstream/pushStreamTypes";
import { useAccount } from "wagmi";
import { TransactionType } from "~~/components/chat";
import { isJson } from "~~/utils/helpers";

export const usePushAPI = (signer: any) => {
  const [user, setUser] = useState<PushAPI>();
  const [init, setInit] = useState(false);
  const [userAddress, setUserAddress] = useState("");
  const [requests, setRequests] = useState<IFeeds[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatFetching, setChatFetching] = useState(false);
  const [chats, setChats] = useState<IFeeds[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const messagesRef = useRef(messages);
  const chatsRef = useRef(chats);

  const { address } = useAccount();

  useEffect(() => {
    const initUser = async () => {
      if (signer) {
        const address = await signer.getAddress();
        if (userAddress !== address) {
          const _user = await PushAPI.initialize(signer, { env: ENV.PROD });
          setUser(_user);
          setUserAddress(address);
          setInit(true);
        }
      }
    };

    initUser();
  }, [signer]);

  const fetchRequests = async () => {
    if (user) {
      const _requests = await user.chat.list("REQUESTS");
      console.log("_requests:", _requests);
      setRequests(_requests);
    }
  };

  const fetchChats = async () => {
    setChatFetching(true);
    if (user) {
      const _chats = await user.chat.list("CHATS");
      console.log("chats:", _chats);
      setChats(_chats);
    }
    setChatFetching(false);
  };

  const sendMessage = async (to: string, message: any) => {
    if (!user || !to) return;

    console.log("Sending message:", message);
    const sentMessage = await user.chat.send(to, { type: message.type, content: message.content });
    console.log("sentMessage:", sentMessage);

    if (!sentMessage) return;

    const newMessage = {
      cid: sentMessage.cid,
      from: address || "",
      to: to,
      type: message.type,
      content: message.content,
      timestamp: (sentMessage.timestamp || 0) / 1000,
      transaction: message.transaction,
    };

    setMessages(prev => [...prev, newMessage]);

    return newMessage;
  };

  const listenChat = async () => {
    if (user) {
      user.stream.on(STREAM.CHAT, (data: any) => {
        console.log("STREAM:", data);
        if (data.event === ProposedEventNames.Message) {
          const newMessage = eventToMessage(data);
          if (
            address !== newMessage.from &&
            (newMessage.from.toLocaleLowerCase() === messagesRef.current[0].from.toLocaleLowerCase() ||
              newMessage.from.toLocaleLowerCase() === messagesRef.current[0].to.toLocaleLowerCase())
          ) {
            setMessages(prev => [...prev, newMessage]);
          }
          const chatIndex = chatsRef.current.findIndex(
            chat => chat.did?.substring(7) === newMessage.from || chat.did?.substring(7) === newMessage.to,
          );
          if (chatIndex >= 0) {
            chatsRef.current[chatIndex].msg.messageContent = newMessage.content;
            setChats(chatsRef.current);
          }
        }
      });
    }
  };

  useEffect(() => {
    setChats([]);
    setRequests([]);
    setMessages([]);
    setMessagesLoading(false);
  }, [address]);

  useEffect(() => {
    fetchChats();
    fetchRequests();
    listenChat();
  }, [user]);

  return {
    user,
    userInitialized: init,
    fetchRequests,
    fetchChats,
    chatFetching,
    chats,
    requests,
    messagesLoading,
    sendMessage,
    messages,
    listenChat,
  };
};

const eventToMessage = (event: any) => {
  if (isJson(event?.message?.content)) {
    const messageObj = JSON.parse(event?.message?.content);
    if (
      (messageObj.type == TransactionType.DIRECT_SEND || messageObj.type == TransactionType.REQUEST) &&
      messageObj.token &&
      messageObj.amount
    ) {
      return {
        cid: event.reference,
        from: event.from.substring(7),
        to: event.to?.[0].substring(7),
        content: event?.message?.content,
        timestamp: event.timestamp / 1000,
        type: event.message.type,
        transaction: {
          type: messageObj.type,
          token: messageObj.token,
          amount: messageObj.amount,
        },
      };
    }
  }

  return {
    cid: event.reference,
    from: event.from.substring(7),
    to: event.to?.[0]?.substring(7),
    content: event.message.content,
    timestamp: event.timestamp / 1000,
    type: event.message.type,
  };
};
