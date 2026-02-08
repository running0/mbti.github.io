const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

// 数据存储文件路径
const DATA_FILE = path.join(__dirname, 'test-results.json');

// 初始化数据文件
function initDataFile() {
    if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
    }
}

// 读取测试结果
function readTestResults() {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('读取测试结果失败:', error);
        return [];
    }
}

// 保存测试结果
function saveTestResult(result) {
    try {
        const results = readTestResults();
        results.push(result);
        fs.writeFileSync(DATA_FILE, JSON.stringify(results, null, 2));
        return true;
    } catch (error) {
        console.error('保存测试结果失败:', error);
        return false;
    }
}

// API路由

// 保存测试结果
app.post('/api/test-results', (req, res) => {
    try {
        const { name, mbtiType, timestamp } = req.body;
        
        if (!name || !mbtiType) {
            return res.status(400).json({ error: '缺少必要参数' });
        }
        
        const result = {
            id: Date.now(),
            name: name.trim(),
            mbtiType: mbtiType.trim().toUpperCase(),
            timestamp: timestamp || new Date().toISOString()
        };
        
        const success = saveTestResult(result);
        
        if (success) {
            res.status(201).json({ message: '测试结果保存成功', result });
        } else {
            res.status(500).json({ error: '保存测试结果失败' });
        }
    } catch (error) {
        console.error('处理保存测试结果请求时出错:', error);
        res.status(500).json({ error: '服务器内部错误' });
    }
});

// 获取所有测试结果
app.get('/api/test-results', (req, res) => {
    try {
        const results = readTestResults();
        res.json(results);
    } catch (error) {
        console.error('获取测试结果失败:', error);
        res.status(500).json({ error: '获取测试结果失败' });
    }
});

// 删除测试结果
app.delete('/api/test-results/:id', (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const results = readTestResults();
        const filteredResults = results.filter(result => result.id !== id);
        
        fs.writeFileSync(DATA_FILE, JSON.stringify(filteredResults, null, 2));
        res.json({ message: '测试结果删除成功' });
    } catch (error) {
        console.error('删除测试结果失败:', error);
        res.status(500).json({ error: '删除测试结果失败' });
    }
});

// 获取统计信息
app.get('/api/statistics', (req, res) => {
    try {
        const results = readTestResults();
        const totalTests = results.length;
        
        // 统计各MBTI类型的数量
        const typeCounts = {};
        results.forEach(result => {
            const type = result.mbtiType;
            typeCounts[type] = (typeCounts[type] || 0) + 1;
        });
        
        res.json({
            totalTests,
            typeCounts
        });
    } catch (error) {
        console.error('获取统计信息失败:', error);
        res.status(500).json({ error: '获取统计信息失败' });
    }
});

// 主页路由
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 管理员页面路由
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// 启动服务器
function startServer() {
    initDataFile();
    app.listen(PORT, () => {
        console.log(`服务器运行在 http://localhost:${PORT}`);
        console.log(`管理员页面: http://localhost:${PORT}/admin`);
    });
}

// 启动服务器
startServer();

module.exports = app;