# 快速部署指南

## 5分钟快速部署

### 前提条件
- GitHub账号
- Render.com账号

### 步骤1：上传到GitHub（2分钟）

```bash
# 在项目目录中执行
git init
git add .
git commit -m "Initial commit"
git branch -M main

# 替换YOUR_USERNAME为你的GitHub用户名
git remote add origin https://github.com/YOUR_USERNAME/mbti-test-system.git
git push -u origin main
```

### 步骤2：部署到Render（3分钟）

1. 访问 [https://dashboard.render.com/](https://dashboard.render.com/)
2. 点击 "New +"
3. 选择 "Web Service"
4. 连接你的GitHub仓库
5. 配置：
   - **Name**: `mbti-test-backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn server:app`
   - **Environment Variable**: `PORT` = `10000`
6. 选择 "Free" 计划并创建

### 步骤3：配置前端（1分钟）

1. 复制Render给你的后端URL（如：`https://mbti-test-backend.onrender.com`）
2. 在 `index.html` 中找到这行：
   ```javascript
   const API_BASE_URL = window.location.origin;
   ```
3. 替换为：
   ```javascript
   const API_BASE_URL = 'https://mbti-test-backend.onrender.com';
   ```
4. 提交更改：
   ```bash
   git add .
   git commit -m "Configure API URL"
   git push origin main
   ```

### 完成！

现在你可以：
- 访问你的GitHub Pages URL进行测试
- 访问 `https://mbti-test-backend.onrender.com/admin` 查看管理员界面

---

## 常见问题

### Q: Render部署需要多长时间？
A: 通常需要2-5分钟。

### Q: 如何找到我的GitHub Pages URL？
A: 仓库 → Settings → Pages，页面顶部会显示URL。

### Q: 免费计划有什么限制？
A: 
- 服务会在15分钟无活动后休眠
- 休眠后首次访问需要约30秒唤醒
- 每月750小时运行时间

### Q: 数据会丢失吗？
A: Render免费tier的数据会定期清理，建议定期备份数据。

---

## 需要帮助？

查看详细部署指南：[DEPLOYMENT.md](DEPLOYMENT.md)