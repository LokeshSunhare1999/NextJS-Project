import React, { useEffect, useState } from 'react';
import Quagga from 'quagga';
import { useRef } from 'react';

const QuaggaScanner = ({ handleOrderScanned }) => {
    const [ warningMessage, setWarningMessage ] = useState('');
    const [ isScanning, setIsScanning ] = useState(true);
    const isLoadingRef = useRef(false);

    useEffect(() => {

        const scanBarcode = async (barcode) => {
            if(!isLoadingRef.current) {
                isLoadingRef.current = true;
                await handleOrderScanned(barcode);
                isLoadingRef.current = false;
            }
        }
        if (isScanning) {
            Quagga.init(
                {
                    inputStream: {
                        type: 'LiveStream',
                        constraints: {
                            facingMode: 'environment',
                        },
                        target: document.querySelector('#scanner-container'),
                    },
                    decoder: {
                        readers: [ 'code_128_reader', 'ean_reader', 'upc_reader' ],
                    },
                    locate: true,
                    frequency: 10,
                    halfSample: true,
                },
                (err) => {
                    if (err) {
                        console.error(err);
                        setIsScanning(false);
                        return;
                    }
                    Quagga.start();
                }
            );

            Quagga.onDetected((result) => {
                if (result && result.codeResult && result.codeResult.code) {
                    const barcode = result?.codeResult?.code;
                    if (barcode) {
                        setWarningMessage('');
                        scanBarcode(barcode);
                        // handleOrderScanned(barcode);
                    } else {
                        const errorMessage = `Warning: Order ID ${ barcode } not found.`;
                        alert(errorMessage);
                    }

                    // Stop scanning after detection
                    Quagga.stop();
                    setIsScanning(false);

                    // Restart scanning after a delay
                    setTimeout(() => {
                        setIsScanning(true);
                    }, 1000);
                } else {
                    console.log('No code detected.');
                }
            });
        }
        // Clean up on unmount or if scanning is disabled
        return () => {
            Quagga.stop();
        };
    }, [ isScanning ] );

    // useEffect(() => {
    //     if (scannedId) {
    //         handleOrderScanned(scannedId);
    //         setScannedId('');
    //     }
    // }, [ scannedId ]);

    return (
        <div>
            <div
                id="scanner-container"
                style={ { width: '50%', height: '300px' } }
            />
            {warningMessage && <p style={ { color: 'red' } }>{warningMessage}</p>}
            {/* <ul>
                {scannedData.map((data) => (
                    <li key={ data.order_number }>{data.order_number}</li>
                ))}
            </ul> */}
            {/* <button onClick={ () => {handleOrderScanned(scannedId);setScannedId('')} } disabled={ !scannedId }>Fetch</button> */}
        </div>
    );
};

export default QuaggaScanner;