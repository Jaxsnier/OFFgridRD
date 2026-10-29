# Actualización de Garantías y Personalización Visual de Cotización

Plan detallado para actualizar las garantías de inversores y paneles solares con la nota de fabricante, incorporar el letrero informativo de descuento del 5% y habilitar la modificación interactiva del total en la cotización al cliente.

## User Review & Critical Decisions

> [!IMPORTANT]
> Decisiones confirmadas a través de las preguntas interactivas en Fase 1:
> - **Letrero de 5% de descuento**: Mostrar únicamente como un distintivo/letrero visual informativo en el bloque del total, sin forzar recálculo matemático a menos que el usuario lo desee.
> - **Modificación del Total**: Permitir ajustar el valor total cotizado mediante un botón interactivo de edición ubicado tanto directamente en el bloque del total como en la barra de acciones superior de la cotización, con opción de restablecer al total calculado por el sistema en cualquier momento.

- **Garantías Actualizadas**:
  - Inversor: 5 a 10 años de garantía de fábrica.
  - Paneles Solares: 10 a 13 años de garantía de producto (con nota explicativa: *"Garantías sujetas a variantes y políticas según cada fabricante"*).
  - Mano de obra e instalación eléctrica: 2 años.

---

## 1. Overview & Core Concept

- **Qué hace**: Brinda a los asesores y contratistas solares mayor precisión contractual al presentar garantías comerciales realistas de paneles e inversores, e introduce herramientas visuales en la **Cotización al Cliente (Sección 2.0)** para destacar promociones (letrero de 5% de descuento) o ajustar el monto total final cuando se negocia un precio cerrado con el cliente.
- **Público Objetivo**: Vendedores, técnicos e instaladores de OFFgridRD SRL que generan propuestas para clientes residenciales y comerciales.
- **Valor Principal**: Flexibilidad total en el cierre de ventas sin perder la trazabilidad de los costos internos ni alterar la integridad del sistema.

---

## 2. User Experience & Visual Design

### Flujo de Interacción del Usuario:
1. **Navegación**: El usuario ingresa a la pestaña **"2. Cotización Cliente"**.
2. **Visualización de Garantías**: En el pie de página de la cotización, bajo *Garantías del Sistema*, se mostrarán los nuevos rangos:
   - Inversores: 5 a 10 años.
   - Paneles Solares: 10 a 13 años.
   - Nota al pie en tipografía sutil: *(\*Garantía sujeta a variantes según el fabricante)*.
3. **Control del Letrero de Descuento (5%)**:
   - En la barra de herramientas superior y en el bloque del total, un selector/interruptor permite activar o desactivar el letrero visual:
     ```
     [✓] Mostrar distintivo "(5% descuento aplicado)"
     ```
   - Al estar activo, el bloque del total despliega un letrero destacado verde esmeralda: `(5% descuento aplicado)`.
4. **Modificación del Valor Total**:
   - Junto al monto total aparece un botón discreto **"Modificar Total"** (lápiz / botón accesible).
   - Al pulsar, el monto se transforma en un campo numérico con opciones de **"Guardar"**, **"Cancelar"** y **"Restablecer calculado"**.
   - También accesible desde la barra superior mediante un botón de ajustes visuales.
   - Si el total ha sido modificado manualmente, se indica con una etiqueta discreta *"Total personalizado"* y se refleja limpiamente tanto en pantalla como al imprimir en PDF y al enviar por WhatsApp.

---

## 3. Key Product Decisions & Trade-Offs

- **Decisión 1: Modificación no destructiva del total cotizado**
  - *Enfoque*: Se almacena el total personalizado como un override (`customTotalQuoted?: number`) sin borrar el cálculo base subyacente.
  - *Por qué*: Permite al usuario regresar al total original en cualquier momento con un solo clic.
- **Decisión 2: Distintivo de 5% visual vs matemático**
  - *Enfoque*: Se implementa como bandera booleana (`showDiscount5PercentBadge: boolean`).
  - *Por qué*: Coincide con la respuesta del usuario de mantenerlo como letrero informativo sin alterar automáticamente partidas de costo interno.

---

## 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                    CotizacionPage State                     │
│  - quoteInput                                               │
│  - customOverrides (partidas)                               │
│  - customClientTotalOverride (total cotizado manual)        │
│  - showDiscount5PercentBadge (bandera letrero)              │
└──────────────────────────────┬──────────────────────────────┘
                               │
                ┌──────────────┴──────────────┐
                ▼                             ▼
   ┌───────────────────────────┐ ┌───────────────────────────┐
   │    ClientQuoteView        │ │    ClientQuoteFooter      │
   │  - ClientQuoteActionBar   │ │  - Letrero 5% Descuento   │
   │    [Modificar Total]      │ │  - Total Editable inline  │
   │    [Toggle Descuento 5%]  │ │  - Garantías 5-10a /      │
   │  - WhatsApp & Print Sync  │ │    10-13a + Nota Fabr.     │
   └───────────────────────────┘ └───────────────────────────┘
```

### Entidades y Mapeo:
- `constants.ts`: Actualización de textos de garantía en `QUALITY_DETAILS` (`warrantyInverter: '5 a 10 años de garantía de fábrica'`, `warrantyPanels: '10 a 13 años de garantía de producto (*sujeta a variantes según fabricante)'`).
- `ClientQuoteFooter.tsx`: Renderizado condicional del letrero `(5% descuento aplicado)`, display del total con opción de edición en línea y actualización de términos de garantía.
- `ClientQuoteActionBar.tsx`: Botones para alternar el letrero y abrir el editor del total.
- `clientQuoteShareHelper.ts`: Sincronización del mensaje de WhatsApp y texto compartido para incluir el total personalizado y el letrero de descuento si están activos.
