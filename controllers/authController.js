// controllers/authController.js (Sử dụng SQL/pg Pool)

const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken'); 
// Giả định: global.db là Pool kết nối PostgreSQL
const db = global.db; 

// Hàm đăng nhập Admin
exports.adminLogin = async (req, res) => {
    const { username, password } = req.body;

    // Lấy thông tin Admin từ DB (Username: '1')
    const query = 'SELECT admin_id, password_hash, username FROM admins WHERE username = $1';
    const result = await db.query(query, [username]);
    
    const adminRecord = result.rows[0];

    // Bước 1 & 2: Kiểm tra Username và Mật khẩu
    if (!adminRecord) {
        return res.status(401).json({ message: 'Tên đăng nhập không đúng.' });
    }

    const isPasswordValid = await bcrypt.compare(password, adminRecord.password_hash); 

    if (!isPasswordValid) {
        return res.status(401).json({ message: 'Mật khẩu không đúng.' });
    }

    // --- Logic Single-Device Login ---
    
    // Bước 3: Tạo Token (Token Phiên mới)
    const sessionToken = jwt.sign(
        { id: adminRecord.username, role: 'admin' }, 
        process.env.JWT_SECRET, 
        { expiresIn: '12h' } 
    );

    // Bước 4: Cập nhật Token Phiên trong Database (SQL UPDATE)
    const updateQuery = 'UPDATE admins SET current_session_token = $1 WHERE admin_id = $2';
    await db.query(updateQuery, [sessionToken, adminRecord.admin_id]);

    // Bước 5: Trả về kết quả thành công
    res.json({ 
        message: 'Đăng nhập Admin thành công.', 
        token: sessionToken 
    });
};
