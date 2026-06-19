# Use official lightweight Python 3.12 image
FROM python:3.12-slim as builder

# Setup build dependencies and environment
WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install OS libraries required for OpenCV, Tesseract, etc.
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libgl1-mesa-glx \
    libglib2.0-0 \
    tesseract-ocr \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies in a virtual environment
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt


# Final Runner stage
FROM python:3.12-slim as runner

WORKDIR /app
ENV PATH="/opt/venv/bin:$PATH"
ENV PYTHONPATH=/app

# Install runtime OS dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1-mesa-glx \
    libglib2.0-0 \
    tesseract-ocr \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Copy virtual env and code from builder
COPY --from=builder /opt/venv /opt/venv
COPY . /app

# Expose port and run uvicorn
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
