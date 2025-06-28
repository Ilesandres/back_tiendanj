# Funcionalidad de PDF para Facturas

## Descripción

Se ha implementado la generación automática de PDFs para las facturas que se envían por email. El PDF se genera en memoria y se adjunta al email sin guardarse en el sistema.

## Características

### ✅ **Generación en Memoria**
- El PDF se genera dinámicamente usando Puppeteer
- No se guarda en el sistema de archivos
- Se adjunta directamente al email

### ✅ **Diseño Profesional**
- Layout optimizado para PDF (A4)
- Estilos CSS mejorados para impresión
- Información completa del cliente y productos
- Tabla de productos con subtotales
- Resumen de la orden

### ✅ **Datos Incluidos**
- Información del cliente (nombre, DNI, email, teléfono)
- Lista de productos con cantidades y precios
- Subtotales calculados automáticamente
- Total de la orden
- Estado de pago y envío
- Tipo de orden

## Archivos Modificados

### 1. **Nuevo: `pdf.service.ts`**
```typescript
// Servicio para generar PDFs usando Puppeteer
export class PdfService {
    async generateInvoicePdf(invoiceOrderDto: InvoiceOrderDto): Promise<Buffer>
}
```

### 2. **Modificado: `mails.service.ts`**
```typescript
// Se agregó la generación y adjunto del PDF
async sendInvoiceOrder(invoiceOrderDto: InvoiceOrderDto) {
    const pdfBuffer = await this.pdfService.generateInvoicePdf(invoiceOrderDto);
    // ... resto del código con attachments
}
```

### 3. **Modificado: `mails.module.ts`**
```typescript
// Se agregó PdfService al módulo
providers: [MailsService, PdfService],
exports: [MailsService, PdfService],
```

## Dependencias

### **Puppeteer**
```bash
npm install puppeteer
```

**Propósito**: Generar PDFs desde HTML usando un navegador headless.

## Uso

### **Envío de Factura con PDF**
```typescript
// En tu servicio
const invoiceData: InvoiceOrderDto = {
    orderId: order.id,
    order: orderWithRelations,
    user: userWithRelations
};

await this.mailsService.sendInvoiceOrder(invoiceData);
```

### **Resultado**
- Email con template HTML en el cuerpo
- PDF adjunto con nombre: `factura-orden-{id}.pdf`
- PDF contiene la misma información pero optimizada para impresión

## Estructura del PDF

### **Header**
- Título "FACTURA"
- Número de orden
- Fecha de creación

### **Datos del Cliente**
- Nombre completo
- DNI
- Email
- Teléfono

### **Tabla de Productos**
- Nombre del producto
- Cantidad
- Precio unitario
- Subtotal

### **Resumen**
- Total de la orden
- Método de pago
- Estado de pago
- Estado de envío
- Tipo de orden

### **Footer**
- Información de generación automática
- Fecha y hora de generación

## Ventajas

1. **Sin Almacenamiento**: Los PDFs no se guardan en el servidor
2. **Diseño Profesional**: Layout optimizado para impresión
3. **Datos Completos**: Toda la información de la orden incluida
4. **Fácil de Usar**: Se genera automáticamente al enviar el email
5. **Escalable**: No consume espacio en disco

## Notas Técnicas

### **Puppeteer Configuración**
```typescript
const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
});
```

### **PDF Configuración**
```typescript
const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm'
    }
});
```

### **Adjunto al Email**
```typescript
attachments: [
    {
        filename: `factura-orden-${invoiceOrderDto.order.id}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf'
    }
]
```

## Consideraciones

1. **Rendimiento**: La generación de PDF puede tomar unos segundos
2. **Memoria**: Los PDFs se mantienen en memoria temporalmente
3. **Dependencias**: Requiere Puppeteer instalado
4. **Sistema**: Funciona en entornos Linux, Windows y macOS

## Próximas Mejoras

- [ ] Agregar logo de la empresa al PDF
- [ ] Incluir códigos QR para pagos
- [ ] Personalizar colores según la marca
- [ ] Agregar numeración de factura
- [ ] Incluir términos y condiciones 