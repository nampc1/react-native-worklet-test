import React from 'react';
import { useWallet } from '@tetherto/wdk-react-native-core';
import { ActionCard } from '@/components/ActionCard';
import { FeatureLayout } from '@/components/FeatureLayout';
import { getDecimals, toBaseUnit } from '@/utils';

export default function SendFundScreen() {
  const { callAccountMethod } = useWallet();

  return (
    <FeatureLayout 
      title="Send Funds" 
      description="Transfer assets to another address."
    >
      <ActionCard
        title="Quote Send Native Token"
        description="Send native or token assets."
        fields={[
          { id: 'network', type: 'chain', label: 'Select Network' },
          { id: 'index', type: 'number', label: 'Account Index', defaultValue: '0' },
          { id: 'to', type: 'text', label: 'Recipient Address', placeholder: '0x...' },
          { id: 'amount', type: 'text', label: 'Amount', placeholder: '0.0' },
        ]}
        action={async ({ network, index, to, amount }) => {
          const result = await callAccountMethod(
            network, 
            parseInt(index), 
            'quoteSendTransaction',
            { 
              to, 
              value: toBaseUnit(amount, getDecimals(network))
            }
          );
          return result;
        }}
        actionLabel="Quote Send"
      />

      <ActionCard
        title="Send Native Token"
        description="Send native or token assets."
        fields={[
          { id: 'network', type: 'chain', label: 'Select Network' },
          { id: 'index', type: 'number', label: 'Account Index', defaultValue: '0' },
          { id: 'to', type: 'text', label: 'Recipient Address', placeholder: '0x...' },
          { id: 'amount', type: 'text', label: 'Amount', placeholder: '0.0' }
        ]}
        action={async ({ network, index, to, amount, tokenAddress }) => {
          const result = await callAccountMethod(
            network, 
            parseInt(index), 
            'transfer',
            { 
              to, 
              value: toBaseUnit(amount, getDecimals(network))
            }
          );
          return result;
        }}
        actionLabel="Send"
      />
      
      <ActionCard
        title="Quote Send Other Tokens"
        description="Quote send tokens."
        fields={[
          { id: 'network', type: 'chain', label: 'Select Network' },
          { id: 'index', type: 'number', label: 'Account Index', defaultValue: '0' },
          { id: 'to', type: 'text', label: 'Recipient Address', placeholder: '0x...' },
          { id: 'amount', type: 'text', label: 'Amount', placeholder: '0.0' },
          { id: 'tokenAddress', type: 'text', label: 'Token Address', placeholder: '0x...' }
        ]}
        action={async ({ network, index, to, amount, tokenAddress }) => {
          const result = await callAccountMethod(
            network, 
            parseInt(index), 
            'quoteTransfer',
            { 
              recipient: to, 
              amount: toBaseUnit(amount, getDecimals(network, tokenAddress)),
              token: tokenAddress
            }
          );
          return result;
        }}
        actionLabel="Quote Send"
      />
      
      <ActionCard
        title="Send Other Tokens"
        description="Send tokens."
        fields={[
          { id: 'network', type: 'chain', label: 'Select Network' },
          { id: 'index', type: 'number', label: 'Account Index', defaultValue: '0' },
          { id: 'to', type: 'text', label: 'Recipient Address', placeholder: '0x...' },
          { id: 'amount', type: 'text', label: 'Amount', placeholder: '0.0' },
          { id: 'tokenAddress', type: 'text', label: 'Token Address', placeholder: '0x...' }
        ]}
        action={async ({ network, index, to, amount, tokenAddress }) => {
          const result = await callAccountMethod(
            network, 
            parseInt(index), 
            'transfer',
            { 
              recipient: to, 
              amount: toBaseUnit(amount, getDecimals(network, tokenAddress)),
              token: tokenAddress
            }
          );
          return result;
        }}
        actionLabel="Send"
      />
    </FeatureLayout>
  );
}
