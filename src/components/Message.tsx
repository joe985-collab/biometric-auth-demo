import React from 'react';
import { Message as MessageType } from './types';

interface MessageProps {
  text: string;
  type: MessageType['type'];
}

export const Message: React.FC<MessageProps> = ({ text, type }) => {
  if (!text) return null;
  
  const styles = {
    success: 'bg-green-100 text-green-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    '': '',
  };

  return <div className={`mb-4 p-3 rounded-lg ${styles[type]}`}>{text}</div>;
};