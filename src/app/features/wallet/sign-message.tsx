import React, { useState } from 'react';
import { useWallet } from '@tetherto/wdk-react-native-core';
import { ActionCard } from '@/components/ActionCard';
import { FeatureLayout } from '@/components/FeatureLayout';

export default function SignMessageScreen() {
  const { callAccountMethod, getAddress } = useWallet();
  const [lastResult, setLastResult] = useState<{
    signature: string;
    message: string;
    network: string;
    address?: string;
  } | null>(null);

  return (
    <FeatureLayout 
      title="Sign & Verify" 
      description="Cryptographically sign messages and verify signatures."
    >
      <ActionCard
        title="Sign Message"
        description="Sign a text message with your private key."
        fields={[
          { id: 'network', type: 'chain', label: 'Select Network' },
          { id: 'index', type: 'number', label: 'Account Index', defaultValue: '0' },
          { id: 'message', type: 'text', label: 'Message', placeholder: 'Hello WDK!' }
        ]}
        action={async ({ network, index, message }) => {
          const address = await getAddress(network, parseInt(index));
          
          const signature = await callAccountMethod(
            network, 
            parseInt(index), 
            'sign',
            message 
          );

          // 3. Save for reuse
          setLastResult({ signature: signature as string, message, network, address });
          
          return { signature, address };
        }}
        actionLabel="Sign"
      />

      <ActionCard
        key={lastResult ? lastResult.signature : 'init'}
        title="Verify Signature"
        description="Verify that a signature matches a message and address."
        fields={[
          { id: 'network', type: 'chain', label: 'Select Network', defaultValue: lastResult?.network },
          { id: 'message', type: 'text', label: 'Message', defaultValue: lastResult?.message },
          { id: 'signature', type: 'text', label: 'Signature', defaultValue: lastResult?.signature, placeholder: '0x...' }
        ]}
        action={async ({ network, message, signature }) => {
           const isValid = await callAccountMethod(
            network,
            0,
            'verify',
            { message, signature }
          );
          return { isValid };
        }}
        actionLabel="Verify"
      />
    </FeatureLayout>
  );
}