from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import json
import os
from datetime import datetime
import threading

app = Flask(__name__, static_folder='.')
CORS(app)

# 数据存储文件路径
DATA_FILE = os.path.join(os.path.dirname(__file__), 'test-results.json')

def init_data_file():
    if not os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump([], f, ensure_ascii=False, indent=2)

def read_test_results():
    try:
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f'读取测试结果失败: {e}')
        return []

def save_test_result(result):
    try:
        results = read_test_results()
        results.append(result)
        with open(DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump(results, f, ensure_ascii=False, indent=2)
        return True
    except Exception as e:
        print(f'保存测试结果失败: {e}')
        return False

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/admin')
def admin():
    return send_from_directory('.', 'admin.html')

@app.route('/api/test-results', methods=['POST'])
def create_test_result():
    try:
        data = request.json
        name = data.get('name', '').strip()
        mbti_type = data.get('mbtiType', '').strip().upper()
        timestamp = data.get('timestamp', datetime.now().isoformat())
        
        if not name or not mbti_type:
            return jsonify({'error': '缺少必要参数'}), 400
        
        result = {
            'id': int(datetime.now().timestamp() * 1000),
            'name': name,
            'mbtiType': mbti_type,
            'timestamp': timestamp
        }
        
        success = save_test_result(result)
        
        if success:
            return jsonify({'message': '测试结果保存成功', 'result': result}), 201
        else:
            return jsonify({'error': '保存测试结果失败'}), 500
    except Exception as e:
        print(f'处理保存测试结果请求时出错: {e}')
        return jsonify({'error': '服务器内部错误'}), 500

@app.route('/api/test-results', methods=['GET'])
def get_test_results():
    try:
        results = read_test_results()
        return jsonify(results)
    except Exception as e:
        print(f'获取测试结果失败: {e}')
        return jsonify({'error': '获取测试结果失败'}), 500

@app.route('/api/test-results/<int:result_id>', methods=['DELETE'])
def delete_test_result(result_id):
    try:
        results = read_test_results()
        filtered_results = [r for r in results if r['id'] != result_id]
        
        with open(DATA_FILE, 'w', encoding='utf-8') as f:
            json.dump(filtered_results, f, ensure_ascii=False, indent=2)
        
        return jsonify({'message': '测试结果删除成功'})
    except Exception as e:
        print(f'删除测试结果失败: {e}')
        return jsonify({'error': '删除测试结果失败'}), 500

@app.route('/api/statistics', methods=['GET'])
def get_statistics():
    try:
        results = read_test_results()
        total_tests = len(results)
        
        type_counts = {}
        for result in results:
            mbti_type = result['mbtiType']
            type_counts[mbti_type] = type_counts.get(mbti_type, 0) + 1
        
        return jsonify({
            'totalTests': total_tests,
            'typeCounts': type_counts
        })
    except Exception as e:
        print(f'获取统计信息失败: {e}')
        return jsonify({'error': '获取统计信息失败'}), 500

def run_server():
    init_data_file()
    print('服务器运行在 http://localhost:5000')
    print('管理员页面: http://localhost:5000/admin')
    app.run(host='0.0.0.0', port=5000, debug=False)

if __name__ == '__main__':
    run_server()