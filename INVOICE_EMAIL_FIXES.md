# Correcciones en el Sistema de Facturas por Email

## Problemas Identificados

### 1. **Función `multiply` no definida**
- **Problema**: El template `invoice-order.hbs` usaba `{{multiply this.amount this.product.price}}` pero no había helpers personalizados configurados en Handlebars.
- **Solución**: Se modificó el servicio `MailsService` para calcular los subtotales antes de enviar el email.

### 2. **Estructura de datos inconsistente**
- **Problema**: El DTO `InvoiceOrderDto` tenía campos redundantes y no coincidía con la estructura real de las entidades.
- **Solución**: Se simplificó el DTO para usar solo las entidades necesarias (`OrderEntity` y `UserEntity`).

### 3. **Falta de validaciones**
- **Problema**: El template no manejaba casos donde los datos pudieran ser nulos o indefinidos.
- **Solución**: Se agregaron validaciones condicionales usando `{{#if}}` en el template.

## Cambios Realizados

### 1. **MailsService** (`src/core/mails/mails.service.ts`)
```typescript
async sendInvoiceOrder(invoiceOrderDto: InvoiceOrderDto) {
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

    await this.mailerService.sendMail({
        to: invoiceOrderDto.user.people.email,
        subject: 'Tienda Backend - Factura de orden #' + invoiceOrderDto.order.id,
        template: './invoice-order',
        context: {
            invoiceOrderDto: emailData
        }
    })
}
```

### 2. **Template** (`src/core/mails/templates/invoice-order.hbs`)
- Se reemplazó `{{multiply this.amount this.product.price}}` por `{{this.subtotal}}`
- Se agregaron validaciones condicionales para todos los campos
- Se mejoró el manejo de casos donde los datos pueden ser nulos

### 3. **DTO** (`src/core/dto-mails/invoice.order.dto.ts`)
- Se simplificó para usar solo las entidades necesarias
- Se eliminaron campos redundantes

## Estructura de Datos Esperada

El sistema ahora espera que las entidades tengan las siguientes relaciones cargadas:

```typescript
// OrderEntity debe tener:
- productOrder[] (con relaciones a VariationProductEntity)
- payment (con relaciones a PaymentMethodEntity y PaymentStatusEntity)
- shipment (con relación a ShipmentStatusEntity)
- typeOrder (con relación a TypeOrderEntity)

// UserEntity debe tener:
- people (con todos los datos personales)

// ProductOrderEntity debe tener:
- product (VariationProductEntity con relación a ProductEntity)
- amount (número)

// VariationProductEntity debe tener:
- product (ProductEntity)
- price (número)
```

## Uso

Para usar el sistema de facturas por email:

```typescript
// En tu servicio
const invoiceData: InvoiceOrderDto = {
    orderId: order.id,
    order: orderWithRelations, // Orden con todas las relaciones cargadas
    user: userWithRelations    // Usuario con relación people cargada
};

await this.mailsService.sendInvoiceOrder(invoiceData);
```

## Notas Importantes

1. **Relaciones**: Asegúrate de cargar todas las relaciones necesarias antes de llamar al servicio de emails.
2. **Validaciones**: El template ahora maneja casos donde los datos pueden ser nulos.
3. **Subtotales**: Los subtotales se calculan automáticamente en el servicio.
4. **Formato**: El template usa formato de moneda colombiana (COP). 