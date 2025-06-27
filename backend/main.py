    # backend/main.py
    from fastapi import FastAPI, UploadFile, File, HTTPException
    from fastapi.responses import PlainTextResponse
    from fastapi.middleware.cors import CORSMiddleware
    from markitdown import MarkItDown
    import io
    import logging

    app = FastAPI()

    # 配置 CORS 允许前端访问（在生产环境中，你应该限制为你的前端域名）
    origins = [
        "http://localhost:3000",  # 允许本地开发
        "https://www.markdownai.xyz", # 你的生产域名
    ]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # 配置日志
    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger(__name__)

    @app.post("/convert")
    async def convert_file(file: UploadFile = File(...)):
        logger.info(f"Received file: {file.filename} ({file.content_type})")

        # 检查文件大小 (限制为 10MB，与前端保持一致)
        max_size_mb = 10
        max_size_bytes = max_size_mb * 1024 * 1024
        
        # FastAPI 会将文件内容存储在内存中，所以我们可以直接读取
        file_content = await file.read()
        
        if len(file_content) > max_size_bytes:
            logger.warning(f"File {file.filename} exceeds {max_size_mb}MB limit.")
            raise HTTPException(status_code=400, detail=f"File size exceeds {max_size_mb}MB limit.")

        # markitdown 需要一个二进制文件流
        try:
            file_stream = io.BytesIO(file_content)
            
            # 初始化 MarkItDown。如果你需要特定的依赖（如 PDF、Word），
            # 确保它们已经在 requirements.txt 中安装。
            # 如果需要LLM描述图片，可以在这里传入 llm_client 和 llm_model
            md = MarkItDown(enable_plugins=False) 
            
            # 使用 convert_stream 方法，因为我们是从内存流读取
            result = md.convert_stream(file_stream, filename=file.filename)
            
            markdown_content = result.text_content
            logger.info(f"Successfully converted {file.filename}.")
            
            return PlainTextResponse(markdown_content)

        except Exception as e:
            logger.exception(f"Conversion failed for {file.filename}: {e}")
            raise HTTPException(status_code=500, detail=f"Conversion failed: {e}")

    @app.get("/")
    async def root():
        return {"message": "MarkDownAI Python Backend (FastAPI)"}

    if __name__ == "__main__":
        import uvicorn
        # 在本地运行：uvicorn main:app --reload --port 8000
        uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
