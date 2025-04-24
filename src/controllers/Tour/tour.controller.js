const TourDuLich = require("../../model/TourDuLich");


module.exports = {
    getTour: async (req, res) => {
        try {
            const { page, limit, TenSP, sort, order, tu, den } = req.query; 

            // Chuyển đổi thành số
            const pageNumber = parseInt(page, 10);
            const limitNumber = parseInt(limit, 10);

            // Tính toán số bản ghi bỏ qua
            const skip = (pageNumber - 1) * limitNumber;

            // Tạo query tìm kiếm
            const query = {};
            if (TenSP) {
                const searchKeywords = TenSP.trim().split(/\s+/).map(keyword => {
                    // Chuyển keyword thành regex để tìm kiếm gần đúng (không phân biệt chữ hoa chữ thường)
                    const normalizedKeyword = keyword.toLowerCase();  // Chuyển tất cả về chữ thường để không phân biệt
                    return {
                        tenTour: { $regex: normalizedKeyword, $options: 'i' } // 'i' giúp tìm kiếm không phân biệt chữ hoa chữ thường
                    };
                });
            

                query.$or = searchKeywords;
            }            

            // tang/giam
            let sortOrder = 1; // tang dn
            if (order === 'desc') {
                sortOrder = -1; 
            }
            
            if (tu && den) {
                const giatriTu = parseFloat(tu);
                const giatriDen = parseFloat(den);
            
                query.giaTour = { $gte: giatriTu, $lte: giatriDen };
            }
              
                                   
            let sp = await TourDuLich.find(query)
                .skip(skip)
                .limit(limitNumber)
                .sort({ [sort]: sortOrder })            

            const totalTourDuLich = await TourDuLich.countDocuments(query); // Đếm tổng số chức vụ

            const totalPages = Math.ceil(totalTourDuLich / limitNumber); // Tính số trang

            if(sp) {
                return res.status(200).json({
                    message: "Đã tìm ra products",
                    errCode: 0,
                    data: sp,
                    totalTourDuLich,
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

    getDetailSP: async (req, res) => {
        try {
            const {id} = req.query

            let sp = await TourDuLich.findById(id)
            if(sp) {
                return res.status(200).json({
                    data: sp,
                    message: "Đã có thông tin chi tiết!"
                })
            } else {
                return res.status(500).json({
                    message: "Thông tin chi tiết thất bại!"
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

    createTour: async (req, res) => {
        try {
            let {tenTour, giaTour, khoiHanh, phuongTien, xuatPhat, lichTrinh, chinhSach, dieuKhoan, image, imageSlider} = req.body                                        

            let createSP = await TourDuLich.create({tenTour, giaTour, khoiHanh, phuongTien, xuatPhat, lichTrinh, chinhSach, dieuKhoan, image, imageSlider})

            if(createSP){
                return res.status(200).json({
                    message: "Bạn đã thêm tour du lịch thành công!",
                    errCode: 0,
                    data: createSP
                })
            } else {
                return res.status(500).json({
                    message: "Bạn thêm tour du lịch thất bại!",                
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

    updateTour: async (req, res) => {
        try {
            let {_id, tenTour, giaTour, khoiHanh, phuongTien, xuatPhat, lichTrinh, chinhSach, dieuKhoan, image, imageSlider} = req.body

            let updateTL = await TourDuLich.updateOne({_id: _id},{tenTour, giaTour, khoiHanh, phuongTien, xuatPhat, lichTrinh, chinhSach, dieuKhoan, image, imageSlider})

            if(updateTL) {
                return res.status(200).json({
                    data: updateTL,
                    message: "Chỉnh sửa tour du lịch thành công"
                })
            } else {
                return res.status(404).json({                
                    message: "Chỉnh sửa tour du lịch thất bại"
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

    deleteTour: async (req, res) => {
        try {
            const _id = req.params.id
            let xoaTL = await TourDuLich.deleteOne({_id: _id})

            if(xoaTL) {
                return res.status(200).json({
                    data: xoaTL,
                    message: "Bạn đã xoá tour du lịch thành công!"
                })
            } else {
                return res.status(500).json({
                    message: "Bạn đã xoá tour du lịch thất bại!"
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

    deleteNhieuProduct: async (req, res) => {
        // const { ids } = req.body; // ids là mảng chứa các _id của các tour cần xóa
        const ids = req.query.ids ? req.query.ids.split(',') : []; // Lấy mảng ids từ query string
        console.log("ids: ", ids);
        
        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ message: 'Vui lòng cung cấp mảng _id hợp lệ' });
        }

        try {
            // Xóa các tour với các _id trong mảng ids
            const result = await TourDuLich.deleteMany({ _id: { $in: ids } });

            if (result.deletedCount === 0) {
                return res.status(404).json({ message: 'Không tìm thấy tour nào để xóa' });
            }

            res.status(200).json({ message: `${result.deletedCount} tour đã được xóa thành công` });
        } catch (error) {
            console.error('Error deleting products:', error);
            res.status(500).json({ message: 'Đã xảy ra lỗi khi xóa tour' });
        }
    },

}