import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { InvoiceOrderDto } from '../dto-mails/invoice.order.dto';

@Injectable()
export class PdfService {
    
    async generateInvoicePdf(invoiceOrderDto: InvoiceOrderDto): Promise<Buffer> {
        let browser;
        
        try {
            // Configuración optimizada para servidores - usar Chrome embebido de Puppeteer
            const launchOptions: any = {
                headless: true,
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-gpu',
                    '--no-first-run',
                    '--disable-extensions',
                    '--disable-background-timer-throttling',
                    '--disable-backgrounding-occluded-windows',
                    '--disable-renderer-backgrounding',
                    '--disable-features=TranslateUI',
                    '--disable-ipc-flooding-protection',
                    '--memory-pressure-off',
                    '--max_old_space_size=4096'
                ],
                timeout: 60000, // 60 segundos
                protocolTimeout: 60000
            };

            // Solo intentar usar Chrome del sistema si está explícitamente configurado
            if (process.env.CHROME_BIN && process.env.NODE_ENV === 'production') {
                console.log('Using system Chrome at:', process.env.CHROME_BIN);
                launchOptions.executablePath = process.env.CHROME_BIN;
            } else {
                console.log('Using Puppeteer embedded Chrome');
            }

            console.log('Launching browser with options:', launchOptions);
            browser = await puppeteer.launch(launchOptions);
            
            const page = await browser.newPage();
            
            // Configurar timeouts más largos
            page.setDefaultTimeout(60000);
            page.setDefaultNavigationTimeout(60000);
            
            // Generar el HTML del invoice
            const htmlContent = this.generateInvoiceHtml(invoiceOrderDto);
            
            console.log('Setting page content...');
            await page.setContent(htmlContent, {
                waitUntil: 'networkidle0',
                timeout: 60000
            });

            console.log('Generating PDF...');
            // Configurar el PDF
            const pdfBuffer = await page.pdf({
                format: 'A4',
                printBackground: true,
                margin: {
                    top: '20mm',
                    right: '20mm',
                    bottom: '20mm',
                    left: '20mm'
                },
                timeout: 60000
            });

            console.log('PDF generated successfully');
            return Buffer.from(pdfBuffer);
            
        } catch (error) {
            console.error('Error generating PDF:', error);
            throw new Error(`Failed to generate PDF: ${error.message}`);
        } finally {
            if (browser) {
                try {
                    console.log('Closing browser...');
                    await browser.close();
                } catch (closeError) {
                    console.error('Error closing browser:', closeError);
                }
            }
        }
    }

    private generateInvoiceHtml(invoiceOrderDto: InvoiceOrderDto): string {
        // Crear una copia de los datos con subtotales calculados
        const emailData = {
            ...invoiceOrderDto,
            order: {
                ...invoiceOrderDto.order,
                productOrder: invoiceOrderDto.order.productOrder?.map(productOrder => ({
                    ...productOrder,
                    subtotal: productOrder.amount * productOrder.product.price
                }))
            }
        };

        return `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <title>Factura de orden #${emailData.order.id} NJ</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    max-width: 800px;
                    margin: auto;
                    padding: 20px;
                    color: #333;
                    font-size: 12px;
                }
                h1, h2 {
                    text-align: center;
                    color: #2c3e50;
                }
                h1 {
                    font-size: 24px;
                    margin-bottom: 10px;
                }
                h2 {
                    font-size: 18px;
                    margin-top: 30px;
                    margin-bottom: 15px;
                    border-bottom: 2px solid #3498db;
                    padding-bottom: 5px;
                }
                .header {
                    text-align: center;
                    margin-bottom: 30px;
                    padding: 20px;
                    background-color: #f8f9fa;
                    border-radius: 8px;
                }
                .customer-info {
                    background-color: #ecf0f1;
                    padding: 15px;
                    border-radius: 8px;
                    margin-bottom: 20px;
                }
                .customer-info p {
                    margin: 5px 0;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 20px;
                    font-size: 11px;
                }
                th, td {
                    padding: 8px;
                    border: 1px solid #ddd;
                    text-align: left;
                }
                th {
                    background-color: #3498db;
                    color: white;
                    font-weight: bold;
                }
                tr:nth-child(even) {
                    background-color: #f2f2f2;
                }
                .total {
                    text-align: right;
                    font-size: 16px;
                    font-weight: bold;
                    margin-top: 20px;
                    padding: 15px;
                    background-color: #2c3e50;
                    color: white;
                    border-radius: 8px;
                }
                .summary {
                    background-color: #f8f9fa;
                    padding: 15px;
                    border-radius: 8px;
                    margin-top: 20px;
                }
                .summary p {
                    margin: 8px 0;
                    font-size: 12px;
                }
                .footer {
                    text-align: center;
                    margin-top: 40px;
                    padding-top: 20px;
                    border-top: 1px solid #ddd;
                    font-size: 10px;
                    color: #666;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>FACTURA</h1>
                <h2>Orden #${emailData.order.id} - MINIMARKET NJ</h2>
                <p><strong>Fecha:</strong> ${new Date(emailData.order.createdAt).toLocaleDateString('es-CO')}</p>
            </div>

            <div class="customer-info">
                <h3>Datos del Cliente</h3>
                ${emailData.user.people ? `
                    <p><strong>Nombre:</strong> ${emailData.user.people.name} ${emailData.user.people.lastname}</p>
                    <p><strong>DNI:</strong> ${emailData.user.people.dni}</p>
                    <p><strong>Email:</strong> ${emailData.user.people.email}</p>
                    <p><strong>Teléfono:</strong> ${emailData.user.people.phone || 'No especificado'}</p>
                ` : '<p>Datos del cliente no disponibles</p>'}
            </div>

            <h2>Productos</h2>
            ${emailData.order.productOrder && emailData.order.productOrder.length > 0 ? `
                <table>
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Cantidad</th>
                            <th>Precio unitario</th>
                            <th>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${emailData.order.productOrder.map(productOrder => `
                            <tr>
                                <td>${productOrder.product.product ? productOrder.product.product.product : 'Producto no disponible'}</td>
                                <td>${productOrder.amount}</td>
                                <td>$${productOrder.product.price || 0}</td>
                                <td>$${productOrder.subtotal || 0}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            ` : '<p>No hay productos en esta orden</p>'}

            <div class="total">
                <strong>TOTAL: $${emailData.order.total || 0}</strong>
            </div>

            <div class="summary">
                <h3>Resumen de la Orden</h3>
                ${emailData.order.payment ? `
                    <p><strong>Método de pago:</strong> ${emailData.order.payment.method ? emailData.order.payment.method.method : 'No especificado'}</p>
                    <p><strong>Estado de pago:</strong> ${emailData.order.payment.status ? emailData.order.payment.status.status : 'No especificado'}</p>
                ` : `
                    <p><strong>Método de pago:</strong> No especificado</p>
                    <p><strong>Estado de pago:</strong> No especificado</p>
                `}
                
                ${emailData.order.shipment ? `
                    <p><strong>Estado de envío:</strong> ${emailData.order.shipment.status ? emailData.order.shipment.status.status : 'No especificado'}</p>
                ` : '<p><strong>Estado de envío:</strong> No especificado</p>'}
                
                <p><strong>Tipo de orden:</strong> ${emailData.order.typeOrder ? emailData.order.typeOrder.type : 'No especificado'}</p>
            </div>

            <div class="footer">
                <p>Este documento es generado automáticamente por el sistema de Tienda NJ</p>
                <p>Fecha de generación: ${new Date().toLocaleString('es-CO')}</p>
            </div>
        </body>
        </html>
        `;
    }
} 