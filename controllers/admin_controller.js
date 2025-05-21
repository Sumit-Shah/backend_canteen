var db = require('./../helpers/db_helpers')
var helper = require('./../helpers/helpers')
var multiparty = require("multiparty");
var fs = require('fs');
var imageSavePath = "./public/img/"

// const multer = require('multer');
const msg_success = "successfully";
const msg_fail = "fail";
const msg_invalidUserPassword = "invalid username and password";
const msg_invalidUser = "invalid username";

module.exports.controller = (app, io, socket_list) => {
    const msg_exits_email = "already used this email";
    const msg_exits_user = "user not exits";
    const msg_update_password = "user password updated successfully";

    const msg_add = "Added Successfully.";
    const msg_update = "Updated Successfully.";
    const msg_delete = "Deleted Successfully.";

    const msg_add_category = "Category added Successfully.";
    const msg_update_category = "Category updated Successfully.";
    const msg_delete_category = "Category deleted Successfully.";

    const msg_add_menu_item = "Menu Item added Successfully.";
    const msg_update_menu_item = "Menu Item updated Successfully.";
    const msg_delete_menu_item = "Menu Item deleted Successfully.";

    const msg_add_ingredient = "Menu ingredient added Successfully.";
    const msg_update_ingredient = "Menu ingredient updated Successfully.";
    const msg_delete_ingredient = "Menu ingredient deleted Successfully.";

    app.post('/api/admin/category_add', (req, res) => {
        var form = new multiparty.Form();

        checkAccessToken(req.headers, res, (userObj) => {
            form.parse(req, (err, reqObj, files) => {
                if (err) {
                    helper.ThrowHtmlError(err, res);
                    return;
                }

                helper.Dlog("--------------- Parameter --------------")
                helper.Dlog(reqObj);
                helper.Dlog("--------------- Files --------------")
                helper.Dlog(files);

                helper.CheckParameterValid(res, reqObj, ["name"], () => {
                    helper.CheckParameterValid(res, files, ["image"], () => {
                        var extension = files.image[0].originalFilename.substring(files.image[0].originalFilename.lastIndexOf(".") + 1);
                        var imageFileName = "category/" + helper.fileNameGenerate(extension);

                        var newPath = imageSavePath + imageFileName;

                        fs.rename(files.image[0].path, newPath, (err) => {
                            if (err) {
                                helper.ThrowHtmlError(err, res);
                                return;
                            } else {
                                db.query("INSERT INTO `category_detail`( `name`, `image`, `create_date`, `update_date`) VALUES (?,?, NOW(), NOW())", [
                                    reqObj.name[0], imageFileName
                                ], (err, result) => {
                                    if (err) {
                                        helper.ThrowHtmlError(err, res);
                                        return;
                                    }

                                    if (result) {
                                        res.json({ "status": "1", "message": msg_add_category })
                                    } else {
                                        res.json({ "status": "0", "message": msg_fail })
                                    }
                                })
                            }
                        })
                    })
                })
            })
        }, "3")
    })

    app.post('/api/admin/category_update', (req, res) => {
        var form = new multiparty.Form();

        checkAccessToken(req.headers, res, (userObj) => {
            form.parse(req, (err, reqObj, files) => {
                if (err) {
                    helper.ThrowHtmlError(err, res);
                    return;
                }

                helper.Dlog("--------------- Parameter --------------")
                helper.Dlog(reqObj);
                helper.Dlog("--------------- Files --------------")
                helper.Dlog(files);

                helper.CheckParameterValid(res, reqObj, ["category_id", "name"], () => {
                    var condition = ""
                    var imageFileName = ""
                    if (files.image != undefined || files.image != null) {
                        var extension = files.image[0].originalFilename.substring(files.image[0].originalFilename.lastIndexOf(".") + 1);
                        imageFileName = "category/" + helper.fileNameGenerate(extension);
                        newPath = imageSavePath + imageFileName;
                        condition = " `image` = '" + imageFileName + "',"
                        fs.rename(files.image[0].path, newPath, (err) => {
                            if (err) {
                                helper.ThrowHtmlError(err);
                                return;
                            }
                        })
                    }

                    db.query("UPDATE `category_detail` SET `name` = ?, " + condition + " `update_date` = NOW() WHERE `status` < ? AND `category_id` = ? ", [
                        reqObj.name[0], "2", reqObj.category_id[0]
                    ], (err, result) => {
                        if (err) {
                            helper.ThrowHtmlError(err, res);
                            return;
                        }

                        if (result) {
                            res.json({ "status": "1", "message": msg_update_category })
                        } else {
                            res.json({ "status": "0", "message": msg_fail })
                        }
                    })
                })
            })
        }, "3")
    })

    app.post('/api/admin/category_delete', (req, res) => {
        helper.Dlog(req.body);
        var reqObj = req.body;

        checkAccessToken(req.headers, res, (userObj) => {
            helper.CheckParameterValid(res, reqObj, ["category_id"], () => {
                db.query('UPDATE `category_detail` SET `status`=?,`update_date`=NOW() WHERE `category_id` = ? AND `status` != ? ', [
                    "2", reqObj.category_id, "2"], (err, uResult) => {
                        if (err) {
                            helper.ThrowHtmlError(err, res);
                            return
                        }

                        if (uResult.affectedRows > 0) {
                            res.json({ "status": "1", "message": msg_delete_category })
                        } else {
                            res.json({ "status": "0", "message": msg_fail })
                        }
                    })
            })
        }, "3")
    })

    app.post('/api/admin/category_list', (req, res) => {
        helper.Dlog(req.body);
        var reqObj = req.body;

        checkAccessToken(req.headers, res, (userObj) => {
            db.query('SELECT `category_id`, `name`, `image`, `create_date`, `update_date` FROM `category_detail` WHERE `status` != ?', [
                "2"], (err, result) => {
                    if (err) {
                        helper.ThrowHtmlError(err, res);
                        return
                    }
                    console.log(result, "result category")
                    res.json({ "status": "1", "payload": result, "message": msg_success })
                })
        }, "3")
    })

    app.post('/api/user/category_list', (req, res) => {
        helper.Dlog(req.body);
        var reqObj = req.body;

        checkAccessToken(req.headers, res, (userObj) => {
            db.query('SELECT `category_id`, `name`, `image`, `create_date`, `update_date` FROM `category_detail` WHERE `status` != ? ', [
                "2"], (err, result) => {
                    if (err) {
                        helper.ThrowHtmlError(err, res);
                        return
                    }
                    console.log(result, "result category")
                    res.json({ "status": "1", "payload": result, "message": msg_success })
                })
        }, "1")
    })

    app.post('/api/admin/menu_item_list', (req, res) => {
        helper.Dlog(req.body);
        var reqObj = req.body;

        if (!reqObj.category_id) {
            res.json({ "status": "0", "message": "Missing parameter (category_id)" });
            return;
        }

        db.query('SELECT `menu_item_id`, `category_id`, `name`, `description`, `image`, `base_price`, `is_portion_allow`, `is_custom_ingredient_allow`, `create_date`, `update_date` FROM `menu_item_detail` WHERE `category_id` = ? AND `status` != ?', [
            reqObj.category_id, "2"], (err, result) => {
                if (err) {
                    helper.ThrowHtmlError(err, res);
                    return
                }
                res.json({ "status": "1", "payload": result, "message": msg_success })
            })
    })

    app.post('/api/admin/menu_item_add', (req, res) => {
        var form = new multiparty.Form();

        checkAccessToken(req.headers, res, (userObj) => {
            form.parse(req, (err, reqObj, files) => {
                if (err) {
                    helper.ThrowHtmlError(err, res);
                    return;
                }

                helper.Dlog("--------------- Parameter --------------")
                helper.Dlog(reqObj);
                helper.Dlog("--------------- Files --------------")
                helper.Dlog(files);

                helper.CheckParameterValid(res, reqObj, ["category_id", "name", "base_price", "description"], () => {
                    helper.CheckParameterValid(res, files, ["image"], () => {
                        var extension = files.image[0].originalFilename.substring(files.image[0].originalFilename.lastIndexOf(".") + 1);
                        var imageFileName = "menu_item/" + helper.fileNameGenerate(extension);
                        var newPath = imageSavePath + imageFileName;

                        fs.rename(files.image[0].path, newPath, (err) => {
                            if (err) {
                                console.log("if error")
                                helper.ThrowHtmlError(err, res);
                                return;
                            } else {
                                db.query("INSERT INTO `menu_item_detail`(`category_id`, `name`, `description`, `image`, `base_price`, `is_portion_allow`, `is_custom_ingredient_allow`, `create_date`, `update_date`) VALUES (?,?,?,?,?,?,?,NOW(), NOW())", [
                                    reqObj.category_id[0], reqObj.name[0], reqObj.description[0], imageFileName, reqObj.base_price[0], (reqObj.is_portion_allow && reqObj.is_portion_allow[0]) || "0", (reqObj.is_custom_ingredient_allow && reqObj.is_custom_ingredient_allow[0]) || "0"
                                ], (err, result) => {
                                    if (err) {
                                        helper.ThrowHtmlError(err, res);
                                        return;
                                    }

                                    if (result) {
                                        res.json({ "status": "1", "message": msg_add_menu_item })
                                    } else {
                                        res.json({ "status": "0", "message": msg_fail })
                                    }
                                })
                            }
                        })
                    })
                })
            })
        }, "3")
    })

    app.post('/api/admin/menu_item_update', (req, res) => {
        var form = new multiparty.Form();

        checkAccessToken(req.headers, res, (userObj) => {
            form.parse(req, (err, reqObj, files) => {
                if (err) {
                    helper.ThrowHtmlError(err, res);
                    return;
                }

                helper.Dlog("--------------- Parameter --------------")
                helper.Dlog(reqObj);
                helper.Dlog("--------------- Files --------------")
                helper.Dlog(files);

                helper.CheckParameterValid(res, reqObj, ["menu_item_id", "category_id", "name", "base_price", "description"], () => {
                    var condition = ""
                    var imageFileName = ""
                    if (files.image != undefined || files.image != null) {
                        var extension = files.image[0].originalFilename.substring(files.image[0].originalFilename.lastIndexOf(".") + 1);
                        imageFileName = "menu_item/" + helper.fileNameGenerate(extension);
                        newPath = imageSavePath + imageFileName;
                        condition = " `image` = '" + imageFileName + "',"
                        fs.rename(files.image[0].path, newPath, (err) => {
                            if (err) {
                                helper.ThrowHtmlError(err);
                                return;
                            }
                        })
                    }

                    db.query("UPDATE `menu_item_detail` SET `category_id` = ?, `name` = ?, `description` = ?, `base_price` = ?, " + condition + " `update_date` = NOW() WHERE `menu_item_id` = ? AND `status` != ?", [
                        reqObj.category_id[0], reqObj.name[0], reqObj.description[0], reqObj.base_price[0], reqObj.menu_item_id[0], "2"
                    ], (err, result) => {
                        if (err) {
                            helper.ThrowHtmlError(err, res);
                            return;
                        }

                        if (result) {
                            res.json({ "status": "1", "message": msg_update_menu_item })
                        } else {
                            res.json({ "status": "0", "message": msg_fail })
                        }
                    })
                })
            })
        }, "3")
    })

    app.post('/api/admin/menu_item_delete', (req, res) => {
        helper.Dlog(req.body);
        var reqObj = req.body;

        checkAccessToken(req.headers, res, (userObj) => {
            helper.CheckParameterValid(res, reqObj, ["menu_item_id", "category_id"], () => {
                db.query('UPDATE `menu_item_detail` SET `status`=?,`update_date`=NOW() WHERE `menu_item_id` = ? AND `category_id` = ? AND `status` != ?', [
                    "2", reqObj.menu_item_id, reqObj.category_id, "2"], (err, uResult) => {
                        if (err) {
                            helper.ThrowHtmlError(err, res);
                            return
                        }

                        if (uResult.affectedRows > 0) {
                            res.json({ "status": "1", "message": msg_delete_menu_item })
                        } else {
                            res.json({ "status": "0", "message": msg_fail })
                        }
                    })
                })
        }, "3")
    })

    app.post('/api/user/place-order', (req, res) => {
        helper.Dlog(req.body);
        var reqObj = req.body;

        checkAccessToken(req.headers, res, (userObj) => {
            helper.CheckParameterValid(res, reqObj, ["items", "total", "delivery_floor"], () => {
                if (!Array.isArray(reqObj.items) || reqObj.items.length === 0) {
                    res.json({ "status": "0", "message": "Invalid items array" });
                    return;
                }

                // Insert into orders
                db.query(
                    'INSERT INTO `orders` (`user_id`, `total`, `delivery_floor`, `delivery_notes`, `created_date`, `status`) VALUES (?, ?, ?, ?, NOW(), ?)',
                    [userObj.user_id, reqObj.total, reqObj.delivery_floor, reqObj.delivery_notes || '', 'pending'],
                    (err, orderResult) => {
                        if (err) {
                            helper.ThrowHtmlError(err, res);
                            return;
                        }

                        const orderId = orderResult.insertId;

                        // Insert order items
                        let itemsInserted = 0;
                        reqObj.items.forEach((item) => {
                            db.query(
                                'INSERT INTO `order_items` (`order_id`, `name`, `qty`, `price`, `image`) VALUES (?, ?, ?, ?, ?)',
                                [orderId, item.name, item.qty, item.price, item.image || null],
                                (err, itemResult) => {
                                    if (err) {
                                        helper.ThrowHtmlError(err, res);
                                        return;
                                    }
                                    itemsInserted++;
                                    if (itemsInserted === reqObj.items.length) {
                                        // All items inserted, emit Socket.IO event
                                        io.emit('newOrder', {
                                            order_id: orderId,
                                            user_id: userObj.user_id,
                                            total: parseFloat(reqObj.total),
                                            delivery_floor: reqObj.delivery_floor,
                                            delivery_notes: reqObj.delivery_notes || '',
                                            items: reqObj.items,
                                            created_date: new Date().toISOString(),
                                            status: 'pending'
                                        });

                                        res.json({ "status": "1", "message": "Order placed successfully", "payload": { order_id: orderId } });
                                    }
                                }
                            );
                        });
                    }
                );
            });
        }, "1");
    });

    app.post('/api/admin/order_list', (req, res) => {
        helper.Dlog(req.body);
        var reqObj = req.body;

        checkAccessToken(req.headers, res, (userObj) => {
            db.query('SELECT `order_id`, `user_id`, `total`, `delivery_floor`, `delivery_notes`, `created_date`, `status` FROM `orders` WHERE `status` != ?', [
                "deleted"], (err, orderResult) => {
                    if (err) {
                        helper.ThrowHtmlError(err, res);
                        return;
                    }

                    let orders = [];
                    let completedOrders = 0;

                    orderResult.forEach((order) => {
                        db.query('SELECT `name`, `qty`, `price`, `image` FROM `order_items` WHERE `order_id` = ?', [
                            order.order_id], (err, itemsResult) => {
                                if (err) {
                                    helper.ThrowHtmlError(err, res);
                                    return;
                                }

                                orders.push({
                                    order_id: order.order_id,
                                    user_id: order.user_id,
                                    total: order.total,
                                    delivery_floor: order.delivery_floor,
                                    delivery_notes: order.delivery_notes,
                                    created_date: order.created_date,
                                    status: order.status,
                                    items: itemsResult
                                });

                                if (order.status === "delivered") {
                                    completedOrders++;
                                }

                                if (orders.length === orderResult.length) {
                                    res.json({
                                        "status": "1",
                                        "payload": orders,
                                        "message": msg_success,
                                        "total_orders": orders.length,
                                        "completed_orders": completedOrders
                                    });
                                }
                            })
                    });

                    if (orderResult.length === 0) {
                        res.json({
                            "status": "1",
                            "payload": [],
                            "message": msg_success,
                            "total_orders": 0,
                            "completed_orders": 0
                        });
                    }
                })
        }, "3")
    });

    app.post('/api/admin/update_order_status', (req, res) => {
        helper.Dlog(req.body);
        var reqObj = req.body;

        checkAccessToken(req.headers, res, (adminObj) => {
            helper.CheckParameterValid(res, reqObj, ["order_id", "status"], () => {
                // Validate status value
                const validStatuses = ["pending", "delivered"];
                if (!validStatuses.includes(reqObj.status)) {
                    res.json({ "status": "0", "message": "Invalid status value" });
                    return;
                }

                db.query(
                    'UPDATE `orders` SET `status` = ?, `update_date` = NOW() WHERE `order_id` = ? AND `status` != ?',
                    [reqObj.status, reqObj.order_id, "deleted"],
                    (err, result) => {
                        if (err) {
                            helper.ThrowHtmlError(err, res);
                            return;
                        }

                        if (result.affectedRows > 0) {
                            // Emit Socket.IO event for real-time updates
                            io.emit('orderStatusUpdated', {
                                order_id: reqObj.order_id,
                                status: reqObj.status,
                                updated_at: new Date().toISOString()
                            });

                            res.json({ "status": "1", "message": "Order status updated successfully" });
                        } else {
                            res.json({ "status": "0", "message": "Order not found or already deleted" });
                        }
                    }
                );
            });
        }, "3");
    });

    app.post('/api/admin/place-order', (req, res) => {
        helper.Dlog(req.body);
        var reqObj = req.body;

        checkAccessToken(req.headers, res, (adminObj) => {
            helper.CheckParameterValid(res, reqObj, ["user_id", "items", "total", "delivery_floor"], () => {
                if (!Array.isArray(reqObj.items) || reqObj.items.length === 0) {
                    res.json({ "status": "0", "message": "Invalid items array" });
                    return;
                }

                // Verify the user_id exists and is a valid user (user_type = "1")
                db.query(
                    'SELECT user_id FROM `user_detail` WHERE user_id = ? AND user_type = ? AND status = ?',
                    [reqObj.user_id, "1", "1"],
                    (err, userResult) => {
                        if (err) {
                            helper.ThrowHtmlError(err, res);
                            return;
                        }

                        if (userResult.length === 0) {
                            res.json({ "status": "0", "message": "Invalid user_id" });
                            return;
                        }

                        const userId = reqObj.user_id;

                        // Insert into orders
                        db.query(
                            'INSERT INTO `orders` (`user_id`, `total`, `delivery_floor`, `delivery_notes`, `created_date`, `status`) VALUES (?, ?, ?, ?, NOW(), ?)',
                            [userId, reqObj.total, reqObj.delivery_floor, reqObj.delivery_notes || '', 'pending'],
                            (err, orderResult) => {
                                if (err) {
                                    helper.ThrowHtmlError(err, res);
                                    return;
                                }

                                const orderId = orderResult.insertId;

                                // Insert order items
                                let itemsInserted = 0;
                                reqObj.items.forEach((item) => {
                                    db.query(
                                        'INSERT INTO `order_items` (`order_id`, `name`, `qty`, `price`, `image`) VALUES (?, ?, ?, ?, ?)',
                                        [orderId, item.name, item.qty, item.price, item.image || null],
                                        (err, itemResult) => {
                                            if (err) {
                                                helper.ThrowHtmlError(err, res);
                                                return;
                                            }
                                            itemsInserted++;
                                            if (itemsInserted === reqObj.items.length) {
                                                // All items inserted, emit Socket.IO event
                                                io.emit('newOrder', {
                                                    order_id: orderId,
                                                    user_id: userId,
                                                    total: parseFloat(reqObj.total),
                                                    delivery_floor: reqObj.delivery_floor,
                                                    delivery_notes: reqObj.delivery_notes || '',
                                                    items: reqObj.items,
                                                    created_date: new Date().toISOString(),
                                                    status: 'pending'
                                                });

                                                res.json({ "status": "1", "message": "Order placed successfully by admin", "payload": { order_id: orderId } });
                                            }
                                        }
                                    );
                                });
                            }
                        );
                    }
                );
            });
        }, "3");
    });

    app.post('/api/user/profile', (req, res) => {
        checkAccessToken(req.headers, res, (userObj) => {
            db.query(
                'SELECT name, email, mobile, address, image FROM user_detail WHERE user_id = ? AND status = "1"',
                [userObj.user_id],
                (err, result) => {
                    if (err) {
                        helper.ThrowHtmlError(err, res);
                        return;
                    }
                    if (result.length > 0) {
                        res.json({
                            status: "1",
                            payload: result[0],
                            message: "Profile fetched successfully",
                        });
                    } else {
                        res.json({ status: "0", message: "User not found" });
                    }
                }
            );
        }, "1");
    });
    
    // app.post('/api/user/update_profile', (req, res) => {
    //     var form = new multiparty.Form();
    
    //     checkAccessToken(req.headers, res, (userObj) => {
    //         form.parse(req, (err, reqObj, files) => {
    //             if (err) {
    //                 helper.ThrowHtmlError(err, res);
    //                 return;
    //             }
    
    //             helper.Dlog("--------------- Parameter --------------");
    //             helper.Dlog(reqObj);
    //             helper.Dlog("--------------- Files --------------");
    //             helper.Dlog(files);
    
    //             helper.CheckParameterValid(res, reqObj, ["name", "email", "mobile", "address"], () => {
    //                 let imagePath = reqObj.current_image ? reqObj.current_image[0] : null;
    //                 if (files.image && files.image[0]) {
    //                     var extension = files.image[0].originalFilename.substring(files.image[0].originalFilename.lastIndexOf(".") + 1);
    //                     var imageFileName = "user_images/" + helper.fileNameGenerate(extension);
    //                     var newPath = imageSavePath + imageFileName;
    
    //                     fs.rename(files.image[0].path, newPath, (err) => {
    //                         if (err) {
    //                             helper.ThrowHtmlError(err, res);
    //                             return;
    //                         }
    //                         imagePath = imageFileName;
    //                         updateProfile();
    //                     });
    //                 } else {
    //                     updateProfile();
    //                 }
    
    //                 function updateProfile() {
    //                     const updateFields = {
    //                         name: reqObj.name[0],
    //                         email: reqObj.email[0],
    //                         mobile: reqObj.mobile[0],
    //                         address: reqObj.address[0],
    //                         image: imagePath,
    //                         update_date: helper.getCurrentDateTime(),
    //                     };
    
    //                     if (reqObj.password && reqObj.password[0]) {
    //                         updateFields.password = helper.generateHash(reqObj.password[0]);
    //                     }
    
    //                     db.query(
    //                         'UPDATE user_detail SET ? WHERE user_id = ? AND status = "1"',
    //                         [updateFields, userObj.user_id],
    //                         (err, result) => {
    //                             if (err) {
    //                                 helper.ThrowHtmlError(err, res);
    //                                 return;
    //                             }
    //                             if (result.affectedRows > 0) {
    //                                 res.json({
    //                                     status: "1",
    //                                     message: "Profile updated successfully",
    //                                 });
    //                             } else {
    //                                 res.json({ status: "0", message: "Failed to update profile" });
    //                             }
    //                         }
    //                     );
    //                 }
    //             });
    //         });
    //     }, "1");
    // });

    // 2
    
    // app.post('/api/user/update_profile', (req, res) => {
    //     helper.Dlog(req.body);
    //     var reqObj = req.body;

    //     checkAccessToken(req.headers, res, (userObj) => {
    //         helper.CheckParameterValid(res, reqObj, ["name", "mobile",  "address",], () => {

    //             db.query('UPDATE `user_detail` SET `name`=?,`mobile`=?,`address`=?,`update_date`=NOW() WHERE `user_id` = ? AND `status` = ? ', [
    //                 reqObj.name, reqObj.mobile,  reqObj.address, userObj.user_id, "1"], (err, uResult) => {
    //                     if (err) {
    //                         helper.ThrowHtmlError(err, res);
    //                         return
    //                     }

    //                     if (uResult.affectedRows > 0) {
    //                         getUserData(userObj.user_id, (userObj) => {
    //                             res.json({ "status": "1", "payload": userObj, "message": msg_success })
    //                         })
    //                     } else {
    //                         res.json({ "status": "0", "message": msg_fail })
    //                     }
    //                 })
    //         })

    //     })
    // })

    app.post('/api/user/update_profile', (req, res) => {
    const reqObj = req.body;
    helper.Dlog(reqObj);
    console.log(reqObj, "reqObj");

    checkAccessToken(req.headers, res, (userObj) => {
        // Check required parameters
        const requiredParams = ["name", "email", "mobile", "address"];
        helper.CheckParameterValid(res, reqObj, requiredParams, () => {

            // Prepare fields and values for update
            const updateFields = [];
            const updateValues = [];

            // Add fields to be updated
            updateFields.push('`name` = ?', '`email` = ?', '`mobile` = ?', '`address` = ?');
            updateValues.push(reqObj.name, reqObj.email, reqObj.mobile, reqObj.address);

            // Hash and add password if provided
            if (reqObj.password && reqObj.password.trim() !== "") {
                updateFields.push('`password` = ?');
                updateValues.push(helper.createHash(reqObj.password));
            }

            // Add update timestamp
            updateFields.push('`update_date` = NOW()');

            // Complete query
            const updateQuery = `
                UPDATE user_detail 
                SET ${updateFields.join(', ')} 
                WHERE user_id = ? AND status = ?
            `;
            updateValues.push(userObj.user_id, "1");

            // Execute update query
            db.query(updateQuery, updateValues, (err, uResult) => {
                if (err) {
                    return helper.ThrowHtmlError(err, res);
                }

                if (uResult.affectedRows > 0) {
                    // Fetch updated user data
                    getUserData(userObj.user_id, (newUserObj) => {
                        res.json({ status: "1", payload: newUserObj, message: msg_success });
                    });
                } else {
                    res.json({ status: "0", message: msg_fail });
                }
            });
        });
    });
    });

    app.post('/api/user/order_history', (req, res) => {
        helper.Dlog(req.body);
        var reqObj = req.body;
    
        checkAccessToken(req.headers, res, (userObj) => {
            // Prepare query parameters
            const userId = userObj.user_id;
            let query = 'SELECT `order_id`, `user_id`, `total`, `delivery_floor`, `delivery_notes`, `created_date`, `status` FROM `orders` WHERE `user_id` = ? AND `status` != ?';
            let queryParams = [userId, "deleted"];
    
            // Add date filtering if provided
            if (reqObj.start_date && reqObj.end_date) {
                query += ' AND `created_date` BETWEEN ? AND ?';
                queryParams.push(reqObj.start_date, reqObj.end_date);
            }
    
            db.query(query, queryParams, (err, orderResult) => {
                if (err) {
                    helper.ThrowHtmlError(err, res);
                    return;
                }
    
                let orders = [];
    
                if (orderResult.length === 0) {
                    res.json({
                        "status": "1",
                        "payload": [],
                        "message": "Success"
                    });
                    return;
                }
    
                orderResult.forEach((order) => {
                    db.query('SELECT `name`, `qty`, `price`, `image` FROM `order_items` WHERE `order_id` = ?', [
                        order.order_id], (err, itemsResult) => {
                            if (err) {
                                helper.ThrowHtmlError(err, res);
                                return;
                            }
    
                            orders.push({
                                order_id: order.order_id,
                                user_id: order.user_id,
                                total: order.total,
                                delivery_floor: order.delivery_floor,
                                delivery_notes: order.delivery_notes,
                                created_date: order.created_date,
                                status: order.status,
                                items: itemsResult
                            });
    
                            if (orders.length === orderResult.length) {
                                // Sort orders by created_date (descending)
                                orders.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
    
                                res.json({
                                    "status": "1",
                                    "payload": orders,
                                    "message": "Success"
                                });
                            }
                        });
                });
            });
        }, "1"); // Assuming "1" is the role for regular users
    });

    function getUserData(user_id, callback) {
        db.query('SELECT `user_id`, `name`, `email`, `password`, `mobile`, `address`, `image`, `device_type`, `auth_token`, `user_type` FROM `user_detail` WHERE `user_id` = ? AND `status` = ?', [user_id, '1'], (err, result) => {
            if (err) {
                helper.ThrowHtmlError(err);
                return;
            }

            if (result.length > 0) {
                return callback(result[0])
            }
        })
    }

    function checkAccessToken(headerObj, res, callback, require_type = "") {
        helper.Dlog(headerObj.access_token);
        helper.CheckParameterValid(res, headerObj, ["access_token"], () => {
            db.query('SELECT `user_id`, `name`, `email`, `password`, `mobile`, `address`, `image`, `device_type`, `auth_token`, `user_type`, `status`  FROM `user_detail` WHERE `auth_token` = ? AND `status` = ?', [headerObj.access_token, "1"], (err, result) => {
                if (err) {
                    helper.ThrowHtmlError(err, res);
                    return;
                }

                helper.Dlog(result);
                if (result.length > 0) {
                    if (require_type != "") {
                        if (result[0].user_type == require_type) {
                            return callback(result[0]);
                        } else {
                            res.json({ "status": "0", "code": "404", "message": "Access denied. Unauthorized user access." })
                        }
                    } else {
                        return callback(result[0]);
                    }
                } else {
                    res.json({ "status": "0", "code": "404", "message": "Access denied. Unauthorized user access." })
                }
            })
        })
    }
}