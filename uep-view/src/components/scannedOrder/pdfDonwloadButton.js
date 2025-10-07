import jsPDF from 'jspdf';
import 'jspdf-autotable';

const generatePDF = (data) => {
    const doc = new jsPDF();

    // Add title to the PDF
    doc.setFontSize(18);
    doc.text('Order Details', 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);

    // Add the table
    doc.autoTable({
        head: [ [ 'Order ID', 'Customer', 'Amount' ] ],
        body: data.map(row => [ row.order_number, row.full_name, row.price ]),
        startY: 30
    });

    // Save the PDF
    doc.save('order_details.pdf');
};

export default generatePDF;