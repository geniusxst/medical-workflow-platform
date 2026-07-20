import urllib.request
import urllib.error
import json

NETLIFY_TOKEN = "nfp_EYVtE2BqwVYA6qkziYSsaXAJvZvuP7cr9c09"
SITE_ID = "162df548-1c99-489b-8dd1-b2cfb9d9f927"

# 1. 用 POST 设置环境变量
url = f"https://api.netlify.com/api/v1/sites/{SITE_ID}/env"
data = json.dumps({
    "key": "DEEPSEEK_API_KEY",
    "values": [{"value": "sk-d2cbf5b8859247c885ab1237c1e39647", "context": "all"}]
}).encode()

req = urllib.request.Request(url, data=data, method="POST", headers={
    "Authorization": f"Bearer {NETLIFY_TOKEN}",
    "Content-Type": "application/json",
})

try:
    with urllib.request.urlopen(req) as resp:
        print(f"POST 状态码: {resp.status}")
        body = resp.read().decode()
        print(f"响应体前500字符: {body[:500]}")
except urllib.error.HTTPError as e:
    print(f"POST 失败: {e.code}")
    print(f"错误响应: {e.read().decode()[:500]}")

# 2. 立刻验证
print("\n=== 验证环境变量 ===")
req2 = urllib.request.Request(
    f"https://api.netlify.com/api/v1/sites/{SITE_ID}/env",
    headers={"Authorization": f"Bearer {NETLIFY_TOKEN}"},
)
with urllib.request.urlopen(req2) as resp:
    env_list = json.loads(resp.read())
    print(f"环境变量数量: {len(env_list)}")
    for e in env_list:
        print(f"  - {e}")
