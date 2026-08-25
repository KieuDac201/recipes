export function generateVerificationEmailHtml(verificationUrl: string): string {
  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Kích Hoạt Tài Khoản — Bếp Phương</title>
</head>
<body style="margin: 0; padding: 0; background-color: #faf9f5; font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1b1c1a; -webkit-font-smoothing: antialiased;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #faf9f5; padding: 40px 16px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 540px; background-color: #ffffff; border-radius: 24px; overflow: hidden; border: 1px solid #efeeea; box-shadow: 0 10px 30px rgba(255, 107, 107, 0.08);">
          
          <!-- Top Coral Accent Bar -->
          <tr>
            <td style="height: 6px; background-color: #ff6b6b;"></td>
          </tr>

          <!-- Header / Brand Logo -->
          <tr>
            <td align="center" style="padding: 36px 32px 16px;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 800; color: #ae2f34; letter-spacing: -0.5px; font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, Arial, sans-serif;">
                Bếp Phương
              </h1>
              <p style="margin: 4px 0 0; font-size: 13px; font-weight: 600; color: #8c706f; text-transform: uppercase; letter-spacing: 1px;">
                Lan Tỏa Đam Mê Ẩm Thực
              </p>
            </td>
          </tr>

          <!-- Icon Badge -->
          <tr>
            <td align="center" style="padding: 10px 32px 20px;">
              <div style="display: inline-block; width: 68px; height: 68px; line-height: 68px; border-radius: 50%; background-color: #ffdad8; text-align: center;">
                <span style="font-size: 32px;">✨</span>
              </div>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 0 36px 24px; text-align: center;">
              <h2 style="margin: 0 0 12px; font-size: 22px; font-weight: 700; color: #1b1c1a;">
                Chào mừng bạn đến với Bếp Phương!
              </h2>
              <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #584140;">
                Cảm ơn bạn đã đăng ký tài khoản. Vui lòng bấm vào nút bên dưới để xác thực địa chỉ email và kích hoạt tài khoản của bạn:
              </p>
            </td>
          </tr>

          <!-- CTA Button (Magic Link) -->
          <tr>
            <td align="center" style="padding: 12px 36px 28px;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="border-radius: 14px; background-color: #ff6b6b; box-shadow: 0 4px 14px rgba(255, 107, 107, 0.35);">
                    <a href="${verificationUrl}" target="_blank" style="display: inline-block; padding: 16px 36px; font-size: 16px; font-weight: 700; color: #ffffff; text-decoration: none; border-radius: 14px; letter-spacing: 0.3px;">
                      👉 Kích Hoạt Tài Khoản Ngay
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Fallback Raw Link -->
          <tr>
            <td style="padding: 0 36px 24px; text-align: center;">
              <p style="margin: 0 0 8px; font-size: 12px; color: #8c706f;">
                Nếu nút bấm trên không hoạt động, bạn hãy sao chép và dán liên kết sau vào trình duyệt:
              </p>
              <p style="margin: 0; font-size: 11px; word-break: break-all; color: #ff6b6b;">
                <a href="${verificationUrl}" style="color: #ae2f34; text-decoration: underline;">
                  ${verificationUrl}
                </a>
              </p>
            </td>
          </tr>

          <!-- Expiration Notice -->
          <tr>
            <td style="padding: 0 36px 32px; text-align: center;">
              <div style="background-color: #fff9e6; border-radius: 12px; padding: 12px 16px; border: 1px solid #ffd166; font-size: 13px; color: #785a00; line-height: 1.5;">
                ⏰ Liên kết kích hoạt này có hiệu lực trong vòng <strong>24 giờ</strong>.
              </div>
              <p style="margin: 16px 0 0; font-size: 13px; color: #8c706f; line-height: 1.5;">
                Nếu bạn không thực hiện đăng ký tài khoản này, vui lòng bỏ qua email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f4f4f0; padding: 24px 36px; text-align: center; border-top: 1px solid #efeeea;">
              <p style="margin: 0; font-size: 12px; color: #8c706f;">
                © 2026 Bếp Phương. Nơi lan tỏa niềm đam mê ẩm thực.
              </p>
              <p style="margin: 6px 0 0; font-size: 11px; color: #8c706f;">
                Email này được gửi tự động, vui lòng không trả lời trực tiếp.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}
