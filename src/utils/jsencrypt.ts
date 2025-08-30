import { JSEncrypt } from "jsencrypt";

// 创建JSEncrypt实例
const encryptor = new JSEncrypt();

// 设置公钥（这里使用示例公钥，实际项目中应该从服务器获取）
encryptor.setPublicKey(`-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDlOJu6TyygqxfWT7eLtGDwajtN
FOb9I5XRb6khyfD1Yt3YiCgQWMNW649887VGJiGr/L5i2osbl8C9+WJTeucF+S76
xFxdU6jE0NQ+Z+zEdhUTooNRaY5nZiu5PgDB0ED/ZKBUSLKL7eibMxZtMlUDHjm4
gwQco1KRMDSmXSMkDwIDAQAB
-----END PUBLIC KEY-----`);

// 设置私钥（这里使用示例私钥，实际项目中应该从服务器获取）
encryptor.setPrivateKey(`-----BEGIN RSA PRIVATE KEY-----
MIICXQIBAAKBgQDlOJu6TyygqxfWT7eLtGDwajtNFOb9I5XRb6khyfD1Yt3YiCgQ
WMNW649887VGJiGr/L5i2osbl8C9+WJTeucF+S76xFxdU6jE0NQ+Z+zEdhUTooNR
aY5nZiu5PgDB0ED/ZKBUSLKL7eibMxZtMlUDHjm4gwQco1KRMDSmXSMkDwIDAQAB
AoGAfY9LpnuWK5Bs50UVep5c93SJdUi82u7yMx4iHFMc/Z2hfenfYEzu+57fI4fv
xTQ//5DbzRR/XKb8ulNv6+CHyPF31xk7YOBfkGI8qjLoq06V+FyBfDSwL8KbLyeH
m7KUZnLNQbk8yGLzB3iYKkRHlmUanQGaNMIJziWOkN+N9dECQQD0ONYRNZeuM8zd
8XJTSdcIX4a3gy3GGCJxOzv16XHxD03GW6UNLmfPwenKu+cdrQeaqEixrCejXdAF
z/7+BSMpAkEA8EaSOeP5Xr3ZrbiKzi6TGMwHMvC7HdJxaBJbVRfApVvGBIK55jXT
5V3RnAKREPVNS5ora5IYV//9tkuBSqJ57QJBAO6WIQz9+7YqGEkEX0lLcQVpc7v4
44Y3r22y/N+w6+S5H42aHgjDmI4mXj3N74y6D6YkOxlYb3Vl5vL1Yl8ExsECQDEG
r78Yk+OgiFChQRMKexIc9kFA2vPzA43lQLexJ357jS851s7o57Bqz8gIiMwgj+31
GnMQ9lzc0wNAHj2FQ4IgvuECQBAhjQKRuQ418q0foWu1yfKqjF/OGb5v9vz4cE/0
9tER7F3s+ZnktfrKhvTVm9kF9y9kGDFU993kLmF5dMEGkqD8G9U=
-----END RSA PRIVATE KEY-----`);

/**
 * 加密数据
 * @param data 需要加密的数据
 * @returns 加密后的数据
 */
export function encrypt(data: string): string {
  return encryptor.encrypt(data) || "";
}

/**
 * 解密数据
 * @param data 需要解密的数据
 * @returns 解密后的数据
 */
export function decrypt(data: string): string {
  return encryptor.decrypt(data) || "";
}