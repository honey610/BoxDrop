import Box from "../models/box.model.js";
import Seller from "../models/seller.model.js";

export const createBox = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1️⃣ Find seller profile
    const seller = await Seller.findOne({
      userId,
      status: "APPROVED",
      isApproved: true,
    });

    if (!seller) {
      return res.status(403).json({
        message: "Seller not approved or does not exist",
      });
    }

    if (!seller || !seller._id) {
  return res.status(500).json({
    message: "Seller profile mismatch",
  });
}

    //Limit Check
    if(seller.plan==="FREE" && seller.boxesCreatedThisMonth>=seller.monthlyBoxLimit){
      return res.status(403).json({
        message: " Monthly box limit reached. Upgrade to Pro for unlimited boxes. "})}

        // Handle uploaded images
    const imageUrls = req.files?.map(
      (file) => `/uploads/${file.filename}`
    );


    // 2️⃣ Validate input
    const {
      title,
      description,
      price,
      billingCycle,
      itemsSummary,
      images,
    } = req.body;

    if (!title || price === undefined) {
      return res.status(400).json({
        message: "Title and price are required",
      });
    }

    // 3️⃣ Create box
    const box = await Box.create({
      sellerId: seller._id,
      title,
      description,
      price,
      billingCycle,
      itemsSummary,
      images: imageUrls || [],
      isActive: true, // seller can activate
      isApproved: false, // admin can moderate later
    });

     seller.boxesCreatedThisMonth += 1;
     await seller.save();


    return res.status(201).json({
      message: "Box created successfully",
      box,
    });
  } catch (error) {
    console.error("Create box error:", error.message);
    return res.status(500).json({
      message: "Failed to create box",
    });
  }
};

export const updateBox = async (req, res) => {
  try {
    const { boxId } = req.params;
    const user = req.user;

    // 1️⃣ Find box first
    const box = await Box.findById(boxId);

    if (!box) {
      return res.status(404).json({
        message: "Box not found",
      });
    }

    // 2️⃣ Role & ownership check
    if (user.role === "SELLER") {
      if (box.sellerId.toString() !== user._id.toString()) {
        return res.status(403).json({
          message: "You can update only your own boxes",
        });
      }
    } else if (user.role !== "ADMIN") {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    // 3️⃣ Prevent seller from updating admin-only fields
    const forbiddenFields = [
      "isApproved",
      "approvedAt",
      "approvedBy",
      "subscriberCount",
    ];

    forbiddenFields.forEach((field) => delete req.body[field]);

    // 4️⃣ Update box
    Object.assign(box, req.body);
    await box.save();

    return res.json({
      message: "Box updated successfully",
      box,
    });
  } catch (error) {
    console.error("Update box error:", error.message);
    return res.status(500).json({
      message: "Failed to update box",
    });
  }
};





export const approveBox = async (req, res) => {
  try {
    const { boxId } = req.params;

    const box = await Box.findById(boxId);

    if (!box) {
      return res.status(404).json({
        message: "Box not found",
      });
    }

    if (box.isApproved) {
      return res.status(400).json({
        message: "Box already approved",
      });
    }

    box.isApproved = true;
    box.isActive = true;
    box.approvedAt = new Date();
    box.approvedBy = req.user._id;

    await box.save();

    return res.json({
      message: "Box approved successfully",
      box,
    });
  } catch (error) {
    console.error("Approve box error:", error.message);
    return res.status(500).json({
      message: "Failed to approve box",
    });
  }
};

// export const rejectBox = async (req, res) => {
//   try {
//     const { boxId } = req.params;
//     const box = await Box.findById(boxId);

//     if (!box) {
//       return res.status(404).json({
//         message: "Box not found",
//       });
//     }

//    await Box.findByIdAndDelete(boxId);


//     return res.json({
//       message: "Box rejected and removed successfully",
//     });
//   } catch (error) {
//     console.error("Reject box error:", error.message);
//     return res.status(500).json({
//       message: "Failed to reject box",
//     });
//   }
// }

export const rejectBox = async (req, res) => {
  try {
    const { boxId } = req.params;
    const { rejectionReason } = req.body||{};

    if (!rejectionReason || rejectionReason.trim().length < 5) {
      return res.status(400).json({
        message: "Rejection reason is required (min 5 chars)",
      });
    }

    const box = await Box.findById(boxId);
    if (!box) {
      return res.status(404).json({ message: "Box not found" });
    }

    box.isApproved = false;
    box.isActive = false;
    box.rejectionReason = rejectionReason;
    box.rejectedAt = new Date();
    box.rejectedBy = req.user._id;

    await box.save();

    return res.json({
      message: "Box rejected with reason",
      box,
    });
  } catch (error) {
    console.error("Reject box error:", error.message);
    return res.status(500).json({
      message: "Failed to reject box",
    });
  }
};

export const listPublicBoxes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const sortBy = req.query.sortBy || "createdAt"; // price | rating | createdAt
    const order = req.query.order === "asc" ? 1 : -1;

    const filter = {
      isApproved: true,
      isActive: true,
    };

    const boxes = await Box.find(filter)
      .sort({ [sortBy]: order })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "sellerId",
        select: "brandName",
      });

    const total = await Box.countDocuments(filter);

    return res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      boxes,
      // count: boxes.length,
    });
  } catch (error) {
    console.error("List public boxes error:", error.message);
    return res.status(500).json({
      message: "Failed to fetch boxes",
    });
  }
};



