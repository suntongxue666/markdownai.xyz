# backend/Dockerfile
# 使用官方 Python 3.12 镜像作为基础
FROM python:3.12-slim-bookworm

# 设置工作目录
WORKDIR /app

# 复制 requirements.txt 并安装依赖
# 使用 --no-cache-dir 避免生成缓存，缩小镜像大小
# 使用 --default-timeout 100 设置超时时间，防止下载中断
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt --default-timeout 100

# 复制应用代码
COPY . .

# 暴露 FastAPI 监听的端口
EXPOSE 8000

# 启动 Uvicorn 服务器
# 使用 --host 0.0.0.0 确保服务可以在容器外部访问
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
