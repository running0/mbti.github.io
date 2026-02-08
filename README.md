# MBTI人格测试系统

一个完整的MBTI人格测试系统，包含前端测试页面和后端管理系统。

## 功能特性

### 前端功能
- 用户姓名输入
- 12道MBTI人格测试题目
- 自动计算MBTI类型
- 测试结果展示（类型名称、颜色、描述、emoji）
- 响应式设计，支持移动端和桌面端
- 平滑的动画过渡效果

### 后端功能
- 用户测试数据存储
- 管理员界面查看所有测试结果
- 数据统计（总测试次数、今日测试、最常见类型）
- 搜索和筛选功能
- 删除测试记录

## 技术栈

### 前端
- 纯HTML + CSS + JavaScript
- 响应式设计
- 动画效果

### 后端
- Python Flask
- Flask CORS
- JSON文件存储

## 安装和运行

### 1. 安装依赖

确保已安装Python 3.6+，然后安装Flask和Flask CORS：

```bash
pip install flask flask-cors
```

或者使用requirements.txt：

```bash
pip install -r requirements.txt
```

### 2. 启动服务器

```bash
python server.py
```

服务器将在 `http://localhost:5000` 启动。

### 3. 访问应用

- **测试页面**: http://localhost:5000
- **管理员界面**: http://localhost:5000/admin

## 使用说明

### 用户测试流程
1. 访问测试页面
2. 输入姓名
3. 点击"开始测试"按钮
4. 回答12道选择题
5. 查看测试结果
6. 可选择重新测试

### 管理员功能
1. 访问管理员界面
2. 查看测试统计数据
3. 浏览所有测试记录
4. 搜索特定用户或MBTI类型
5. 删除测试记录
6. 点击"刷新数据"获取最新数据

## API接口

### 保存测试结果
- **URL**: `POST /api/test-results`
- **请求体**:
  ```json
  {
    "name": "用户姓名",
    "mbtiType": "INFJ",
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
  ```
- **响应**: 201 Created

### 获取所有测试结果
- **URL**: `GET /api/test-results`
- **响应**: 200 OK
  ```json
  [
    {
      "id": 1234567890,
      "name": "用户姓名",
      "mbtiType": "INFJ",
      "timestamp": "2024-01-01T00:00:00.000Z"
    }
  ]
  ```

### 删除测试结果
- **URL**: `DELETE /api/test-results/:id`
- **响应**: 200 OK

### 获取统计信息
- **URL**: `GET /api/statistics`
- **响应**: 200 OK
  ```json
  {
    "totalTests": 100,
    "typeCounts": {
      "INFJ": 15,
      "INTJ": 10
    }
  }
  ```

## 数据存储

测试结果存储在 `test-results.json` 文件中，格式如下：

```json
[
  {
    "id": 1234567890,
    "name": "用户姓名",
    "mbtiType": "INFJ",
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
]
```

## 项目结构

```
mbti-test/
├── index.html          # 前端测试页面
├── admin.html          # 管理员界面
├── server.py           # 后端服务器
├── requirements.txt    # Python依赖
├── test-results.json   # 数据存储文件（自动生成）
└── README.md          # 项目说明文档
```

## MBTI类型说明

系统支持所有16种MBTI人格类型：

- **ISTJ**: 物流师型
- **ISFJ**: 守卫者型
- **INFJ**: 提倡者型
- **INTJ**: 建筑师型
- **ISTP**: 鉴赏家型
- **ISFP**: 探险家型
- **INFP**: 调停者型
- **INTP**: 逻辑学家型
- **ESTP**: 企业家型
- **ESFP**: 表演者型
- **ENFP**: 竞选者型
- **ENTP**: 辩论家型
- **ESTJ**: 总经理型
- **ESFJ**: 执政官型
- **ENFJ**: 主人公型
- **ENTJ**: 指挥官型

## 注意事项

1. 此为开发环境配置，生产环境请使用专业的WSGI服务器（如Gunicorn）
2. 数据存储使用JSON文件，适合小规模应用，大规模应用建议使用数据库
3. 管理员界面目前没有身份验证，建议在生产环境中添加

## 许可证

ISC