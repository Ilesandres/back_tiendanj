import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { InvoiceOrderDto } from '../dto-mails/invoice.order.dto';

@Injectable()
export class PdfService {
    
    async generateInvoicePdf(invoiceOrderDto: InvoiceOrderDto): Promise<Buffer> {
        let browser;
        
        try {
            // Configuración para usar Chromium embebido de Puppeteer
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
                timeout: 60000,
                protocolTimeout: 60000
            };

            // NO usar Chrome del sistema, solo Chromium embebido
            console.log('Using Puppeteer embedded Chromium');
            console.log('Launching browser with options:', launchOptions);
            
            browser = await puppeteer.launch(launchOptions);
            
            const page = await browser.newPage();
            
            // Configurar timeouts
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
                productOrder: invoiceOrderDto.order.productOrder?.map(productOrder => {
                    const variations = productOrder.product.product?.variation;
                    const variationActiva = Array.isArray(variations) ? variations.find(v => v.active) : null;

                    return {
                        ...productOrder,
                        subtotal: productOrder.amount * productOrder.product.price,
                        product: {
                            ...productOrder.product,
                            measure: variationActiva?.measure?.measure,
                            color: variationActiva?.color?.color,
                            spice: variationActiva?.spice?.spice
                        }
                    };
                })
            }
        };

        return `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <title>Factura #${emailData.order.id} NJ</title>
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                
                body {
                    font-family: 'Times New Roman', serif;
                    font-size: 12px;
                    line-height: 1.4;
                    color: #000;
                    background-color: #fff;
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 20px;
                }
                
                .invoice-header {
                    border-bottom: 2px solid #000;
                    padding-bottom: 20px;
                    margin-bottom: 30px;
                }
                
                .company-info {
                    float: left;
                    width: 60%;
                }
                
                .company-name {
                    font-size: 24px;
                    font-weight: bold;
                    margin-bottom: 5px;
                }
                
                .company-details {
                    font-size: 11px;
                    line-height: 1.3;
                }
                
                .invoice-details {
                    float: right;
                    width: 35%;
                    text-align: right;
                }
                
                .invoice-title {
                    font-size: 28px;
                    font-weight: bold;
                    margin-bottom: 10px;
                    color: #333;
                }
                
                .invoice-number {
                    font-size: 14px;
                    font-weight: bold;
                    margin-bottom: 5px;
                }
                
                .invoice-date {
                    font-size: 11px;
                }
                
                .clear {
                    clear: both;
                }
                
                .customer-section {
                    margin-bottom: 30px;
                }
                
                .section-title {
                    font-size: 14px;
                    font-weight: bold;
                    margin-bottom: 10px;
                    border-bottom: 1px solid #000;
                    padding-bottom: 3px;
                }
                
                .customer-info {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 15px;
                }
                
                .customer-info p {
                    margin: 3px 0;
                    font-size: 11px;
                }
                
                .customer-info strong {
                    font-weight: bold;
                }
                
                .products-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 30px;
                }
                
                .products-table th {
                    background-color: #f0f0f0;
                    border: 1px solid #000;
                    padding: 8px 5px;
                    font-size: 11px;
                    font-weight: bold;
                    text-align: left;
                }
                
                .products-table td {
                    border: 1px solid #000;
                    padding: 8px 5px;
                    font-size: 11px;
                    vertical-align: top;
                }
                
                .product-name {
                    font-weight: bold;
                    margin-bottom: 2px;
                }
                
                .product-details {
                    font-size: 10px;
                    color: #666;
                    line-height: 1.2;
                }
                
                .quantity {
                    text-align: center;
                }
                
                .price, .subtotal {
                    text-align: right;
                }
                
                .total-section {
                    float: right;
                    width: 300px;
                    margin-top: 20px;
                }
                
                .total-row {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 5px;
                    font-size: 12px;
                }
                
                .total-row.grand-total {
                    font-size: 16px;
                    font-weight: bold;
                    border-top: 2px solid #000;
                    padding-top: 10px;
                    margin-top: 10px;
                }
                
                .payment-info {
                    margin-top: 40px;
                    border-top: 1px solid #000;
                    padding-top: 20px;
                }
                
                .payment-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                }
                
                .payment-item {
                    font-size: 11px;
                }
                
                .payment-item strong {
                    display: block;
                    margin-bottom: 3px;
                }
                
                .footer {
                    margin-top: 50px;
                    text-align: center;
                    font-size: 10px;
                    color: #666;
                    border-top: 1px solid #ccc;
                    padding-top: 15px;
                }
                
                @media print {
                    body {
                        padding: 0;
                        margin: 0;
                    }
                }
            </style>
        </head>
        <body>
            <div class="invoice-header">
                <div class="company-info">
                    <div class="company-name">MINIMARKET NJ</div>
                    <div class="company-details">
                        Dirección: Calle Principal #123<br>
                        Teléfono: (123) 456-7890<br>
                        Email: info@minimarketnj.com<br>
                        NIT: 12345678-9
                    </div>
                </div>
                
                <div class="invoice-details">
                    <div class="invoice-title">FACTURA</div>
                    <div class="invoice-number">No. ${emailData.order.id}</div>
                    <div class="invoice-date">Fecha: ${new Date(emailData.order.createdAt).toLocaleDateString('es-CO')}</div>
                </div>
                
                <div class="clear"></div>
            </div>

            <div class="customer-section">
                <div class="section-title">DATOS DEL CLIENTE</div>
                ${emailData.user.people ? `
                    <div class="customer-info">
                        <div>
                            <p><strong>Nombre:</strong> ${emailData.user.people.name} ${emailData.user.people.lastname}</p>
                            <p><strong>DNI:</strong> ${emailData.user.people.dni}</p>
                        </div>
                        <div>
                            <p><strong>Email:</strong> ${emailData.user.people.email}</p>
                            <p><strong>Teléfono:</strong> ${emailData.user.people.phone || 'No especificado'}</p>
                        </div>
                    </div>
                ` : '<p>Datos del cliente no disponibles</p>'}
            </div>

            <table class="products-table">
                <thead>
                    <tr>
                        <th style="width: 40%;">DESCRIPCIÓN</th>
                        <th style="width: 10%; text-align: center;">CANT.</th>
                        <th style="width: 20%; text-align: right;">PRECIO UNIT.</th>
                        <th style="width: 20%; text-align: right;">SUBTOTAL</th>
                    </tr>
                </thead>
                <tbody>
                    ${emailData.order.productOrder && emailData.order.productOrder.length > 0 ? 
                        emailData.order.productOrder.map(productOrder => `
                            <tr>
                                <td>
                                    <div class="product-name">${productOrder.product.product ? productOrder.product.product.product : 'Producto no disponible'}</div>
                                    ${productOrder.product.description ? `
                                        <div class="product-details">${productOrder.product.description}</div>
                                    ` : ''}
                                    <div class="product-details">
                                        ${productOrder.product.measure ? `Medida: ${productOrder.product.measure}` : ''}
                                        ${productOrder.product.color ? ` | Color: ${productOrder.product.color}` : ''}
                                        ${productOrder.product.spice ? ` | Sabor: ${productOrder.product.spice}` : ''}
                                    </div>
                                </td>
                                <td class="quantity">${productOrder.amount}</td>
                                <td class="price">$${productOrder.product.price || 0}</td>
                                <td class="subtotal">$${productOrder.subtotal || 0}</td>
                            </tr>
                        `).join('') : '<tr><td colspan="4" style="text-align: center;">No hay productos en esta orden</td></tr>'
                    }
                </tbody>
            </table>

            <div class="total-section">
                <div class="total-row">
                    <span>Subtotal:</span>
                    <span>$${emailData.order.total || 0}</span>
                </div>
                <div class="total-row">
                    <span>IVA (0%):</span>
                    <span>$0.00</span>
                </div>
                <div class="total-row grand-total">
                    <span>TOTAL:</span>
                    <span>$${emailData.order.total || 0}</span>
                </div>
            </div>

            <div class="clear"></div>

            <div class="payment-info">
                <div class="section-title">INFORMACIÓN DE PAGO Y ENVÍO</div>
                <div class="payment-grid">
                    ${emailData.order.payment ? `
                        <div class="payment-item">
                            <strong>Método de Pago:</strong>
                            ${emailData.order.payment.method ? emailData.order.payment.method.method : 'No especificado'}
                        </div>
                        <div class="payment-item">
                            <strong>Estado de Pago:</strong>
                            ${emailData.order.payment.status ? emailData.order.payment.status.status : 'No especificado'}
                        </div>
                    ` : `
                        <div class="payment-item">
                            <strong>Método de Pago:</strong>
                            No especificado
                        </div>
                        <div class="payment-item">
                            <strong>Estado de Pago:</strong>
                            No especificado
                        </div>
                    `}
                    
                    ${emailData.order.shipment ? `
                        <div class="payment-item">
                            <strong>Estado de Envío:</strong>
                            ${emailData.order.shipment.status ? emailData.order.shipment.status.status : 'No especificado'}
                        </div>
                    ` : `
                        <div class="payment-item">
                            <strong>Estado de Envío:</strong>
                            No especificado
                        </div>
                    `}
                    
                    <div class="payment-item">
                        <strong>Tipo de Orden:</strong>
                        ${emailData.order.typeOrder ? emailData.order.typeOrder.type : 'No especificado'}
                    </div>
                </div>
            </div>

            <div class="footer">
                <p>Gracias por su compra. Este documento es una representación impresa de una factura electrónica.</p>
                <p>Minimarket NJ - Sistema de Facturación Automática</p>
            </div>
        </body>
        </html>
        `;
    }
} 