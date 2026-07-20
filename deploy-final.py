#!/usr/bin/env python3
"""
完整部署：静态文件 + Netlify Functions
关键：Functions 必须打包成 zip 上传，并指定 runtime
"""
import os
import json
import hashlib
import zipfile
import io
import urllib.request
import urllib.error

NETLIFY_TOKEN = "nfp_EYVtE2BqwVYA6qkziYSsaXAJvZvuP7cr9c09"
SITE_ID = "162df548-1c99-489b-8dd1-b2cfb9d9f927"
DIST_DIR = "/workspace/medical-workflow-platform/dist"
FUNCTIONS_DIR = "/workspace/medical-workflow-platform/netlify/functions"

def api(method, url, data=None, headers=None, is_json=True):
    if headers is None:
        headers = {}
    headers["Authorization"] = f"Bearer {NETLIFY_TOKEN}"
    if data is not None and is_json and "Content-Type" not in headers:
        headers["Content-Type"] = "application/json"
        data = json.dumps(data).encode()
    req = urllib.request.Request(url, data=data, method=method, headers=headers)
    try:
        with urllib.request.urlopen(req) as resp:
            body = resp.read().decode()
            if is_json and body:
                return resp.status, json.loads(body)
            return resp.status, body
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        print(f"  HTTP {e.code}: {body[:300]}")
        return e.code, body

def sha1_bytes(data):
    return hashlib.sha1(data).hexdigest()

def sha1_file(filepath):
    h = hashlib.sha1()
    with open(filepath, "rb") as f:
        while chunk := f.read(8192):
            h.update(chunk)
    return h.hexdigest()

# ===== 1. 收集静态文件 =====
print("=== 1. 收集静态文件 ===")
path_to_sha = {}
sha_to_content = {}
for root, dirs, filenames in os.walk(DIST_DIR):
    for fn in filenames:
        filepath = os.path.join(root, fn)
        relpath = "/" + os.path.relpath(filepath, DIST_DIR)
        sha = sha1_file(filepath)
        path_to_sha[relpath] = sha
        with open(filepath, "rb") as f:
            sha_to_content[sha] = f.read()
print(f"静态文件: {len(path_to_sha)} 个")

# ===== 2. 打包 Functions 为 zip =====
print("\n=== 2. 打包 Functions ===")
functions_payload = {}
func_zips = {}  # name -> zip bytes
func_shas = {}  # name -> sha
for fn in os.listdir(FUNCTIONS_DIR):
    filepath = os.path.join(FUNCTIONS_DIR, fn)
    if not os.path.isfile(filepath):
        continue
    name = os.path.splitext(fn)[0]
    
    # 打包成 zip，文件名保持原样（generate.ts）
    zip_buffer = io.BytesIO()
    with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zf:
        zf.write(filepath, fn)
    zip_bytes = zip_buffer.getvalue()
    
    func_sha = sha1_bytes(zip_bytes)
    functions_payload[name] = {
        "sha": func_sha,
        "runtime": "js",  # 改成 js 而不是 deno
    }
    func_zips[name] = zip_bytes
    func_shas[name] = func_sha
    print(f"  {name}: {fn} → zip ({len(zip_bytes)} bytes, sha={func_sha[:12]}...)")

# ===== 3. 创建部署 =====
print("\n=== 3. 创建部署 ===")
status, deploy = api(
    "POST",
    f"https://api.netlify.com/api/v1/sites/{SITE_ID}/deploys",
    data={
        "files": path_to_sha,
        "functions": functions_payload,
    },
)
deploy_id = deploy["id"]
required_files = deploy.get("required", [])
required_funcs = deploy.get("required_functions", [])
print(f"部署 ID: {deploy_id}")
print(f"状态: {deploy.get('state')}")
print(f"需要上传文件: {len(required_files)} 个")
print(f"需要上传函数: {len(required_funcs) if required_funcs else 0} 个")

# ===== 4. 上传静态文件 =====
print("\n=== 4. 上传静态文件 ===")
sha_to_path = {sha: path for path, sha in path_to_sha.items()}
for sha in required_files:
    if sha not in sha_to_path:
        print(f"  找不到文件 sha={sha[:12]}...")
        continue
    file_path = sha_to_path[sha]
    content = sha_to_content[sha]
    upload_path = file_path.lstrip("/")
    url = f"https://api.netlify.com/api/v1/deploys/{deploy_id}/files/{upload_path}"
    status, _ = api("PUT", url, data=content, is_json=False,
                    headers={"Content-Type": "application/octet-stream"})
    print(f"  {file_path}: {status}")

# ===== 5. 上传 Functions (zip 格式) =====
print("\n=== 5. 上传 Functions (zip 格式) ===")
if required_funcs:
    for func_info in required_funcs:
        func_sha = func_info["sha"]
        # 根据 sha 找到对应的函数名
        func_name = None
        for name, sha in func_shas.items():
            if sha == func_sha:
                func_name = name
                break
        if not func_name:
            print(f"  找不到函数 sha={func_sha[:12]}...")
            continue
        
        zip_data = func_zips[func_name]
        url = f"https://api.netlify.com/api/v1/deploys/{deploy_id}/functions/{func_name}"
        status, resp = api(
            "PUT", url, data=zip_data, is_json=False,
            headers={"Content-Type": "application/zip"},
        )
        print(f"  {func_name} ({len(zip_data)} bytes): {status}")
else:
    print("  无需上传函数")

# ===== 6. 等待部署完成 =====
print("\n=== 6. 等待部署完成 ===")
import time
final_state = None
for i in range(60):
    time.sleep(3)
    status, info = api("GET", f"https://api.netlify.com/api/v1/deploys/{deploy_id}")
    if isinstance(info, dict):
        state = info.get("state", "unknown")
        if i % 5 == 0 or state in ("ready", "published", "error"):
            print(f"  第 {(i+1)*3}s: {state}")
        if state in ("ready", "published"):
            final_state = state
            print(f"\n✅ 部署成功！最终状态: {state}")
            break
        if state == "error":
            print(f"\n❌ 部署失败")
            err = info.get("error_message", "")
            print(f"错误: {err[:500]}")
            # 查看日志
            log_url = info.get("log_access_attributes", {}).get("url", "")
            if log_url:
                print(f"日志: {log_url}")
            exit(1)

print(f"\n🎉 完成！")
print(f"站点: https://medical-workflow-platform.netlify.app")
print(f"API:  https://medical-workflow-platform.netlify.app/.netlify/functions/generate")
