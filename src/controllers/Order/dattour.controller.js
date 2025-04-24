const Order = require("../../model/Order");
const nodemailer = require("nodemailer");
require('dotenv').config();



module.exports = {

    createOrder: async (req, res) => {
        try {
            const {
              fullName,
              email,
              phone,
              people,
              date,
              pickup,
              note,
              tenTour,
              giaTour
            } = req.body;
      
            // Kiểm tra thông tin bắt buộc
            if (!fullName || !email || !phone || !people || !date || !pickup || !tenTour || !giaTour) {
              return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin bắt buộc!' });
            }
      
            // Tạo đơn hàng mới
            const newOrder = new Order({
                fullName,
                email,
                phone,
                people,
                date,
                pickup,
                note,
                tenTour,
                giaTour
            });
      
            await newOrder.save();

            //---- GỬI XÁC NHẬN ĐƠN HÀNG VỀ EMAIL
            const transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
                }
            });
            const formattedGia = Number(giaTour).toLocaleString('vi-VN') + ' ₫';

            const sendOrderConfirmationEmail = async (toEmail) => {
                // Tạo nội dung email với bảng sản phẩm
                const mailOptions = {
                    from: 'Admin',
                    to: toEmail,
                    subject: 'Xác nhận lịch hẹn của bạn.',
                    html: `
                    <div style="font-family: Arial, sans-serif; background-color: #f4f8fb; padding: 24px; border-radius: 10px; max-width: 600px; margin: auto; color: #333;">
                        <div style="text-align: center; margin-bottom: 20px;">
                        <h2 style="color: #2a7f9d;">TT Travel</h2>
                        </div>

                        <h3 style="color: #2a7f9d;">Xin chào ${fullName},</h3>
                        <p style="font-size: 15px;">Cảm ơn bạn đã <strong>đăng ký tư vấn tour</strong> tại <strong>TT Travel</strong>! Chúng tôi đã nhận được thông tin của bạn.</p>

                        <table style="width: 100%; margin-top: 20px; border-collapse: collapse; background-color: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 6px rgba(0,0,0,0.05);">
                        <tbody>
                            <tr style="background-color: #e6f3f8;">
                            <td style="padding: 10px;"><strong>Tour:</strong></td>
                            <td style="padding: 10px;">${tenTour}</td>
                            </tr>
                            <tr>
                            <td style="padding: 10px;"><strong>Giá:</strong></td>
                            <td style="padding: 10px;">${formattedGia}</td>
                            </tr>
                            <tr style="background-color: #e6f3f8;">
                            <td style="padding: 10px;"><strong>Ngày đi:</strong></td>
                            <td style="padding: 10px;">${date}</td>
                            </tr>
                            <tr>
                            <td style="padding: 10px;"><strong>Số người:</strong></td>
                            <td style="padding: 10px;">${people}</td>
                            </tr>
                            <tr style="background-color: #e6f3f8;">
                            <td style="padding: 10px;"><strong>Điểm đón:</strong></td>
                            <td style="padding: 10px;">${pickup}</td>
                            </tr>
                            <tr>
                            <td style="padding: 10px;"><strong>Lưu ý:</strong></td>
                            <td style="padding: 10px;">${note || 'Không có'}</td>
                            </tr>
                        </tbody>
                        </table>

                        <p style="margin-top: 20px; font-size: 15px;">
                        Bộ phận tư vấn của chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất để xác nhận và hỗ trợ thêm.
                        </p>

                        <p style="margin-top: 30px; font-size: 14px;">
                        Trân trọng,<br/>
                        <strong>Đội ngũ TT Travel</strong>
                        </p>

                        <div style="text-align: center; margin-top: 40px; font-size: 12px; color: #999;">
                        © ${new Date().getFullYear()} TT Travel. All rights reserved.
                        </div>
                    </div>
                    `

                };
    
                return new Promise((resolve, reject) => {
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            reject(error);
                        } else {
                            console.log('Email sent: ' + info.response);
                            resolve();
                        }
                    });
                });
            };
            // Gửi email thông báo đặt hàng thành công
            await sendOrderConfirmationEmail(email);  
      
            return res.status(201).json({
              message: 'Đăng ký thành công! Vui lòng kiểm tra email của bạn.',
              order: newOrder
            });
      
        } catch (error) {
            console.error('Lỗi Đăng ký:', error);
            return res.status(500).json({ message: 'Đã có lỗi xảy ra khi Đăng ký.' });
        }
    }, 

    getOrder: async (req, res) => {
        try {
            const { page, limit, TenSP, sort, order,  } = req.query; 

            // Chuyển đổi thành số
            const pageNumber = parseInt(page, 10);
            const limitNumber = parseInt(limit, 10);

            // Tính toán số bản ghi bỏ qua
            const skip = (pageNumber - 1) * limitNumber;

            // Tạo query tìm kiếm
            const query = {};
                     

            // tang/giam
            let sortOrder = 1; // tang dn
            if (order === 'desc') {
                sortOrder = -1; 
            }
            
                       
            let sp = await Order.find(query)
                .skip(skip)
                .limit(limitNumber)
                .sort({ [sort]: sortOrder })            

            const totalOrder = await Order.countDocuments(query); // Đếm tổng số chức vụ

            const totalPages = Math.ceil(totalOrder / limitNumber); // Tính số trang

            if(sp) {
                return res.status(200).json({
                    message: "Đã tìm ra products",
                    errCode: 0,
                    data: sp,
                    totalOrder,
                    totalPages,
                    currentPage: pageNumber,
                })
            } else {
                return res.status(500).json({
                    message: "Tìm products thất bại!",
                    errCode: -1,
                })
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                message: "Có lỗi xảy ra.",
                error: error.message,
            });
        } 
    },
}