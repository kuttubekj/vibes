import React from "react";
import Image from "next/image";

interface MessageHeaderProps {
  avatarUrl: string;
  address: string;
}

const MessageHeader: React.FC<MessageHeaderProps> = ({ avatarUrl, address }) => {
  return (
    <div style={{ marginTop: "20px" }} className="bg-primary text-white p-4 flex items-center rounded-3xl mb-4">
      <Image src={avatarUrl} className="w-12 h-12 rounded-full" alt={""} />
      <div className="ml-4 text-lg">
        {address.substring(0, 7)}...{address.substring(address.length - 5, address.length)}
      </div>
    </div>
  );
};

export default MessageHeader;
