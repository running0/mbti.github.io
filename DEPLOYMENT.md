# MBTI测试系统部署指南

本指南将帮助你将MBTI测试系统部署到云端，让任何人都可以访问。

## 部署架构

- **前端**：GitHub Pages（免费静态托管）
- **后端**：Render.com（免费Python托管）

## 前置要求

1. GitHub账号
2. Render.com账号
3. Git已安装

---

## 第一部分：创建GitHub仓库

### 1. 创建新仓库

1. 登录GitHub
2. 点击右上角的 "+" 按钮
3. 选择 "New repository"
4. 填写仓库信息：
   - Repository name: `mbti-test-system`
   - Description: `MBTI人格测试系统`
   - 选择 "Public" 或 "Private"
5. 点击 "Create repository"

### 2. 上传代码到GitHub

在项目目录中执行以下命令：

```bash
# 初始化Git仓库
git init

# 添加所有文件
git add .

# 提交更改
git commit -m "Initial commit"

# 添加远程仓库（替换YOUR_USERNAME为你的GitHub用户名）
git remote add origin https://github.com/YOUR_USERNAME/mbti-test-system.git

# 推送到GitHub
git branch -M main
git push -u origin main
```

---

## 第二部分：部署后端到Render

### 1. 注册Render账号

1. 访问 [https://render.com](https://render.com)
2. 点击 "Sign Up"
3. 使用GitHub账号登录（推荐）

### 2. 创建新的Web服务

1. 登录后，点击 "New +"
2. 选择 "Web Service"
3. 选择 "Connect a repository"
4. 授权GitHub访问你的仓库
5. 选择 `mbti-test-system` 仓库
6. 点击 "Connect"

### 3. 配置服务

在配置页面填写以下信息：

- **Name**: `mbti-test-backend`
- **Region**: 选择离你最近的区域
- **Branch**: `main`
- **Runtime**: `Python 3`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `gunicorn server:app`

### 4. 配置环境变量

在 "Environment" 部分添加：

- **Key**: `PORT`
- **Value**: `10000`

### 5. 选择计划

- 选择 "Free" 计划
- 点击 "Create Web Service"

### 6. 等待部署

- 部署过程需要几分钟
- 部署成功后，你会获得一个URL，例如：`https://mbti-test-backend.onrender.com`

**记下这个URL，后面会用到！**

---

## 第三部分：部署前端到GitHub Pages

### 1. 启用GitHub Pages

1. 进入你的GitHub仓库
2. 点击 "Settings"
3. 在左侧菜单中找到 "Pages"
4. 在 "Build and deployment" 部分：
   - Source: 选择 "Deploy from a branch"
   - Branch: 选择 `main` 和 `/ (root)`
5. 点击 "Save"

### 2. 等待部署

- GitHub会自动部署你的网站
- 几分钟后，你会在Pages页面看到访问URL，例如：`https://YOUR_USERNAME.github.io/mbti-test-system/`

---

## 第四部分：配置前端连接后端

### 1. 修改前端API地址

由于前端和后端部署在不同的域名，需要配置CORS和API地址。

#### 方法A：使用环境变量（推荐）

创建一个配置文件 `config.js`：

```javascript
// config.js
window.API_BASE_URL = 'https://mbti-test-backend.onrender.com';
```

然后在 `index.html` 中引入：

```html
<script src="config.js"></script>
```

修改 `index.html` 中的API调用：

```javascript
// 使用配置的API地址
const API_BASE_URL = window.API_BASE_URL || window.location.origin;
```

#### 方法B：直接修改index.html

在 `index.html` 中找到API配置部分，修改为：

```javascript
// API配置 - 替换为你的Render后端URL
const API_BASE_URL = 'https://mbti-test-backend.onrender.com';
```

### 2. 提交更改

```bash
git add .
git commit -m "Configure API URL for production"
git push origin main
```

---

## 第五部分：测试部署

### 1. 测试后端

访问你的Render后端URL：
```
https://mbti-test-backend.onrender.com/api/statistics
```

应该返回JSON数据：
```json
{
  "totalTests": 0,
  "typeCounts": {}
}
```

### 2. 测试前端

访问你的GitHub Pages URL：
```
https://YOUR_USERNAME.github.io/mbti-test-system/
```

### 3. 完整测试

1. 在前端页面输入姓名并完成测试
2. 检查后端是否接收到数据
3. 访问管理员界面查看数据

---

## 故障排除

### 问题1：CORS错误

如果遇到跨域错误，确保：

1. 后端已正确配置CORS
2. API地址配置正确
3. Render服务正在运行

### 问题2：数据未保存

检查：

1. 浏览器控制台是否有错误
2. 后端日志（Render Dashboard）
3. API地址是否正确

### 问题3：Render部署失败

检查：

1. `requirements.txt` 文件是否完整
2. `server.py` 文件是否正确
3. 启动命令是否正确

### 问题4：GitHub Pages部署失败

检查：

1. 仓库是否为Public（Private仓库需要Pro账户）
2. 分支设置是否正确
3. 文件路径是否正确

---

## 维护和更新

### 更新代码

1. 修改本地代码
2. 提交到GitHub：
   ```bash
   git add .
   git commit -m "Update code"
   git push origin main
   ```
3. Render会自动重新部署后端
4. GitHub Pages会自动重新部署前端

### 查看日志

- **Render**: 在Dashboard中查看服务日志
- **GitHub Pages**: 在仓库的Actions中查看部署日志

---

## 安全建议

### 1. 添加管理员认证

当前管理员界面没有身份验证，建议添加：

```python
# 在server.py中添加
from functools import wraps

def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth = request.authorization
        if not auth or auth.username != 'admin' or auth.password != 'your_password':
            return jsonify({'error': 'Unauthorized'}), 401
        return f(*args, **kwargs)
    return decorated

# 保护管理员路由
@app.route('/api/test-results', methods=['DELETE'])
@require_auth
def delete_test_result(result_id):
    # ...
```

### 2. 使用环境变量存储敏感信息

```python
import os

ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'default_password')
```

### 3. 定期备份数据

Render的免费tier数据会定期清理，建议：

1. 定期导出 `test-results.json`
2. 使用数据库服务（如PostgreSQL）替代JSON文件

---

## 成本说明

- **GitHub Pages**: 完全免费
- **Render Free Tier**:
  - 512MB RAM
  - 0.1 CPU
  - 每月750小时运行时间
  - 服务会在15分钟无活动后休眠
  - 休眠后首次访问需要约30秒唤醒

### 升级选项

如果需要更好的性能，可以升级Render计划：
- **Starter**: $7/月
- **Standard**: $25/月
- **Pro**: $100/月

---

## 其他部署选项

### 1. Vercel

Vercel也支持Python部署，但需要配置：

```javascript
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "server.py",
      "use": "@vercel/python"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/server.py"
    }
  ]
}
```

### 2. Railway.app

Railway提供类似的免费tier，配置方式与Render类似。

### 3. PythonAnywhere

PythonAnywhere有免费tier，但功能有限。

---

## 联系和支持

如果遇到问题：

1. 查看Render和GitHub的官方文档
2. 检查项目的GitHub Issues
3. 查看Render Dashboard中的日志

---

## 总结

完成以上步骤后，你将拥有：

✅ 一个可以公开访问的MBTI测试网站
✅ 自动保存用户测试数据
✅ 管理员界面查看统计数据
✅ 完全免费的部署方案

祝部署顺利！