export const getBoxById = async (req, res) => {
  try {
    const { boxId } = req.params;

    const box = await Box.findOne({
      _id: boxId,
      isApproved: true,
      isActive: true,
    }).populate({
      path: "sellerId",
      select: "brandName description",
    });

    if (!box) {
      return res.status(404).json({
        message: "Box not found",
      });
    }

    return res.json({
      box,
    });
  } catch (error) {
    console.error("Get box error:", error.message);

    return res.status(400).json({
      message: "Invalid box ID",
    });
  }
};

export const getSellerBoxes = async (req, res) => {
  try {
    // if (req.user.role !== "SELLER") {
    //   return res.status(403).json({ message: "Access denied" });
    // }
    const seller = await Seller.findOne({
      userId: req.user._id,
      status: "APPROVED",
    });

    if (!seller) {
      return res.status(403).json({
        message: "Seller not approved or not found",
      });
    }

    const sellerId = seller._id;

    const boxes = await Box.find({ sellerId: sellerId })
      .select("title price billingCycle isApproved images createdAt rejectionReason")
      .sort({ createdAt: -1 });
console.log("REQ USER ID:", req.user._id.toString());
    return res.json({
      totalBoxes: boxes.length,
      liveBoxes: boxes.filter(b => b.isApproved).length,
      boxes,
    });
  } catch (error) {
    console.error("Get seller boxes error:", error);
    return res.status(500).json({
      message: "Failed to fetch boxes",
    });
  }
};


export const getPendingBoxes = async (req, res) => {
  try {
    const pendingBoxes = await Box.find({ isApproved: false,rejectionReason:null }).sort({ createdAt: -1 }).populate({
      path: "sellerId",
      select: "brandName",
    });

    return res.json({
      boxes: pendingBoxes,
    });
  } catch (error) {
    console.error("Get approved/pending boxes error:", error.message);
    return res.status(500).json({
      message: "Failed to fetch boxes",
    });
  }
}


export const getTotalBoxesCount = async (req, res) => {
  try {
    const totalBoxes = await Box.countDocuments();

    return res.json({
      totalBoxes,
    });
  } catch (error) { 
    console.error("Get total boxes count error:", error.message);
    return res.status(500).json({
      message: "Failed to fetch total boxes count",
    });
  }
}


