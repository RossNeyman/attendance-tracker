import React from 'react';
import { useGetDataQuery } from '../features/studentSlice';

/**
 * `StudentQRCode` is a React functional component that displays a QR code for a student.
 * It fetches student data, including a base64 encoded QR code, based on the provided email.
 *
 * @remarks
 * This component utilizes the `useGetDataQuery` hook from `../features/studentSlice` to retrieve student information.
 * It handles loading states, error states, and scenarios where no QR code is available for the given email.
 * The QR code is rendered as an `<img>` element with a fixed size of 200x200 pixels.
 *
 * @param props - The props for the component.
 * @param props.email - The email address of the student for whom the QR code is to be displayed.
 *
 * @returns A React element representing the student's QR code, or a loading/error/no data message.
 *
 * @example
 * ```tsx
 * <StudentQRCode email="student@example.com" />
 * ```
 */
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