# 1. ベースイメージの指定 (React開発に適したNode.js LTSバージョン)
FROM node:20-bookworm-slim

# 2. 必要なシステムパッケージのインストール（Gitやcurlなど）
RUN apt-get update && apt-get install -y \
    git \
    curl \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# 3. 作業ディレクトリの設定 (docker-compose.ymlの指定と合わせる)
WORKDIR /workspace/frontend

# 4. コンテナ起動時のデフォルトコマンド
# 開発環境ではdocker-composeやdevcontainer.json側で制御するため、
# ここではコンテナが終了しないようにシェルを起動させておきます
CMD ["bash"]