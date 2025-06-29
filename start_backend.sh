# 确保您在 MarkdownAI/ 根目录
cd /Users/sun/Desktop/MarkdownAI/
touch start_backend.sh

# start_backend.sh
#!/bin/bash

# 切换到 backend 目录
echo "Navigating to backend directory..."
cd backend || { echo "Error: 'backend' directory not found. Please ensure this script is in the project root."; exit 1; }

# 尝试取消激活当前虚拟环境，如果它已经激活的话
echo "Deactivating any existing virtual environment..."
deactivate 2>/dev/null

# 强制杀死所有占用 8000 端口的进程
echo "Terminating any processes using port 8000..."
sudo lsof -t -i :8000 | xargs -r kill -9
# 确保端口确实被释放
sleep 1 # 等待1秒，给系统一些时间来释放端口

# 激活 Python 虚拟环境
echo "Activating Python virtual environment..."
source .venv/bin/activate || { echo "Error: Virtual environment not found. Please run 'python3 -m venv .venv && pip install -r requirements.txt' in the backend directory first."; exit 1; }

# 启动 FastAPI 后端，带 --reload 和 --port 8000
echo "Starting FastAPI backend..."
uvicorn main:app --reload --port 8000