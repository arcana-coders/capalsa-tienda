import {
  Body,
  Container,
  Column,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface OrderConfirmationEmailProps {
  orderNumber: string;
  customerName: string;
  items: any[];
  total: string;
  address: {
    calle: string;
    colonia: string;
    ciudad: string;
    estado: string;
    cp: string;
  };
}

export const OrderConfirmationEmail = ({
  orderNumber = "CP-123456",
  customerName = "Cliente",
  items = [],
  total = "$0.00",
  address = { calle: "", colonia: "", ciudad: "", estado: "", cp: "" },
}: OrderConfirmationEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Tu pedido {orderNumber} ha sido confirmado</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={logo}>CAPALSA</Text>
          </Section>
          
          <Section style={content}>
            <Heading style={h1}>Gracias por tu compra, {customerName}</Heading>
            <Text style={text}>
              Estamos preparando tu pedido. Pronto nos pondremos en contacto contigo
              para los detalles del envío.
            </Text>
            
            <Section style={orderInfo}>
              <Text style={label}>NÚMERO DE ORDEN</Text>
              <Text style={orderId}>{orderNumber}</Text>
            </Section>

            <Hr style={hr} />

            <Section>
              <Text style={label}>RESUMEN DE PRODUCTOS</Text>
              {items.map((item, index) => (
                <Row key={index} style={itemRow}>
                  <Column style={itemCol}>
                    <Text style={itemName}>{item.name || item.titulo} x {item.quantity || item.cantidad}</Text>
                  </Column>
                  <Column align="right">
                    <Text style={itemPrice}>${item.unit_amount?.value || item.precio}</Text>
                  </Column>
                </Row>
              ))}
            </Section>

            <Hr style={hr} />

            <Row>
              <Column>
                <Text style={totalLabel}>TOTAL</Text>
              </Column>
              <Column align="right">
                <Text style={totalValue}>{total} MXN</Text>
              </Column>
            </Row>

            <Hr style={hr} />

            <Section style={shippingSection}>
              <Text style={label}>DIRECCIÓN DE ENVÍO</Text>
              <Text style={addressText}>
                {address.calle}<br />
                Col. {address.colonia}<br />
                {address.ciudad}, {address.estado} CP {address.cp}
              </Text>
            </Section>

            <Section style={footer}>
              <Text style={footerText}>
                Si tienes dudas sobre tu pedido, contáctanos a{" "}
                <Link href="mailto:contacto@capalsa.com" style={link}>
                  contacto@capalsa.com
                </Link>
              </Text>
              <Text style={footerBrand}>© 2026 Capalsa. Productos originales desde USA.</Text>
            </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default OrderConfirmationEmail;

const main = {
  backgroundColor: "#fbf9f8",
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "40px 20px",
  maxWidth: "600px",
};

const header = {
  textAlign: "center" as const,
  paddingBottom: "40px",
};

const logo = {
  fontSize: "24px",
  fontWeight: "900",
  color: "#00386c",
  letterSpacing: "0.2em",
  margin: "0",
};

const content = {
  backgroundColor: "#ffffff",
  borderRadius: "24px",
  padding: "40px",
  border: "1px solid #c4c8ce33",
};

const h1 = {
  fontSize: "28px",
  fontWeight: "900",
  color: "#1b1c1c",
  lineHeight: "1.2",
  margin: "0 0 20px",
  letterSpacing: "-0.02em",
};

const text = {
  fontSize: "16px",
  color: "#44494e",
  lineHeight: "24px",
  margin: "0 0 30px",
};

const orderInfo = {
  backgroundColor: "#f5f3f3",
  borderRadius: "16px",
  padding: "20px",
  marginBottom: "30px",
};

const label = {
  fontSize: "10px",
  fontWeight: "900",
  color: "#74787e",
  letterSpacing: "0.2em",
  margin: "0 0 8px",
};

const orderId = {
  fontSize: "20px",
  fontWeight: "900",
  color: "#00386c",
  margin: "0",
};

const hr = {
  borderColor: "#c4c8ce33",
  margin: "30px 0",
};

const itemRow = {
  marginBottom: "16px",
};

const itemCol = {
  paddingRight: "20px",
};

const itemName = {
  fontSize: "14px",
  fontWeight: "700",
  color: "#1b1c1c",
  margin: "0",
};

const itemPrice = {
  fontSize: "14px",
  fontWeight: "700",
  color: "#44494e",
  margin: "0",
};

const totalLabel = {
  fontSize: "16px",
  fontWeight: "900",
  color: "#1b1c1c",
};

const totalValue = {
  fontSize: "24px",
  fontWeight: "900",
  color: "#00386c",
};

const shippingSection = {
  marginBottom: "40px",
};

const addressText = {
  fontSize: "14px",
  color: "#44494e",
  lineHeight: "20px",
  margin: "0",
};

const footer = {
  textAlign: "center" as const,
};

const footerText = {
  fontSize: "12px",
  color: "#74787e",
  margin: "0 0 8px",
};

const footerBrand = {
  fontSize: "10px",
  fontWeight: "700",
  color: "#c4c8ce",
  textTransform: "uppercase" as const,
  letterSpacing: "0.1em",
};

const link = {
  color: "#00386c",
  textDecoration: "underline",
};
