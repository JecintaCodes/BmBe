"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VERIFICATIONEMAILtEMPLATE = void 0;
exports.VERIFICATIONEMAILtEMPLATE = `
<!DOCTYPE html>
<html>
  <head>
    <title>Welcome to Boundary Market</title>
    <style>
      /* styles */
    </style>
  </head>
  <body>
    <main>
      <table
        width="100%"
        border="0"
        cellpadding="0"
        cellspacing="0"
        bgcolor="#f5f6fa"
      >
        <tr>
          <td>
            <table style="width: 100%; max-width: 620px; margin: 0 auto">
              <tbody>
                <tr style="width:100%; height:50vh; display:flex; justify-content:center;">
                  <td style="width:98%; height:100%; ">
                    <img style="width:100%; height:100%;"
                      src="https://res.cloudinary.com/dieqi3v3a/image/upload/v1731057240/260376be-decf-46a6-895a-edab4c5388e1_1_kvxyea.jpg"
                      alt="logo"
                    />
                  </td>
                </tr>
                <tr>
                  <td>
                    <h2>Verify Your E-Mail Address</h2>
                    <p>Hi {name},</p>
                    <p>
                      Welcome! You are receiving this email because you have
                      registered on our site.
                    </p>
                    <p>Click the button below to activate your account.</p>
                    <p>This is your verification token: {verifyToken}</p>
                    <a
                      href="{verificationLink}"
                      style="
                        background-color: #141414;
                        border-radius: 4px;
                        color: #ffffff;
                        display: inline-block;
                        font-size: 13px;
                        font-weight: 600;
                        line-height: 44px;
                        text-align: center;
                        text-decoration: none;
                        text-transform: uppercase;
                        padding: 0 30px;
                      "
                      >Verify Email</a
                    >
                  </td>
                </tr>
               
                <tr>
                  <td>
                    <p>
                      If you did not make this request, please contact us or
                      ignore this message.
                    </p>
                    <p>
                      This is an automatically generated email. Please do not
                      reply to this email. If you face any issues, please
                      contact us at
                      <a href="#">onyemaobijecintaugochi@gmail.com</a>
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </table>
    </main>
  </body>
</html>

`;
