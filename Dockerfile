# Sử dụng image Node.js chính thức từ Docker Hub
FROM node:18

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Sao chép package.json và package-lock.json (nếu có)
COPY package*.json ./

# Cài đặt các phụ thuộc
RUN npm install

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Build ứng dụng React
RUN npm run build

# Cài đặt serve để phục vụ file tĩnh
RUN npm install -g serve

# Cung cấp cổng mà ứng dụng sẽ chạy
EXPOSE 3005

# Chạy server phục vụ file tĩnh trong thư mục build
CMD ["serve", "-s", "build", "-l", "3005"]
