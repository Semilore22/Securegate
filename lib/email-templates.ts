export function getVerificationEmailHtml(confirmLink: string): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </head>
    <body style="background-color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen-Sans,Ubuntu,Cantarell,'Helvetica Neue',sans-serif;margin:0;padding:0;">
      <div style="margin:0 auto;padding:20px 0 48px;max-width:580px;">
        <h1 style="color:#333;font-size:24px;font-weight:bold;padding-top:32px;padding-bottom:32px;">
          SecureGate Verification
        </h1>
        <p style="color:#333;font-size:16px;line-height:26px;">
          Please click the button below to verify your email address.
        </p>
        <a href="${confirmLink}" style="background-color:#3b82f6;border-radius:3px;color:#fff;font-size:16px;text-decoration:none;text-align:center;display:block;width:100%;padding:12px;margin-top:20px;margin-bottom:20px;box-sizing:border-box;">
          Verify Email
        </a>
        <p style="color:#333;font-size:16px;line-height:26px;">
          This link will expire in 15 minutes.
        </p>
      </div>
    </body>
    </html>
  `
}

export function getPasswordResetEmailHtml(resetLink: string): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </head>
    <body style="background-color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen-Sans,Ubuntu,Cantarell,'Helvetica Neue',sans-serif;margin:0;padding:0;">
      <div style="margin:0 auto;padding:20px 0 48px;max-width:580px;">
        <h1 style="color:#333;font-size:24px;font-weight:bold;padding-top:32px;padding-bottom:32px;">
          SecureGate Password Reset
        </h1>
        <p style="color:#333;font-size:16px;line-height:26px;">
          Please click the button below to reset your password. If you didn't request this, you can safely ignore this email.
        </p>
        <a href="${resetLink}" style="background-color:#3b82f6;border-radius:3px;color:#fff;font-size:16px;text-decoration:none;text-align:center;display:block;width:100%;padding:12px;margin-top:20px;margin-bottom:20px;box-sizing:border-box;">
          Reset Password
        </a>
        <p style="color:#333;font-size:16px;line-height:26px;">
          This link will expire in 1 hour.
        </p>
      </div>
    </body>
    </html>
  `
}
