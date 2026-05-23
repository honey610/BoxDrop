import nodemailer from "nodemailer";

const transporter= nodemailer.createTransport({ 
  //   service: 'Gmail', 
  //    pool: true,        // 🔥 reuse connections
  // maxConnections: 5,
  // maxMessages: 100,
  //  rateLimit: 10,
  //   auth: { 
  //       user: process.env.EMAIL_USER, 
  //       pass: process.env.EMAIL_PASS 
  //   } 
  host: "smtp.gmail.com",
  port: 465,
  secure: true,

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },

  connectionTimeout: 30000,
  greetingTimeout: 30000,
  socketTimeout: 30000,
});

await transporter.verify();

console.log("SMTP READY");

export const sendOtpEmail = async ({ to, otp, boxTitle }) => {
   console.log("📧 sendOtpEmail CALLED with:", { to, otp, boxTitle });
 const info =await transporter.sendMail({
    from: `"BoxDrop" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your Delivery OTP",
    html: `
      <div style="font-family: Arial; line-height: 1.6">
        <h2>Delivery Confirmation</h2>
        <p>Your order for <strong>${boxTitle}</strong> is out for delivery.</p>
        <p><strong>Your OTP:</strong></p>
        <h1 style="letter-spacing: 4px">${otp}</h1>
        <p>This OTP is valid for 24 hours.</p>
        <p>If you didn't request this, ignore this email.</p>
      </div>
    `,
  });
  console.log("✅ Email SENT:", info.response);
};

export const sendDeliveryConfirmationEmail = async ({
  to,
  boxTitle,
  user,
}) => {
  console.log("📧 sendDeliveryConfirmationEmail CALLED with:", {
    to,
    boxTitle,
    user,
  });
  await transporter.sendMail({
    from: `"BoxDrop" <${process.env.EMAIL_USER}>`,
    to, // must be email string
    subject: "📦 Delivery Confirmed",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6">
        <h2>Hi ${user},</h2>

        <p>
          Your order for <strong>${boxTitle}</strong> has been
          <span style="color: green; font-weight: bold;">successfully delivered</span>.
        </p>

        <p>
          Thank you for choosing <strong>BoxDrop</strong> 🙌
        </p>

        <hr />
        <p style="font-size: 12px; color: #777">
          If you didn’t receive this order, please contact support immediately.
        </p>
      </div>
    `,
  });
  console.log("✅ Email SENT");
};

export const sendDeliveryConfirmationEmailtoSeller = async ({
  to,
  boxTitle,
  sellerName,
}

) => {
  console.log("📧 sendDeliveryConfirmationEmailtoSeller CALLED with:")
  await transporter.sendMail({
    from: `"BoxDrop" <${process.env.EMAIL_USER}>`,  
    to, // must be email string
    subject: "📦 Order Delivered Successfully",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6">
        <h2>Hi ${sellerName},</h2> 
        <p>
          Your order for <strong>${boxTitle}</strong> has been
          <span style="color: green; font-weight: bold;">successfully delivered to the customer</span>.
        </p>
        <p>
          Thank you for choosing <strong>BoxDrop</strong> 🙌
        </p>
        <hr />
        <p style="font-size: 12px; color: #777">
          If you have any questions, please contact support.  
        </p>
      </div>
    `,
  });
  console.log("✅ Email SENT");
};

export const sendOrderConfirmationEmail = async ({ to, boxTitle, user }) => {
  console.log("📧 sendOrderConfirmationEmail CALLED with:", {
    to,
    boxTitle,
    user,
  });
  await transporter.sendMail({
    from: `"BoxDrop" <${process.env.EMAIL_USER}>`,
    to,
    subject: "📦 Order Confirmation",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6">
        <h2>Hi ${user.name},</h2>
        <p>
          Your order for <strong>${boxTitle}</strong> has been
          <span style="color: green; font-weight: bold;">successfully placed</span>.
        </p>
        <p>
          We will notify you once your box is shipped.
        </p>
        <p>
          Thank you for choosing <strong>BoxDrop</strong> 🙌
        </p>
        <hr />
        <p style="font-size: 12px; color: #777">
          If you have any questions, please contact support.
        </p>
      </div>
    `,
  });
  console.log("✅ Email SENT");
}

export const sendRenewalPaymentLinkEmail = async ({
  to,
  userName,
  boxTitle,
  amount,
  paymentLink,
  expiryDate,
}) => {
  console.log("📧 sendRenewalPaymentLinkEmail CALLED with:", {
    to,
    userName,
    boxTitle,
    amount,
  });
  await transporter.sendMail({
    from: `"BoxDrop" <${process.env.EMAIL_USER}>`,
    to,
    subject: `💳 Subscription Renewal Payment - ${boxTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6">
        <h2>Hi ${userName || "Customer"},</h2>
        <p>
          Your subscription for <strong>${boxTitle}</strong> is due for renewal.
        </p>
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Payment Details</h3>
          <p><strong>Amount:</strong> ₹${amount}</p>
          <p><strong>Expiry:</strong> ${expiryDate}</p>
        </div>
        <p>
          <a href="${paymentLink}" 
             style="background-color: #4CAF50; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-size: 16px;">
            Pay Now
          </a>
        </p>
        <p style="font-size: 12px; color: #777; margin-top: 20px;">
          This payment link will expire on ${expiryDate}. Please complete your payment before that date to continue your subscription without interruption.
        </p>
        <hr />
        <p>
          Thank you for choosing <strong>BoxDrop</strong> 🙌
        </p>
        <p style="font-size: 12px; color: #777">
          If you have any questions, please contact support.
        </p>
      </div>
    `,
  });
  console.log("✅ Renewal payment link email SENT");
}
