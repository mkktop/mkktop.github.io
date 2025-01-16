import requests
import sys
argvs = sys.argv
nuber = int(argvs[1]) if len(argvs) >= 2 else 0
if nuber == 0:
    print("请输入图片数量")
    exit()
# 请求的 URL 和 Query 参数
url = 'https://image.kaikun.top/upload'

# Query 参数
params = {
    'authCode': '373737',            # 替换为实际的认证码
    'serverCompress': 'false',               # 是否开启服务端压缩
    'uploadChannel': 'telegram',            # 上传渠道 (telegram 或 cfr2)
    'autoRetry': 'true',                    # 是否开启失败重试
    'uploadNameType': 'default',            # 文件命名方式 (default, index, origin)
    'returnFormat': 'full',              # 返回链接格式 (default 或 full)
}


# 请求头
headers = {
    'User-Agent': 'Apifox/1.0.0 (https://apifox.com)',  # 设置 User-Agent
}


def image_up(addr):
    # 文件路径
    file_path = addr
    # 上传的文件数据
    files = {
        'file': open(file_path, 'rb')  # 以二进制模式打开文件
    }

    # 发送 POST 请求
    response = requests.post(url, params=params, headers=headers, files=files)

    # 解析响应
    if response.status_code == 200:
        try:
        # 尝试将响应解析为 JSON
            result = response.json()
            if result and isinstance(result, list):
            # 获取图片链接
                image_link = result[0].get('src', '')
                print('上传成功，图片链接:', image_link)
                image_link1 = "![image]("+image_link+")"
                output_file = "image.md"
                with open(output_file, "a", encoding="utf-8") as file:
                    file.write(image_link1 +"\r\n")
            else:
                print('上传成功，但响应格式不正确:', result)
        except ValueError:
            print('上传成功，但无法解析为 JSON:', response.text)
    else:
        print('上传失败，状态码:', response.status_code)
        print('错误信息:', response.text)

i = 1

while i <= nuber:
    if i < 10:
        addr = '00' + str(i) + '.jpg'
    elif i < 100:
        addr = '0' + str(i) + '.jpg'
    else:
        addr = str(i) + '.jpg'       
    image_up(addr)
    i += 1    