# 1. ベースイメージの指定 (Spring Boot 3.x系で推奨されるJava 17または21)
FROM eclipse-temurin:17

# 2. 開発に必要な一般的なツールのインストール
RUN apt-get update && apt-get install -y \
    git \
    curl \
    unzip \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# 3. コンテナ内で作業する非ルートユーザー（vscode）の作成
# VS CodeのDev Containersでは、ファイル権限の競合を防ぐために
# 一般ユーザー（UID 1000）で起動することが推奨されます
#RUN useradd -m -s /bin/bash vscode
#RUN mkdir -p /workspace/backend && chown -R vscode:vscode /workspace/backend

# 4. 作成したユーザーに切り替え
#USER vscode

# 5. 作業ディレクトリの設定
WORKDIR /workspace/backend

# 6. コンテナ起動時のデフォルトコマンド
CMD ["bash"]