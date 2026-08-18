export function generateOtpEmailHtml(otp: string): string {
  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Mã Xác Thực Đặt Lại Mật Khẩu — Bếp Phương</title>
</head>
<body style="margin: 0; padding: 0; background-color: #faf9f5; font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1b1c1a; -webkit-font-smoothing: antialiased;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #faf9f5; padding: 40px 16px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 520px; background-color: #ffffff; border-radius: 24px; overflow: hidden; border: 1px solid #efeeea; box-shadow: 0 10px 30px rgba(255, 107, 107, 0.08);">
          
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
              <div style="display: inline-block; width: 64px; height: 64px; line-height: 64px; border-radius: 50%; background-color: #ffdad8; text-align: center;">
                <span style="font-size: 28px;">🔐</span>
              </div>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 0 36px 24px; text-align: center;">
              <h2 style="margin: 0 0 12px; font-size: 22px; font-weight: 700; color: #1b1c1a;">
                Mã Xác Thực Đặt Lại Mật Khẩu
              </h2>
              <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #584140;">
                Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Vui lòng sử dụng mã OTP gồm 6 chữ số dưới đây để tiếp tục:
              </p>
            </td>
          </tr>

          <!-- OTP Display Box -->
          <tr>
            <td align="center" style="padding: 0 36px 28px;">
              <div style="background-color: #faf9f5; border: 2px dashed #ff6b6b; border-radius: 16px; padding: 20px 24px; text-align: center;">
                <div style="font-size: 12px; font-weight: 700; color: #8c706f; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 6px;">
                  Mã OTP Xác Thực
                </div>
                <div style="font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #ae2f34; font-family: 'Plus Jakarta Sans', monospace, sans-serif; padding-left: 8px;">
                  ${otp}
                </div>
              </div>
            </td>
          </tr>

          <!-- Expiration Notice & Security Warning -->
          <tr>
            <td style="padding: 0 36px 32px; text-align: center;">
              <div style="background-color: #fff9e6; border-radius: 12px; padding: 12px 16px; border: 1px solid #ffd166; font-size: 13px; color: #785a00; line-height: 1.5;">
                ⏰ Mã này sẽ hết hạn sau <strong>10 phút</strong>.
              </div>
              <p style="margin: 16px 0 0; font-size: 13px; color: #8c706f; line-height: 1.5;">
                Nếu bạn không thực hiện yêu cầu này, xin vui lòng bỏ qua email hoặc liên hệ hỗ trợ để bảo mật tài khoản.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f4f4f0; padding: 24px 36px; text-align: center; border-top: 1px solid #efeeea;">
              <p style="margin: 0; font-size: 12px; color: #8c706f;">
                © 2024 Bếp Phương. Nơi lan tỏa niềm đam mê ẩm thực.
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
</html>`;
}
