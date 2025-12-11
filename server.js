// server.js

// 1. Tải các biến môi trường
require('dotenv').config(); 
const PORT = process.env.PORT || 3000;

const express = require('express');
const http = require('http');
const { Pool } = require('pg'); // <-- Sửa: Thêm thư viện Pool của pg
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } }); 

// 2. Kết nối Database (Sử dụng Pool cho PostgreSQL)
const pool = new Pool({
    connectionString: process.env.DATABASE_URL, // Lấy từ file .env
    ssl: {
        rejectUnauthorized: false // Cấu hình SSL nếu cần thiết cho môi trường cloud
    }
});

// Kiểm tra kết nối Database
pool.connect()
    .then(client => {
        console.log('✅ Kết nối PostgreSQL thành công');
        client.release(); // Trả kết nối về pool
    })
    .catch(err => console.error('❌ Lỗi kết nối PostgreSQL:', err));

// 3. Middlewares (Xử lý dữ liệu)
app.use(express.json());

// 4. Khai báo Routes API và Export DB Pool
// Gán pool vào global để Controllers có thể sử dụng
global.db = pool; 
global.io = io;

const adminRoutes = require('./routes/adminRoutes');
const gameRoutes = require =>('./routes/gameRoutes'); 

app.use('/api/admin', adminRoutes);
app.use('/api/game', gameRoutes);

// 5. Logic Socket.io
io.on('connection', (socket) => {
    // ... (logic Socket.io của bạn)
});

// 6. Khởi động Server
server.listen(PORT, () => {
    console.log(`🚀 Server đang chạy trên cổng ${PORT}`);
});    console.log(`Người dùng mới kết nối: ${socket.id}`);
    
    // Lưu trữ socket ID của người dùng (quan trọng cho việc cấp tool/cấp tiền)
    // Ví dụ: userSockets.set(userId, socket.id);
    
    socket.on('disconnect', () => {
        console.log(`Người dùng ngắt kết nối: ${socket.id}`);
    });
    
    // Bắt đầu vòng lặp game ở đây (Ví dụ: setInterval cho vòng chơi mới)
});

// 6. Khởi động Server
server.listen(PORT, () => {
    console.log(`🚀 Server đang chạy trên cổng ${PORT}`);
});
