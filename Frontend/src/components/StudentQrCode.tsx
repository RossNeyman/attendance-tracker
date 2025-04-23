import React from 'react';
import { useGetDataQuery } from '../features/studentSlice';

export const StudentQRCode: React.FC<{ email: string }> = ({ email }) => {
    const { data, isLoading, error } = useGetDataQuery(email);

    if (isLoading) return <div>Loading...</div>;
    if (error) {
        console.error('Error fetching QR code:', error);
        return <div>Error loading QR code</div>;
    }
    if (!data?.[0]?.qrCodeBase64) return <div>No QR code available</div>;

    return (
        <img 
            src={`${data[0].qrCodeBase64}`}
            alt={`QR Code for ${data[0].first_name} ${data[0].last_name}`}
            style={{ width: '200px', height: '200px' }}
        />
    );
};