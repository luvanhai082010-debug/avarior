// server.js

// 1. Tải các biến môi trường từ file .env
require('dotenv').config(); 
const PORT = process.env.PORT || 3000;

const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
// Khởi tạo Socket.io Server, chấp nhận kết nối từ mọi nguồn (*)
const io = new Server(server, { cors: { origin: "*" } }); 

// 2. Kết nối Database
mongoose.connect(process.env.DATABASE_URL)
  .then(() => console.log('✅ Kết nối Database thành công'))
  .catch(err => console.error('❌ Lỗi kết nối DB:', err));

// 3. Middlewares (Xử lý dữ liệu)
app.use(express.json()); // Cho phép server đọc JSON từ request body

// 4. Khai báo Routes API
// Gợi ý routes/adminRoutes
const adminRoutes = require('./routes/adminRoutes'); 
// Gợi ý routes/gameRoutes
const gameRoutes = require('./routes/gameRoutes');

app.use('/api/admin', adminRoutes);
app.use('/api/game', gameRoutes);

// 5. Logic Socket.io (Quan trọng nhất cho game real-time)
global.io = io; // Gán io vào global để Controller có thể dùng
io.on('connection', (socket) => {
    console.log(`Người dùng mới kết nối: ${socket.id}`);
    
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
